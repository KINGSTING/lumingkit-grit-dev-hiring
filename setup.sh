#!/bin/bash

set -e  # stop on any error

echo "🚀 GRIT Hub Archive – One‑Command Setup"
echo "========================================"

# 1. Stop everything and delete the database volume (fresh start)
echo "🗑️  Removing existing containers and database..."
sudo docker compose down -v

# 2. Start containers
echo "🐳 Starting services (MySQL, Django, React)..."
sudo docker compose up -d

# 3. Wait for MySQL to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# 4. Ensure API migrations exist
echo "📦 Checking for existing API migrations..."
MIGRATION_COUNT=$(sudo docker compose exec backend sh -c "ls -1 api/migrations/ | grep -v '__init__' | wc -l" | tr -d ' ')
if [ "$MIGRATION_COUNT" -eq 0 ]; then
    echo "No API migrations found. Creating initial migration..."
    sudo docker compose exec backend python manage.py makemigrations api
else
    echo "API migrations already exist."
fi

# 5. Run all migrations
echo "Applying database migrations..."
sudo docker compose exec backend python manage.py migrate

# 6. Create admin user and profile (using a heredoc for clarity)
echo "👤 Creating admin user (admin / adminpass)..."
sudo docker compose exec backend python manage.py shell <<EOF
from django.contrib.auth.models import User
from api.models import UserProfile

admin, created = User.objects.get_or_create(username='admin')
if created:
    admin.set_password('adminpass')
    admin.email = 'admin@example.com'
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()
    print('Admin user created.')

profile, prof_created = UserProfile.objects.get_or_create(user=admin, defaults={'role': 'admin'})
if not prof_created:
    profile.role = 'admin'
    profile.save()
    print('Admin profile updated.')

print('Admin user ready.')
EOF

# 7. Copy the Crossref scraper into the container
echo "📄 Copying Crossref scraper..."
sudo docker cp scrape_crossref.py grit_django_api:/app/

# 8. Install requests inside the container
echo "📦 Installing Python dependencies..."
sudo docker compose exec backend pip install requests -q

# 9. Run the scraper (populates with real data)
echo "🌐 Fetching real publications from Crossref API (may take a minute)..."
sudo docker compose exec backend python /app/scrape_crossref.py

echo ""
echo "✅ Setup complete!"
echo "🌍 Frontend: http://localhost:5173"
echo "🔐 Login: admin / adminpass"
echo ""