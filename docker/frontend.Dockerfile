# Use official Node 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY dashboard/package*.json ./
RUN npm install

# Copy application code
COPY dashboard/ .

# Expose Vite port (default 5173)
EXPOSE 5173

# Run Vite dev server in host mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
