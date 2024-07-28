# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Copy the .env file
COPY .env .env

# Generate Prisma Client
RUN npx prisma generate

# Build the Nestjs application
RUN yarn run build

# Expose the port on which your NestJS application will run
EXPOSE 3000

# Define the command to run the application
CMD ["yarn", "start:prod"]
