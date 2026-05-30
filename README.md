# GRIT Hub Archive

## 💡 Overview

GRIT Hub Archive is a centralized digital repository designed to manage and track institutional publications, academic authors, and publishing entities. The application solves the problem of decentralized document management by enforcing a 3rd Normal Form (3NF) relational database structure, ensuring data integrity and allowing for robust searching, filtering, and media-rich profile management.

## 🚀 Key Features

- **Structured Archiving**: Uses a normalized relational model to manage relationships between publications, their authors, and publishers.
- **Media Management**: Seamlessly integrates Cloudinary for storage and retrieval of author avatars and publishing house cover graphics.
- **Dynamic Search & Filtering**: Provides a responsive, real-time search interface to filter data by title, type, author, publisher, or pricing.
- **Omni-Modal CRUD**: Allows users to create, read, update, and delete registry elements through an interactive, state-managed modal system.

## 🛠 Tech Stack

| Category      | Technology                         |
|---------------|------------------------------------|
| Frontend      | React, Vite, Tailwind CSS          |
| Backend       | Django, Django REST Framework      |
| Database      | MySQL 8.0                          |
| Media Storage | Cloudinary                         |
| Deployment    | Docker, Docker Compose             |

## 🏗 Architecture / Data Flow

The application follows a decoupled client-server architecture:

1. **Frontend (React)**: Serves as the presentation layer, consuming the API through `fetch` calls. It uses environment-driven base URLs (`VITE_API_URL`) to communicate with the backend.
2. **Backend (Django API)**: Acts as the business logic layer. It serializes database models into JSON and exposes RESTful endpoints for CRUD operations.
3. **Data Persistence**: MySQL acts as the relational storage engine. The application utilizes Django Migrations and SQL-initialization scripts (`database.sql`) to maintain schema state.
4. **Media Flow**: Images uploaded via the React frontend are routed through the Django `cloudinary_upload_view` utility, which handles secure transmission to Cloudinary and returns a public URL for storage in the MySQL database.

## ⚙️ Getting Started

### Prerequisites

- Docker Desktop or Docker Engine + Compose
- Git

### Installation

Step-by-step instructions to get the project running locally:

```bash
# 1. Clone the repository
git clone <your-repository-url>

# 2. Navigate to the project directory
cd grit-dev-hiring

# 3. Create your .env file
# Ensure it contains:
# CLOUDINARY_CLOUD_NAME=xxx
# CLOUDINARY_API_KEY=xxx
# CLOUDINARY_API_SECRET=xxx

# 4. Spin up the infrastructure
sudo docker compose up -d

# 5. Apply database migrations to synchronize models
sudo docker compose exec backend python manage.py migrate

# 6. Access the application
# Frontend: http://localhost:5173
# API: http://localhost:8000/api/

## 📖 Project Documentation

- **API Documentation**: The API is built using Django REST Framework; all endpoints (`/api/publications/`, `/api/authors/`, `/api/publishers/`) are automatically registered via the `DefaultRouter`.
- **Database Schema**: The system uses a 3NF design with a junction table (`api_publication_authors`) to handle many-to-many relationships between publications and authors.
- **Deployment Guide**: Use `sudo docker compose up -d --build` to deploy changes. Ensure all environment variables are mapped in `docker-compose.yml` to the container environment.

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
- **Institutional Affiliation**: Mindanao State University – Iligan Institute of Technology (MSU-IIT)