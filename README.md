# Fullstack App - Backend + Frontend + MySQL (Docker)

Este proyecto es una app Dockerizada, compuesta por un front, un
back y una DB (MySQL), todos ejecutados en contenedores de Docker.

## Stack

-   Backend: Flask
-   Frontend: Vite + React.
-   Base de Datos: MySQL 8
-   Orquestación: Docker y Docker Compose

## Requisitos

Antes de comenzar, asegurarse de tener instalado:

-   Docker
-   Docker Compose

## Cómo ejecutar el proyecto

### 1. Clonar el repo

    git clone https://github.com/ctomatis/curly-robot.git
    cd curly-robot

### 2. Compilar y ejecutar los servicios

    docker compose up --build

Servicios disponibles:

  👉 Front (Vite + React): http://localhost:5173 

  Back (Flask API): http://localhost:5000

  DB (MySQL): localhost:3306

Para levantar en segundo plano:

    docker compose up -d

## Reiniciar la aplicación

    docker compose down
    docker compose up --build

## Detener servicios

    docker compose down

O con borrado de volúmenes:

    docker compose down -v

## Estructura (parcial) del proyecto
    .
    ├── backend/
    │   ├── wsgi.py
    │   ├── requirements.txt
    ├── frontend/
    │   ├── package.json
    ├── docker-compose.yml
    └── README.md
