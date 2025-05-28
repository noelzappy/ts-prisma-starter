# NodeJS Version 22 LTS
FROM node:22-bullseye

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Copy package files separately (for cache efficiency)
COPY package.json ./

# Enable corepack
RUN corepack enable

# Install Node packages
RUN npm install

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

# Default app command
CMD ["npm", "run", "start"]
