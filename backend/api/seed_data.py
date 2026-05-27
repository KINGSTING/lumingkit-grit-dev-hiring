import random
from datetime import date, timedelta
from api.models import Publisher, Author, Publication

def run_seeder():
    print("🚀 Initiating database 3NF seeding routine...")

    # 1. Clear existing rows to prevent unique constraint collisions
    print("🧹 Purging old registry records to guarantee a clean slate...")
    Publication.objects.all().delete()
    Author.objects.all().delete()
    Publisher.objects.all().delete()

    # 2. Seed Public Administration & Governance Publishers
    publisher_pool = [
        "UP National College of Public Administration and Governance (NCPAG)",
        "Mindanao State University - Iligan Institute of Technology (MSU-IIT)",
        "Philippine Society for Public Administration (PSPA)",
        "Development Academy of the Philippines (DAP)",
        "National Economic and Development Authority (NEDA)",
        "Department of the Interior and Local Government (DILG) Academy",
        "Asia-Pacific Journal of Social Innovation",
        "Philippine Journal of Public Administration"
    ]
    
    created_publishers = []
    for pub_name in publisher_pool:
        publisher, _ = Publisher.objects.get_or_create(name=pub_name)
        created_publishers.append(publisher)
    print(f"🏢 Successfully seeded {len(created_publishers)} institutional publishing entities.")

    # 3. Seed Realistic Author Profiles
    first_names = ["Jemar John", "Jerry", "Maria", "Antonio", "Emmanuel", "Clarissa", "Reynaldo", "Grace", "Arnel", "Josefina"]
    last_names = ["Lumingkit", "Tañajora", "Santos", "Dela Cruz", "Reyes", "Villanueva", "Aquino", "Bautista", "Castro", "Mendoza"]
    bios = [
        "Specializes in computational policy modeling, agent-based architectures, and deep reinforcement learning.",
        "Senior researcher focusing on Philippine public administration frameworks and local government autonomy.",
        "Consultant for digital governance transformations and institutional policy implementations.",
        "Analyst investigating public-private partnerships and sustainable smart-city resource systems.",
        "Academic lead focusing on community-driven waste management systems and local biosecurity protocols."
    ]

    created_authors = []
    # Create 15 distinct author profiles
    for i in range(15):
        f_name = random.choice(first_names)
        l_name = random.choice(last_names)
        # Handle structural duplicates gracefully
        if any(a.first_name == f_name and a.last_name == l_name for a in created_authors):
            f_name += f" {chr(65 + i)}" 
            
        author = Author.objects.create(
            first_name=f_name,
            last_name=l_name,
            short_bionote=random.choice(bios)
        )
        created_authors.append(author)
    print(f"✍️ Successfully seeded {len(created_authors)} academic author profiles.")

    # 4. Seed 100 Highly Specific Governance & Public Admin Publications
    title_prefixes = ["Optimizing", "Evaluating", "Assessing", "Implementing", "Restructuring", "A Simulation of", "Governing", "Framework for"]
    title_subjects = ["Household Waste Segregation Policies", "Digital Governance Standards", "Seal of Good Local Governance Pillars", "Public-Private Partnerships", "Cybersecurity Maturity", "Biosecurity Management Plans", "Network Intrusion Defenses", "Smart City Logistics Systems"]
    title_locations = ["in the Municipality of Bacolod", "in Local Government Units", "across Northern Mindanao Regional Corridors", "in Rural Agricultural Communities", "within Decentralized Government Matrices"]

    pub_types = ['Book', 'Journal Article', 'Research Paper', 'Report']
    start_date = date(2021, 1, 1)

    print("📚 Generating 100 3NF-compliant publication matrix rows...")
    for _ in range(100):
        # Generate dynamic realistic titles
        title = f"{random.choice(title_prefixes)} {random.choice(title_subjects)} {random.choice(title_locations)}"
        # Trim down safely to fit the 255 CharField constraint boundary limit
        if len(title) > 255:
            title = title[:252] + "..."

        random_days = random.randint(0, 1800)
        pub_date = start_date + timedelta(days=random_days)
        
        Publication.objects.create(
            title=title,
            publication_type=random.choice(pub_types),
            publication_date=pub_date,
            price=round(random.uniform(150.00, 1500.00), 2),
            description="Automated system evaluation and literature compilation regarding structural intervention strategies.",
            abstract="This study leverages advanced system analysis methodologies to optimize governance structures and implement digital standardization frameworks.",
            author=random.choice(created_authors),
            publisher=random.choice(created_publishers)
        )

    print("🏆 Database ingestion sequence completed! 100 records fully optimized.")