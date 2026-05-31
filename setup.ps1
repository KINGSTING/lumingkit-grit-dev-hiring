# GRIT Hub Archive - One-Command Setup for Windows (PowerShell)

Write-Host "GRIT Hub Archive - One-Command Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Stop everything and delete the database volume (fresh start)
Write-Host "Removing existing containers and database..." -ForegroundColor Yellow
docker compose down -v

# 2. Start containers
Write-Host "Starting services (MySQL, Django, React)..." -ForegroundColor Yellow
docker compose up -d

# 3. Wait for MySQL to be ready
Write-Host "Waiting 15 seconds for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 4. Ensure API migrations exist and apply them
Write-Host "Preparing and running database migrations..." -ForegroundColor Yellow

Write-Host "Checking for existing API migrations..." -ForegroundColor Yellow
$checkMigrations = docker compose exec backend sh -c "ls -1 api/migrations/ | grep -v '__init__' | wc -l"
if ($checkMigrations -eq 0) {
    Write-Host "No API migrations found. Creating initial migration..." -ForegroundColor Yellow
    docker compose exec backend python manage.py makemigrations api
} else {
    Write-Host "API migrations already exist." -ForegroundColor Yellow
}

# Apply all migrations (including api)
docker compose exec backend python manage.py migrate

# 5. Create admin user and profile using a temporary script loaded via shell redirection
Write-Host "Creating admin user (admin / adminpass)..." -ForegroundColor Yellow

$adminScript = @'
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
'@

$tempFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempFile -Value $adminScript -Encoding ASCII
docker cp $tempFile grit_django_api:/app/temp_admin.py
# Run the script using Django's shell (so settings are loaded)
docker compose exec backend bash -c "python manage.py shell < /app/temp_admin.py"
Remove-Item $tempFile

# 6. Copy the Crossref scraper into the container
Write-Host "Copying Crossref scraper..." -ForegroundColor Yellow
docker cp scrape_crossref.py grit_django_api:/app/

# 7. Install requests inside the container
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
docker compose exec backend pip install requests -q

# 8. Run the scraper
Write-Host "Fetching real publications from Crossref API (may take a minute)..." -ForegroundColor Yellow
docker compose exec backend python /app/scrape_crossref.py

Write-Host ""
Write-Host "Setup complete! Refresh your browser." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Login: admin / adminpass" -ForegroundColor Green
Write-Host ""