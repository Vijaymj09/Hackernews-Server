# Base image
FROM node:22.1.0

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy source files after dependencies are installed
COPY . .

# Optional: Generate Prisma client if schema exists
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; else echo "Skipping prisma generate"; fi

# Build TypeScript files
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
