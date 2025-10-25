# Step 1: Build the Angular app
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project and build for production
COPY . .
RUN npm run build:prod

# Step 2: Serve with NGINX
FROM nginx:1.27-alpine

# Copy NGINX config template (with ${PORT})
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy the build output to NGINX html directory
COPY --from=build /app/dist/dar-el-rahman/browser /usr/share/nginx/html

# Copy a custom NGINX config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
