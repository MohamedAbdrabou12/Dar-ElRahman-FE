# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

# Stage 2: Serve with NGINX
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy production NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the Angular build output
COPY --from=build /app/dist/dar-el-rahman/browser /usr/share/nginx/html

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
