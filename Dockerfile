FROM ghcr.io/puppeteer/puppeteer:21.5.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app   

COPY package*.json ./

# Set permissions on the directory where your app needs to write
RUN chmod +w /usr/src/app

RUN npm ci
COPY . .
CMD ["node", "server.js"]
