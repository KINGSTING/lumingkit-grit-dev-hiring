# GRIT Hub Archive

## 💡 Overview

GRIT Hub Archive is a centralized digital repository designed to manage and track institutional publications, academic authors, and publishing entities. The application solves the problem of decentralized document management by enforcing a 3rd Normal Form (3NF) relational database structure, ensuring data integrity and allowing for robust searching, filtering, and media-rich profile management.

## 🚀 Key Features

- **Structured Archiving**: Uses a normalized relational model to manage relationships between publications, their authors, and publishers.
- **Media Management**: Seamlessly integrates Cloudinary for storage and retrieval of author avatars, publishing house cover graphics, and full‑text PDFs.
- **Dynamic Search & Filtering**: Server‑side search across titles, authors, publishers, DOI, and abstracts, with pagination and user‑selectable page size.
- **Omni‑Modal CRUD**: Create, read, update, and delete registry elements through interactive modals.
- **Authentication & RBAC**: JWT‑based authentication with two roles: **public** (read‑only) and **admin** (full CRUD). Login required for write operations.
- **Persistent Identifiers**: Each publication gets a unique DOI (Digital Object Identifier) that links to a permanent `doi.org` URL.
- **Audit Logging**: Every create, update, and delete operation is logged with the user and timestamp (using `django‑auditlog`).

## 🛠 Tech Stack

| Category      | Technology                                     |
|---------------|------------------------------------------------|
| Frontend      | React, Vite, Tailwind CSS, React Hooks        |
| Backend       | Django, Django REST Framework, Simple JWT     |
| Database      | MySQL 8.0                                      |
| Media Storage | Cloudinary (images + PDFs)                    |
| Deployment    | Docker, Docker Compose                        |

## 🏗 Architecture / Data Flow

The application follows a decoupled client‑server architecture:

1. **Frontend (React)**: Serves as the presentation layer, consuming the API through `fetch` calls. It uses environment‑driven base URLs (`VITE_API_URL`) to communicate with the backend. JWT tokens are stored in `localStorage` and attached to every authenticated request.
2. **Backend (Django API)**: Acts as the business logic layer. It serializes database models into JSON and exposes RESTful endpoints for CRUD operations. It enforces role‑based permissions using custom permission classes.
3. **Data Persistence**: MySQL acts as the relational storage engine. The application uses Django migrations to keep the schema in sync. An optional `database.sql` script is provided for initial setup.
4. **Media Flow**: Images and PDFs uploaded via the React frontend are sent to Cloudinary (via a dedicated Django endpoint) and returned as secure URLs stored in the database. PDF delivery is enabled through Cloudinary’s raw file support.
5. **Authentication**: JWT tokens are obtained via `/api/token/` (customized to include the user’s role). The token is then used in the `Authorization: Bearer ...` header for all write operations.

## ⚙️ Getting Started

### Prerequisites

- Docker Desktop or Docker Engine + Compose
- Git
- Cloudinary account (free tier works)

### Installation

Step‑by‑step instructions to get the project running locally:

```bash
# 1. Clone the repository
git clone https://github.com/KINGSTING/lumingkit-grit-dev-hiring

# 2. Navigate to the project directory
cd grit-dev-hiring

# 3. Create your .env file with Cloudinary credentials
# Required variables:
#   CLOUDINARY_CLOUD_NAME=your_cloud_name
#   CLOUDINARY_API_KEY=your_api_key
#   CLOUDINARY_API_SECRET=your_api_secret

# 4. Spin up the infrastructure
sudo docker compose up -d

# 5. Apply Django migrations (creates all tables)
sudo docker compose exec backend python manage.py migrate

# 6. (Optional) Create predefined admin user
sudo docker compose exec backend python manage.py shell -c "
from django.contrib.auth.models import User
from api.models import UserProfile
admin, _ = User.objects.get_or_create(username='admin')
admin.set_password('adminpass')
admin.email = 'admin@example.com'
admin.is_staff = True
admin.is_superuser = True
admin.save()
UserProfile.objects.get_or_create(user=admin, defaults={'role': 'admin'})
print('Admin user created with password: adminpass')
"

# 7. (Optional) Seed the database with 200 sample publications
#    (run after backend is fully running)
python3 seed.py   # provided in the repository

# 8. Access the application
#    Frontend: http://localhost:5173
#    API:      http://localhost:8000/api/

```
**Default admin credentials** (after step 6):
- Username: `admin`
- Password: `adminpass`

## 📖 Project Documentation

- **API Documentation**: The API is built using Django REST Framework; all endpoints (`/api/publications/`, `/api/authors/`, `/api/publishers/`) are automatically registered via the `DefaultRouter`. Pagination is controlled by `?page=X&page_size=Y`. Search is performed with `?search=term` and works across titles, authors, publishers, DOI, and abstracts.

- **Database Schema**: The system uses a 3NF design with a junction table (`api_publication_authors`) to handle many‑to‑many relationships between publications and authors. The `UserProfile` table extends Django’s `User` model with a `role` field (`admin` or `public`).

- **Security & RBAC**: JWT authentication with token expiry (1 hour). Only authenticated admin users can create, edit, or delete records. Public users have read‑only access and cannot see the creation buttons.

- **Audit Logging**: All changes to `Publication`, `Author`, and `Publisher` models are automatically logged by `django‑auditlog`. Login events are also logged via a custom signal.

- **Deployment Guide**: Use `sudo docker compose up -d --build` to rebuild images and apply changes. Ensure all environment variables are mapped in `docker-compose.yml`.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📜 License

This project is distributed under the [MIT License](https://opensource.org/licenses/MIT).

## 📧 Contact

- **Name**: Jemar John J. Lumingkit
- **Project Role**: Lead Developer
- **Email**: jemarjohn.lumingkit@g.msuiit.edu.ph