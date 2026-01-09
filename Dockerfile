# Microserviço Produtos - FIAP SOAT
# Use the official Node.js image as the base image
FROM node:20

# Set timezone environment variable
ENV TZ=America/Sao_Paulo

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Copy start script that runs the application
COPY start.sh ./
RUN chmod +x start.sh

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["./start.sh"]
