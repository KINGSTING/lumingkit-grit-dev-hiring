# Use an official Node runtime
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first
COPY package.json package-lock.json ./

# Install Node modules
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose Vite's default development port
EXPOSE 5173

# Run the Vite dev server and bind it to host network interfaces
CMD ["npm", "run", "dev", "--", "--host"]