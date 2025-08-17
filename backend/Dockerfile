FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clear npm cache and install dependencies with verbose logging
RUN npm cache clean --force
RUN npm ci --verbose

# Copy source code and built files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start the compiled JavaScript application
CMD ["node", "dist/index.js"]