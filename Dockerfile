# Use Debian-based Node image (supports apt-get)
FROM node:22-bullseye

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start app
CMD ["npm", "start"]