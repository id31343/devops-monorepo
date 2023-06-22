FROM node:18.16.0-alpine

# Create directory with non-root user ownership
RUN mkdir -p /app && chown -R node:node /app

# Switch working directory
WORKDIR /app

# Switch to non-root user
USER node

# Copy package.json and package-lock.json before copying app code
# to ensure you don't rebuild modules each time you rebuild the container
COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts

# Copy app code
COPY --chown=node:node . .

EXPOSE 8000

CMD ["npm", "run", "start:prod"]