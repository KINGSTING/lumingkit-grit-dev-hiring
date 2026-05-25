# Use an official, lightweight Python runtime
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Prevent Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout and stderr (crucial for docker logs)
ENV PYTHONUNBUFFERED=1

# Install system dependencies required for mysqlclient compiling
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy the dependencies file first to leverage Docker's cache layers
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your local backend application code into the container
COPY . /app/

# Expose the default Django development port
EXPOSE 8000

# Default command to run when the container starts
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]