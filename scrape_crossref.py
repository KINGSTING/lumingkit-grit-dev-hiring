#!/usr/bin/env python3
"""
Scrape real publication data from Crossref API and insert into GRIT Hub Archive.
Uses the Django REST API with JWT authentication.
"""

import requests
import time
import re
import random
from datetime import datetime
from typing import Dict, List, Optional

# Configuration
API_BASE = "http://localhost:8000/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "adminpass"

# Crossref API parameters
CROSSREF_BASE = "https://api.crossref.org/works"
QUERY = "public policy governance philippines"      # spaces, no plus signs
ROWS = 50
FILTERS = "type:journal-article"
MAX_RECORDS = 200

def get_admin_token():
    """Obtain JWT token for admin user."""
    resp = requests.post(f"{API_BASE}/token/", json={
        "username": ADMIN_USERNAME,
        "password": ADMIN_PASSWORD
    })
    resp.raise_for_status()
    return resp.json()["access"]

def fetch_crossref_publications(query: str, rows: int = 50, offset: int = 0) -> List[Dict]:
    """Fetch publications from Crossref API."""
    params = {
        "query": query,
        "rows": rows,
        "offset": offset,
        "filter": FILTERS,
        "sort": "relevance",
        "order": "desc"
    }
    resp = requests.get(CROSSREF_BASE, params=params)
    if resp.status_code != 200:
        print(f"Crossref API error {resp.status_code}: {resp.text[:200]}")
        resp.raise_for_status()
    items = resp.json()["message"]["items"]
    print(f"Fetched {len(items)} publications from Crossref (offset={offset})")
    return items

def extract_doi(item: Dict) -> Optional[str]:
    doi = item.get("DOI")
    return doi.lower() if doi else None

def extract_title(item: Dict) -> str:
    titles = item.get("title", [])
    return titles[0].strip() if titles else "Untitled"

def extract_publication_type(item: Dict) -> str:
    type_map = {
        "journal-article": "Journal Article",
        "book": "Book",
        "book-chapter": "Book",
        "report": "Report",
        "proceedings-article": "Research Paper",
        "dissertation": "Report",
        "standard": "Report"
    }
    return type_map.get(item.get("type", ""), "Journal Article")

def extract_publication_date(item: Dict) -> str:
    date_parts = None
    if "issued" in item and item["issued"].get("date-parts"):
        date_parts = item["issued"]["date-parts"][0]
    elif "created" in item and item["created"].get("date-parts"):
        date_parts = item["created"]["date-parts"][0]
    if date_parts:
        year = date_parts[0]
        month = date_parts[1] if len(date_parts) > 1 else 1
        day = date_parts[2] if len(date_parts) > 2 else 1
        return f"{year}-{month:02d}-{day:02d}"
    return datetime.now().strftime("%Y-%m-%d")

def extract_price() -> str:
    if random.random() < 0.3:
        return "0.00"
    return f"{random.uniform(150.0, 500.0):.2f}"

def extract_description(item: Dict) -> str:
    abstract = item.get("abstract")
    if abstract:
        clean = re.sub(r'<[^>]+>', '', abstract)
        return clean[:2000]
    return "No abstract available."

def extract_authors(item: Dict) -> List[Dict]:
    authors = []
    for author in item.get("author", []):
        first = author.get("given", "") or ""
        last = author.get("family", "") or ""
        if not first and not last:
            continue
        authors.append({
            "first_name": first.strip(),
            "last_name": last.strip(),
            "short_bionote": f"{first} {last} is a contributor to this publication."
        })
    return authors

def extract_publisher(item: Dict) -> str:
    publisher = item.get("publisher")
    return publisher.strip() if publisher else "Unknown Publisher"

def get_or_create_publisher(token: str, name: str) -> Optional[int]:
    """Search for publisher by exact name, create if not found."""
    # Use search to find publisher (avoids pagination issues)
    resp = requests.get(f"{API_BASE}/publishers/?search={name}", headers={"Authorization": f"Bearer {token}"})
    if resp.status_code == 200:
        results = resp.json().get("results", [])
        for p in results:
            if p["name"].lower() == name.lower():
                return p["id"]
    # Not found – create
    resp = requests.post(f"{API_BASE}/publishers/", 
                         headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                         json={"name": name})
    if resp.status_code in (200, 201):
        return resp.json()["id"]
    else:
        print(f"Failed to create publisher '{name}': {resp.text}")
        return None

def get_or_create_author(token: str, author_data: Dict) -> Optional[int]:
    """Search for author by exact first+last name, create if not found."""
    first = author_data["first_name"]
    last = author_data["last_name"]
    # Search by full name (search works on concatenated names)
    resp = requests.get(f"{API_BASE}/authors/?search={first}%20{last}", headers={"Authorization": f"Bearer {token}"})
    if resp.status_code == 200:
        results = resp.json().get("results", [])
        for a in results:
            if a["first_name"].lower() == first.lower() and a["last_name"].lower() == last.lower():
                return a["id"]
    # Not found – create
    resp = requests.post(f"{API_BASE}/authors/",
                         headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                         json=author_data)
    if resp.status_code in (200, 201):
        return resp.json()["id"]
    else:
        print(f"Failed to create author {first} {last}: {resp.text}")
        return None

def create_publication(token: str, publication_data: Dict) -> bool:
    resp = requests.post(f"{API_BASE}/publications/",
                         headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                         json=publication_data)
    return resp.status_code in (200, 201)

def main():
    print("🚀 Starting Crossref data import...")
    token = get_admin_token()
    print("✅ Admin token obtained.")

    offset = 0
    total_created = 0
    total_skipped = 0

    while True:
        items = fetch_crossref_publications(QUERY, ROWS, offset)
        if not items:
            break

        for item in items:
            doi = extract_doi(item)
            if not doi:
                continue

            # Check if publication already exists (by DOI)
            resp = requests.get(f"{API_BASE}/publications/?search={doi}", headers={"Authorization": f"Bearer {token}"})
            if resp.ok and resp.json().get("results"):
                print(f"⏭️ Skipping {doi} – already in database.")
                total_skipped += 1
                continue

            # Extract data
            title = extract_title(item)
            pub_type = extract_publication_type(item)
            pub_date = extract_publication_date(item)
            price = extract_price()
            abstract = extract_description(item)
            publisher_name = extract_publisher(item)

            # Get or create publisher (now uses search)
            publisher_id = get_or_create_publisher(token, publisher_name)
            if publisher_id is None:
                continue

            # Process authors (now uses search)
            authors_data = extract_authors(item)
            author_ids = []
            for auth in authors_data:
                if auth["first_name"] and auth["last_name"]:
                    aid = get_or_create_author(token, auth)
                    if aid:
                        author_ids.append(aid)

            # Prepare publication payload
            pub_payload = {
                "doi": doi,
                "title": title,
                "publication_type": pub_type,
                "publication_date": pub_date,
                "price": price,
                "abstract": abstract,
                "description": abstract,
                "publisher": publisher_id,
                "authors": author_ids,
                "pdf_url": None
            }

            if create_publication(token, pub_payload):
                total_created += 1
                print(f"✅ Created: {title} (DOI: {doi})")
            else:
                print(f"❌ Failed: {title} (DOI: {doi})")

            time.sleep(0.5)  # respect Crossref rate limits

        offset += ROWS
        if offset >= MAX_RECORDS:
            break

    print(f"\n🎉 Import finished. Created: {total_created}, Skipped: {total_skipped}")

if __name__ == "__main__":
    main()