# NodeJS Version 22 LTS
FROM node:22-bullseye



ARG CACHEBUST=1
RUN echo "Cache busting argument: $CACHEBUST"


# Puppeteer needs dependencies
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  libgbm1 \
  libgtk-3-0 \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*



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

EXPOSE 3005

# Default app command
CMD ["npm", "run", "start"]

