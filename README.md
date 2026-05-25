# GRIT Publication Archiving & Bookkeeping System

A production-grade, containerized Full-Stack Web Application built for the **Governance, Reform, Innovation and Transformation Collaboratories (GRIT)** Development and Analytics Team hiring technical examination.

This project showcases a fully decoupled architecture featuring a reactive user interface, a robust RESTful API, and a rigorously normalized relational database.

---

## 🏗️ System Architecture

The application is engineered as a distributed multi-container ecosystem using Docker Compose:

* **Frontend:** Single Page Application (SPA) built using **React** and **Vite**, styled with utility-first **Tailwind CSS**. It communicates asynchronously with the backend data channels over HTTP via `fetch()`.
* **Backend:** High-performance REST API built using **Django** and **Django REST Framework (DRF)**. It leverages Class-Based Views (`ModelViewSet`) to handle clean routing and serializes database data pipelines cleanly into JSON.
* **Database:** **MySQL 8.0** relational database server, isolated completely within an internal bridged container network.

---

## 📊 Database Design & Normalization (Prompt 2)

To prevent data redundancy, eliminate update/delete anomalies, and optimize query latency, the initial unstructured field parameters have been fully normalized into **Third Normal Form (3NF)** across three distinct relational entities:

1.  `api_publisher`: Stores corporate/entity publication origins.
2.  `api_author`: Manages singular biographical registries (`first_name`, `last_name`, `short_bionote`).
3.  `api_publication`: Houses core literary entries mapped via structural foreign key constraints (`publisher_id`, `author_id`) that enforce referential integrity using `ON DELETE RESTRICT` and `ON UPDATE CASCADE`.

### Entity Relationship Diagram (ERD)
*The physical diagram deliverable can be found in your local repository tracking path at `/docs/erd.png` (or whichever format you exported).*

---

## 🛠️ Quickstart Installation (One-Command Deployment)

Because the system is fully containerized, there is **no need to manually install Python, Node.js, or MySQL** on your local operating system. 

### Prerequisites
* Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) or the Docker Engine + Docker Compose plugin installed on your host system.

### Spin Up the Application
From the root directory of the repository containing the `docker-compose.yml` file, run the following command in your terminal:

```bash
docker compose up --build
