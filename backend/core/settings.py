# 1. Add DRF and CORS to your Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-Party Apps
    'rest_framework',
    'corsheaders',
    
    # Your Local App
    'api',
]

# 2. Add CorsMiddleware to the top of your Middleware list
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.view.clickjacking.XFrameOptionsMiddleware',
]

# 3. Swap out the default SQLite setup for your Docker MySQL configuration
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'grit_archive'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'rootpassword'),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),  # 'db' when running in Docker, 127.0.0.1 for local testing
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

# 4. Enable CORS so your React application (running on port 5173) can fetch data
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]