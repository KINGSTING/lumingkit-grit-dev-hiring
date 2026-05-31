#!/usr/bin/env python3
import json
import random
import requests
from datetime import datetime, timedelta

API_BASE_URL = 'http://localhost:8000/api'

def get_token():
    """Obtain JWT access token using admin credentials."""
    auth_url = f"{API_BASE_URL}/token/"
    response = requests.post(auth_url, json={"username": "admin", "password": "adminpass"})
    if response.status_code == 200:
        return response.json().get('access')
    else:
        print(f"❌ Failed to obtain token: {response.text}")
        return None

def seed_database():
    print("🚀 Initializing Relational Data Seeding Matrix...")

    token = get_token()
    if not token:
        print("❌ Cannot proceed without authentication token.")
        return

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    # 1. Generate Core Publishing House Nodes
    publisher_names = [
        "UP NCPAG Research Executive Council",
        "MSU-IIT Comprehensive Policy Center",
        "Philippine Journal of Public Administration",
        "Asia-Pacific Journal of Social Innovation",
        "IEEE R10 Student Innovation Press",
        "National Economic and Development Authority (NEDA)",
        "Department of the Interior and Local Government (DILG)",
        "Philippine Army Signal Regiment Archives"
    ]
    
    # Get existing publishers to avoid duplicates
    existing_pubs = {}
    resp = requests.get(f"{API_BASE_URL}/publishers/", headers=headers)
    if resp.status_code == 200:
        for p in resp.json().get('results', []):
            existing_pubs[p['name']] = p['id']

    publisher_ids = []
    print("🏢 Injecting Publishing Entities...")
    for name in publisher_names:
        if name in existing_pubs:
            publisher_ids.append(existing_pubs[name])
            continue
        res = requests.post(f"{API_BASE_URL}/publishers/", json={"name": name}, headers=headers)
        if res.status_code in [200, 201]:
            publisher_ids.append(res.json()['id'])
            print(f"   + Created publisher: {name}")
        else:
            print(f"   ⚠️ Failed to create publisher {name}: {res.text}")

    if not publisher_ids:
        print("❌ Error: Could not populate publishers. Is the backend down?")
        return

    # 2. Generate Core Scholar Nodes (30 Distinct Authors)
    first_names = ["Jemar John", "Jerry", "Maria", "Antonio", "Emmanuel", "Grace", "Sarah", "Juan", "Cris", "Datu"]
    last_names = ["Lumingkit", "Tañajora", "Santos", "Dela Cruz", "Macapaar", "Pangandaman", "Ramos", "Bautista", "Aquino"]
    bionotes = [
        "Computational Policy Researcher specializing in Agent-Based Modeling.",
        "Cybersecurity Maturity Analyst and Cryptographic Network Systems Engineer.",
        "Public Administration Specialist focusing on Digital Governance frameworks.",
        "Local Government Unit Risk Assessment and Policy Matrix Evaluator.",
        "Military Signal Regiment Communications and Defense Infrastructure Expert."
    ]

    author_ids = []
    print("✍️ Injecting Core Scholar Profiles...")
    for i in range(30):
        # For first author, force a known name to appear often
        fn = random.choice(first_names)
        ln = random.choice(last_names) if i > 0 else "Lumingkit"
        payload = {
            "first_name": fn,
            "last_name": ln,
            "short_bionote": random.choice(bionotes)
        }
        res = requests.post(f"{API_BASE_URL}/authors/", json=payload, headers=headers)
        if res.status_code in [200, 201]:
            author_ids.append(res.json()['id'])
        else:
            print(f"   ⚠️ Failed to create author {fn} {ln}: {res.text}")

    if not author_ids:
        print("❌ No authors created. Aborting.")
        return

    # 3. Generate 200 Multi-Author Publications
    pub_types = ["Book", "Journal Article", "Research Paper", "Report"]
    policy_topics = [
        "Optimizing Household Waste Segregation Policy via Deep Reinforcement Learning",
        "Assessing Cybersecurity Maturity Standards Across Local Government Units",
        "Institutionalizing a Digital Governance Pillar in the Seal of Good Local Governance",
        "Agent-Based Simulation Modeling for Public-Private Partnership Sandboxes",
        "Tactical Cryptographic Protocols for Tactical Defense Network Infrastructures",
        "Intergenerational Public Policy Shifts in Decentralized Municipalities",
        "Evaluating Computational Policy Interventions in Barangay Config Implementations"
    ]

    print("📚 Injecting 200 Relational Many-to-Many Publication Nodes...")
    base_date = datetime(2026, 5, 27)
    
    for i in range(1, 201):
        topic = random.choice(policy_topics)
        title = f"{topic} - Volume {i} (Draft Revision)"
        
        random_days = random.randint(0, 730)
        pub_date = (base_date - timedelta(days=random_days)).strftime("%Y-%m-%d")
        
        price = "0.00" if random.random() < 0.25 else f"{random.uniform(150.00, 450.00):.2f}"
        
        sampled_authors = random.sample(author_ids, k=random.randint(1, 4))
        
        pub_payload = {
            "doi": f"10.1234/grit.{i:04d}",          # Unique DOI for each publication
            "title": title,
            "publication_type": random.choice(pub_types),
            "publication_date": pub_date,
            "price": price,
            "description": f"Archival data record node mapping policy metrics for execution string sequence {i}.",
            "abstract": f"This dataset unrolls simulation variations exploring iterative governance impacts regarding {topic.lower()}. Verified under production optimization configurations.",
            "publisher": random.choice(publisher_ids),
            "authors": sampled_authors
        }

        res = requests.post(f"{API_BASE_URL}/publications/", json=pub_payload, headers=headers)
        if res.status_code not in [200, 201]:
            print(f"   ❌ Failed to create publication #{i}: {res.text}")
        elif i % 25 == 0:
            print(f"   -> Progress checkpoint: {i}/200 records committed securely.")

    print("\n🎉 Database Seeding Operation Complete!")
    print(f"Successfully generated 200 publications, cross-linked with authors reused across multiple works.")

if __name__ == '__main__':
    seed_database()