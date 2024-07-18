FROM node:22-alpine3.19

# Define arguments for the build context and run command
ARG BUILD_CONTEXT
ARG RUN_COMMAND

# Set environment variable combining both arguments for later use
ENV RUN_CONTEXT="${BUILD_CONTEXT} ${RUN_COMMAND}"

# Set the working directory
WORKDIR /usr/src/app

# Copy package manager files first to leverage Docker caching
COPY package.json package-lock.json tsconfig.json ./

# Copy the 'core' package and the specific build context package
COPY packages/core ./packages/core
COPY packages/${BUILD_CONTEXT} ./packages/${BUILD_CONTEXT}

# Install dependencies using npm, lock dependencies for reproducibility
RUN npm ci

# Build the specific package using the argument
RUN npm -w @filecoin-plus/${BUILD_CONTEXT} install

# Build the specific package using the argument
RUN npm -w @filecoin-plus/${BUILD_CONTEXT} run build 

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app using the combined RUN_CONTEXT
CMD ["sh", "-c", "npm -w @filecoin-plus/${RUN_CONTEXT} start"]