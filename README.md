# Pizza Delivery System Backend (Microservices)

This project is a modular, microservices-based backend for a Pizza Delivery System, built with Node.js, Express, and MySQL. It supports two user types: normal users and admins. All services communicate over REST. JWT is used for authentication, and bcrypt for password hashing. Each service is independently deployable and uses a `.env` file for configuration.

## Microservices Overview

- **auth-service**: Handles user registration, login, JWT issuance, and password hashing. Manages user roles (user/admin).
- **user-service**: Manages user profiles and admin user management endpoints.
- **menu-service**: Handles CRUD operations for pizzas (admin) and menu listing (all users).
- **order-service**: Manages order placement (user), order viewing (user/admin), and order status updates (admin).
- **gateway-service**: API Gateway that routes requests to the appropriate microservice and handles JWT verification.

## Folder Structure

```
Pizzeria/
  auth-service/
  user-service/
  menu-service/
  order-service/
  gateway-service/
```

Each service contains:
- `src/` - Source code (Express app, routes, controllers, models)
- `.env.example` - Example environment variables
- `Dockerfile` - For containerization (optional)
- `package.json` - Node.js dependencies

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies** for each service:
   ```sh
   cd <service-name>
   npm install
   ```
3. **Configure environment variables**:
   - Copy `.env.example` to `.env` in each service and fill in the values.
4. **Start MySQL** and create the required databases for each service.
5. **Run each service**:
   ```sh
   npm start
   ```
6. **(Optional) Use Docker Compose** to orchestrate all services and MySQL.

## Communication
- All services communicate over REST (HTTP).
- JWT tokens are used for authentication and must be included in the `Authorization` header as `Bearer <token>`.

## User Types
- **User**: Can register, login, view menu, place orders, and view their own orders.
- **Admin**: Can manage users, menu items, and all orders.

---

For detailed API documentation, see the `docs/` folder in each service (to be implemented). 