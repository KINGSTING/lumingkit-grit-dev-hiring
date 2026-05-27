#!/usr/bin/env python3
import json
import random
import requests
from datetime import datetime, timedelta

API_BASE_URL = 'http://localhost:8000/api'

def seed_database():
    print("🚀 Initializing Relational Data Seeding Matrix...")

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
    
    publisher_ids = []
    print("🏢 Injecting Publishing Entities...")
    for name in publisher_names:
        res = requests.post(f"{API_BASE_URL}/publishers/", json={"name": name})
        if res.status_code in [200, 201]:
            publisher_ids.append(res.json()['id'])
            
    if not publisher_ids:
        print("❌ Error: Could not populate publishers. Is the backend down?")
        return

    # 2. Generate Core Scholar Nodes (30 Distinct Authors to mix and match)
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
    # Generate 30 distinct random authors to ensure a rich selection pool
    for i in range(30):
        payload = {
            "first_name": random.choice(first_names),
            "last_name": random.choice(last_names) if i > 0 else "Lumingkit", # Guarantee matching primary items
            "short_bionote": random.choice(bionotes)
        }
        res = requests.post(f"{API_BASE_URL}/authors/", json=payload)
        if res.status_code in [200, 201]:
            author_ids.append(res.json()['id'])

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
        # Determine unique variations for titles
        topic = random.choice(policy_topics)
        title = f"{topic} - Volume {i} (Draft Revision)"
        
        # Pick a random date within the last 2 years
        random_days = random.randint(0, 730)
        pub_date = (base_date - timedelta(days=random_days)).strftime("%Y-%m-%d")
        
        # Pick a random valuation (mix of free and premium models)
        price = "0.00" if random.random() < 0.25 else f"{random.uniform(150.00, 450.00):.2f}"
        
        # CRITICAL REUSE MATRIX RULE: Pick 1 to 4 authors randomly for this specific paper
        # Because we pick from the exact same pool of 30 authors 200 times, authors will naturally 
        # co-author multiple papers together, thoroughly populating your M:N bridge mapping.
        sampled_authors = random.sample(author_ids, k=random.randint(1, 4))
        
        pub_payload = {
            "title": title,
            "publication_type": random.choice(pub_types),
            "publication_date": pub_date,
            "price": price,
            "description": f"Archival data record node mapping policy metrics for execution string sequence {i}.",
            "abstract": f"This dataset unrolls simulation variations exploring iterative governance impacts regarding {topic.lower()}. Verified under production optimization configurations.",
            "publisher": random.choice(publisher_ids),
            "authors": sampled_authors # Injects the clean Many-to-Many primary key integer array list
        }

        res = requests.post(f"{API_BASE_URL}/publications/", json=pub_payload)
        if i % 25 == 0:
            print(f"   -> Progress checkpoint: {i}/200 records committed securely.")

    print("\n🎉 Database Seeding Operation Complete!")
    print(f"Successfully generated 200 publications, cross-linked with authors reused across multiple works.")

if __name__ == '__main__':
    seed_database()