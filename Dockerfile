# NodeJS Version 22 LTS
FROM node:22.15.0-alpine

ARG CACHEBUST=1
RUN echo "Cache busting argument: $CACHEBUST"

# Set working directory
WORKDIR /app

# Copy everything
COPY . ./

# Copy package files separately (for cache efficiency)
COPY package.json ./

# Install Node packages
RUN npm install --force

# Build the app
RUN npm run build

# Set environment
ENV NODE_ENV=production


EXPOSE 3000

# Default app command
CMD ["npm", "run", "start"]
