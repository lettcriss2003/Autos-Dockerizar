
# Autos

Catálogo de autos, en primer lugar se debe crear, un Dockerfile para el back y el front de la aplicación


## docker-compose

```bash
version: '3.9'

services:
  mysql:
    image: mysql:latest
    container_name: practica2_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_USER: desarrollo
      MYSQL_PASSWORD: desarollo
      MYSQL_DATABASE: dbauto
    ports:
      - "3307:3306"
    networks:
      - auto_network

  backend:
    build:
      context: ./back_u2
    container_name: auto_backend
    environment:
      DB_USERNAME: desarrollo
      DB_PASSWORD: desarollo
      DB_NAME: dbauto
      DB_HOST: practica2_mysql
      DB_DIALECT: mysql
    ports:
      - "3006:3006"
    depends_on:
      - mysql
    networks:
      - auto_network

  frontend:
    build:
      context: ./front_u2
    container_name: auto_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - auto_network

networks:
  auto_network:
    driver: bridge

```

## Dockerfile - auto_frontend

```bash
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

```

## Dockerfile - auto_backend
```bash
FROM node:20

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY . .

RUN npm install

EXPOSE 3006

CMD ["npm", "start"]
```
