# Solid GymPass API

[![Run E2E Tests](https://github.com/andredevic/API_solid_GymPass/actions/workflows/e2e.tests.yml/badge.svg)](https://github.com/andredevic/API_solid_GymPass/actions/workflows/e2e.tests.yml)
[![Run Unit Tests](https://github.com/andredevic/API_solid_GymPass/actions/workflows/run-unit-tests.yml/badge.svg)](https://github.com/andredevic/API_solid_GymPass/actions/workflows/run-unit-tests.yml)
![Language](https://img.shields.io/github/languages/top/andredevic/API_solid_GymPass)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Project Status:** In Development 🚧

---

## 📜 Table of Contents

- [About The Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🚀 Key Concepts Implemented](#-key-concepts-implemented)
  - [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
  - [Refresh Token](#refresh-token)
- [🛠️ Tech Stack](#-tech-stack)
- [🏁 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🧪 Testing the API (with Insomnia/Postman)](#-testing-the-api-with-insomniapostman)
  - [Step 1: Create a User and Authenticate](#step-1-create-a-user-and-authenticate)
  - [Step 2: Accessing Protected Routes](#step-2-accessing-protected-routes)
  - [Step 3: Accessing Admin Routes](#step-3-accessing-admin-routes)
  - [Step 4: Refreshing the Access Token](#step-4-refreshing-the-access-token)
- [📜 Available Scripts](#-available-scripts)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [📄 License](#-license)

---

## 📖 About The Project

This is a robust RESTful API developed as the backend for a **GymPass-style application**. The project was built following **SOLID** design principles and **Clean Architecture**, ensuring clean, scalable, and easily maintainable code.

The application allows users to register, find gyms, perform check-ins, and more, featuring a role-based access control system (Member vs. Admin).

---

## ✨ Key Features

- **Authentication & Profile:** User registration and login with JWT authentication, as well as profile viewing.
- **Gym Management:** Registration of new gyms (restricted to administrators).
- **Gym Search:** Search for gyms by name or proximity (within a 10km radius).
- **Check-in System:** Users can check into nearby gyms.
- **Check-in Validation:** Administrators can validate user check-ins within 20 minutes of their creation.
- **History & Metrics:** Users can view their check-in history and metrics.

---

## 🚀 Key Concepts Implemented

In addition to its features, the project implements industry-standard patterns to ensure security and a great user experience.

### Role-Based Access Control (RBAC)

Access control is based on user roles (`Role`). There are two access levels:
- `MEMBER`: Standard user, can search for gyms and perform check-ins.
- `ADMIN`: User with elevated privileges, can register gyms and validate check-ins.

This is implemented via middleware that verifies the user's role on specific routes, such as `POST /gyms` and `PATCH /check-ins/:checkInId/validate`.

### Refresh Token

To enhance security and user experience, the API uses a **Refresh Token** system:
1.  Upon authenticating, the user receives a short-lived `token` and a `refreshToken`.
2.  The `token` is used to access protected routes.
3.  When the `token` expires, instead of forcing a new login, the client application can use the `refreshToken` (which is stored securely, e.g., in an HTTP Only cookie) to request a new access token via the `PATCH /token/refresh` route.

---

## 🛠️ Tech Stack

| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment for the backend. |
| **TypeScript** | JavaScript superset that adds static typing. |
| **Fastify** | High-performance, low-overhead web framework. |
| **Prisma** | Next-generation ORM for Node.js and TypeScript. |
| **PostgreSQL** | Robust, open-source relational database. |
| **Vitest** | Blazing fast unit and integration testing framework. |
| **Zod** | Schema and type validation library. |
| **Docker** | Platform for developing, deploying, and running applications in containers. |
| **GitHub Actions**| CI/CD automation for tests and builds. |

---

## 🏁 Getting Started

Follow the steps below to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 20 or higher)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
    cd YOUR_REPOSITORY
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - Create a copy of the example file `.env.example` and rename it to `.env`.
      ```bash
      cp .env.example .env
      ```
    - Fill in the variables in the `.env` file. For the Docker environment, the default values should work.
      ```env
      # .env
      DATABASE_URL="postgresql://docker:docker@db:5432/apisolid?schema=public"
      JWT_SECRET="your-jwt-secret-here"
      PORT=3333
      ```

4.  **Start the environment with Docker:**
    - This command will build the image, start the API and database containers, run migrations, and seed the database with initial data.
    ```bash
    npm run docker:dev
    ```

🎉 The API will be running at `http://localhost:3333`.

---

## 🧪 Testing the API (with Insomnia/Postman)

When you start the application with `npm run docker:dev`, an **Administrator** user is automatically created by the seed script to make it easier to test protected routes.

The following guide demonstrates the key user flows: creating a standard **Member** account, using the pre-seeded **Admin** account, and performing the complete check-in process.

### Step 1: Testing as a `MEMBER` (Regular User)

First, let's simulate the flow of a standard user.

1.  **Create a new user:**
    - `POST` `http://localhost:3333/users`
    - Body (JSON):
      ```json
      {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```

2.  **Authenticate as the new user:**
    - `POST` `http://localhost:3333/sessions`
    - Body (JSON):
      ```json
      {
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```
    - **Save the `token`** from the response. This is your `MEMBER` token.

### Step 2: Testing as an `ADMIN`

Now, let's use the pre-seeded administrator account to test admin-only features.

1.  **Authenticate as the Admin:**
    - `POST` `http://localhost:3333/sessions`
    - Body (JSON):
      ```json
      {
        "email": "andre@andre.com",
        "password": "123456"
      }
      ```
    - **Save this new `token`**. This is your `ADMIN` token.

2.  **Access an Admin-only route (creating a gym):**
    - `POST` `http://localhost:3333/gyms`
    - Add the **`ADMIN` token** to the `Authorization: Bearer <TOKEN>` header.
    - Body (JSON):
      ```json
      {
        "title": "Code Gym",
        "description": "The best gym for devs",
        "phone": "11999999999",
        "latitude": -23.563853,
        "longitude": -46.656507
      }
      ```
    - The gym will be created successfully. **Save the `id` of the created gym** from the response for the next step.

### Step 3: Testing the Check-in Flow

This flow requires actions from both a `MEMBER` and an `ADMIN`.

1.  **Create a Check-in (as a `MEMBER`):**
    - Use the **`MEMBER` token** (`John Doe's` token) in the `Authorization` header.
    - `POST` `http://localhost:3333/gyms/YOUR_GYM_ID/check-ins`
      - (Replace `YOUR_GYM_ID` with the ID you saved from Step 2).
    - Body (JSON): This is required to validate the user's distance from the gym. Use coordinates close to the gym's location.
      ```json
      {
        "latitude": -23.563899,
        "longitude": -46.656599
      }
      ```
    - A new check-in will be created. **Save the `id` of the check-in** from the response.

2.  **Validate the Check-in (as an `ADMIN`):**
    - Now, switch to the **`ADMIN` token** in the `Authorization` header.
    - `PATCH` `http://localhost:3333/check-ins/YOUR_CHECK_IN_ID/validate`
      - (Replace `YOUR_CHECK_IN_ID` with the ID you saved from the previous request).
    - This request does not need a body.
    - The check-in will be successfully validated. This demonstrates the RBAC perfectly, as a `MEMBER` cannot perform this action.

### Step 4: Refreshing the Access Token

When your token expires, use the refresh route. Insomnia/Postman handles cookies automatically.

- `PATCH` `http://localhost:3333/token/refresh`
- This request does not need a body or an `Authorization` header.
- The response will contain a new, valid `token`.
---

## 📜 Available Scripts

- `npm run start:dev`: Starts the application in development mode with hot-reload.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run test`: Runs unit tests.
- `npm run test:e2e`: Runs End-to-End tests (requires a test database).
- `npm run docker:dev`: Starts the complete environment (API + Database) with Docker.
- `npm run docker:down`: Stops and removes the Docker containers and volumes.

---

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and testing.

1.  **Trigger:** The workflows are triggered on every `pull_request` opened against the `master` branch.
2.  **Workflows:**
    - **Unit Tests:** A fast job that installs dependencies and runs `npm run test`. It ensures that the core business logic is correct.
    - **E2E Tests:** A more comprehensive job that spins up a temporary PostgreSQL service container, installs dependencies, and runs `npm run test:e2e`. It guarantees that the integration between the API and the database is working perfectly.

This automation ensures that new code is only merged into the main branch if it passes all tests, maintaining the project's quality and stability.

---

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.
