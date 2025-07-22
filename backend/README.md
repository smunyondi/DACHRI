# DACHRI SHOES Backend

## Overview
DACHRI SHOES is an online shoe store project that allows users to view, purchase, rate, and comment on products. The backend is built using Node.js, Express, and MongoDB, providing a robust API for the frontend application.

## Features
- User authentication (sign up, sign in, and logout)
- Product management (view, add, update, delete products)
- User reviews and ratings for products
- Receipt generation for purchases
- Admin interface for managing products and users

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd DACHRI-SHOES/backend
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

### Configuration
- Create a `.env` file in the `backend` directory and add your MongoDB connection string:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

### Running the Server
To start the backend server, run:
```
pnpm start
```
The server will run on `http://localhost:5000` by default.

### API Documentation
- The API endpoints are defined in the `backend/src/routes/index.js` file.
- Use Postman or any API client to test the endpoints.

### Testing
- Ensure to write tests for your controllers and routes to maintain code quality.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.