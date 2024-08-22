
# Danny's Bank Recon Project - Serverless Backend API

This repository contains the serverless backend API for Danny's Bank Recon project. The API is built using Azure Functions and TypeScript, and it interacts with an Azure Postgres database via Sequelize as the ORM.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Migration](#database-migration)
- [Deployment](#deployment)

## Project Overview

Danny's Bank Recon project aims to streamline and automate bank reconciliation processes. The backend API is responsible for managing the core data and business logic, including the handling of transactions, reconciliation rules, and reporting.

## Architecture

- **Azure Functions**: The backend is implemented as a set of serverless functions, providing a scalable and cost-effective solution.
- **TypeScript**: The functions are written in TypeScript, ensuring type safety and robust code.
- **Azure Postgres**: The database is hosted on Azure Postgres, storing all necessary data for the application.
- **Sequelize ORM**: Sequelize is used as the ORM to interact with the Postgres database, providing an abstraction layer over raw SQL queries.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or above)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) (for local development and testing)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or above)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/dannys-bank-recon-backend.git
   cd dannys-bank-recon-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   See the [Environment Variables](#environment-variables) section for details.

4. **Run the Azure Functions locally:**

   ```bash
   func start
   ```

## Environment Variables

The following environment variables need to be set up:

- `DATABASE_URL`: The connection string for the Azure Postgres database.
- `SEQUELIZE_LOGGING`: (optional) Set to `true` to enable Sequelize query logging.
- `AZURE_FUNCTIONS_ENVIRONMENT`: Specifies the environment (`Development`, `Staging`, `Production`).

You can define these variables in a `.env` file at the root of the project for local development.

## Database Migration

To run database migrations using Sequelize, use the following commands:

- **Run migrations:**

  ```bash
  npx sequelize-cli db:migrate
  ```

- **Undo last migration:**

  ```bash
  npx sequelize-cli db:migrate:undo
  ```

## Deployment

The backend API can be deployed to Azure using the Azure CLI or Azure DevOps pipelines. Ensure that all environment variables are correctly set in the Azure environment.

### Example Azure CLI Deployment

1. **Log in to Azure:**

   ```bash
   az login
   ```

2. **Deploy the function app:**

   ```bash
   func azure functionapp publish <FunctionAppName>
   ```
