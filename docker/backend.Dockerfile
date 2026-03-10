# Use official Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (for Playwright/PostgreSQL/MySQL client)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    default-libmysqlclient-dev \
    pkg-config \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY api/install_deps.py .
RUN python install_deps.py

# Install Playwright browsers (requested for testing)
RUN pip install playwright && playwright install --with-deps chromium

# Copy application code
COPY api/ ./api/
COPY nexusqa/ ./nexusqa/
COPY .env .

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Expose FastAPI port
EXPOSE 8000

# Run uvicorn on startup
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
