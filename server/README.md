# Oriro Backend API

Backend server for the Oriro platform, providing authentication, user management, and blockchain integration.

## Technologies

- Node.js
- Express
- MongoDB
- JWT Authentication
- bcrypt for password hashing

## Setup

1. Install MongoDB locally or use a cloud instance (MongoDB Atlas)
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root of the server directory with the following environment variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/oriro
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

4. Start the development server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current logged in user (requires authentication)
- `PUT /api/auth/connect-wallet` - Connect a wallet to the user account (requires authentication)

## Error Handling

All endpoints return standardized error responses with appropriate HTTP status codes and error messages.

```json
{
  "message": "Error message",
  "error": "Detailed error (in development mode only)"
}
```

## Authentication

The API uses JWT tokens for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer your_token_here
``` 