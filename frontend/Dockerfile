FROM node:18-alpine3.17 as builder

WORKDIR     /app

# COPY REQUIRED CONFIG FILES AND INSTALL DEPENDENCIES
COPY        package.json \
            package-lock.json \
            ./
RUN         npm install -g npm@9 && npm ci

## COPY SOURCES AND BUILD
COPY        tsconfig.json \
            tsconfig.app.json \
            angular.json \
            ./

COPY        src \
            src

RUN         npm run build

FROM nginx:1.25.3-alpine as nginx
# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/front /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
