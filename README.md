
# RankerAI Backend - Project Documentation

RankerAI is a modern, modular NestJS backend designed for high-performance AI-driven workflows. It utilizes a robust **Domain-Driven Design (DDD)** approach, integrating MongoDB for data persistence and GraphQL for a flexible API layer.

---

## 🏗️ Project Architecture

The project is organized into three primary layers to ensure scalability and maintainability.

* **Core Layer**: Contains global infrastructure including configuration validation via Joi, MongoDB connection logic, and GraphQL server setup.
* **Modules Layer**: Each business domain (Auth, Users, Roles, Subscriptions) is encapsulated in its own directory with dedicated services, resolvers, and models.
* **Shared Layer**: Provides cross-cutting utilities such as custom decorators, React-Email templates, and helper functions for hashing and Google OAuth.

---

## 🛠️ Getting Started

### 1. Prerequisites

* **Node.js**: Version 20 or higher.
* **MongoDB**: A running instance (local or Atlas).
* **SendGrid API Key**: For email communications.

### 2. Installation

```bash
# Install dependencies
npm install

```

### 3. Environment Configuration

Copy the `.env.example` file to a new file named `.env` and fill in your credentials (JWT Secret, MongoDB URI, SendGrid Key, Google Client ID).

---

## 🚀 Running the Application

### Development Mode

Starts the application with **hot-reload** enabled, watching for file changes.

```bash
npm run start:dev

```

### Production Build

Compiles the TypeScript code into a `dist` folder and starts the optimized JavaScript server.

```bash
# Compile TypeScript
npm run build

# Start production server
npm run start:prod

```

---

## ✅ Key Improvements Migrated

* **Dynamic RBAC**: Transitioned from static enums to a database-driven Role and Permission system that allows live updates to access control without code changes.
* **Modern Emailing**: Implemented `@react-email` for responsive templates delivered via SendGrid.
* **Strict Validation**: Integrated global pipes and Joi schemas (`configValidationSchema`) to ensure all data and configurations are valid before the app starts.
* **Subscription Framework**: Built-in usage tracking and credit management, with auto-assignment of 'free' plans for new users.

---

*For further details on API endpoints, visit `http://localhost:3000/graphql` while the server is running to access the interactive Playground.*
