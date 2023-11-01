# -------------------- BUILDER --------------------
FROM node:18-alpine3.17 as builder

WORKDIR     /home/app/api

# COPY REQUIRED CONFIG FILES AND INSTALL DEPENDENCIES
COPY        package.json package-lock.json ./
RUN mkdir src && npm install -g npm@10 && npm ci

## COPY SOURCES AND BUILD
COPY        tsconfig.json \
            tsconfig.build.json \
            nest-cli.json \
            ./
COPY        src \
            src

RUN         npm run build

# EXPOSE APP AND DEBUG PORT
EXPOSE      80 9229

CMD         ["npm", "run", "start:dev"]