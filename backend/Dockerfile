# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for production build if needed)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Copy .env if it exists (for production values)
# Note: In production, use docker-compose environment variables instead

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
