# Pet Shop Backend API

Production-ready backend for Pet Shop Mobile using Node.js, Express, MongoDB (Mongoose), JWT, and bcrypt.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- express-validator for request validation

## Project Structure

src/
  controllers/
  routes/
  models/
  middleware/
  config/
  utils/

## 1. Project Initialization

1. Open terminal in backEnd folder
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

(Windows PowerShell)

```powershell
Copy-Item .env.example .env
```

## 2. Run Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Health check:

- GET /api/health

## 3. Database Setup

Use local MongoDB or MongoDB Atlas.

Required .env values:
- MONGODB_URI
- JWT_SECRET
- PORT (optional)
- ADMIN_SECRET (optional, for creating products)

## 4. Data Models

### User
- id
- name
- email (unique)
- password (hashed)
- createdAt

### Product (Pet)
- id
- name
- price
- image
- category (dog, cat, bird)
- description

### Cart
- id
- userId (relation)
- items: [{ product, quantity }]

## 5. API Routes

### Auth Routes
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protected)

### Product Routes
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin optional via x-admin-secret)

### Cart Routes (protected)
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove/:id

## 6. Authentication Flow

1. Register user with name, email, password
2. Login returns JWT token
3. Send token in Authorization header:

Authorization: Bearer <token>

4. Use /api/auth/me to get current logged-in user
5. Logout is client-side token removal

## 7. Endpoint Testing (cURL)

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
```

### Get Products

```bash
curl http://localhost:5000/api/products
```

### Create Product (optional admin secret)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your_admin_secret" \
  -d '{"name":"Golden Retriever","price":799,"image":"https://example.com/dog.jpg","category":"dog","description":"Friendly and playful"}'
```

### Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Add To Cart

```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":"<product_id>","quantity":2}'
```

### Update Cart Item

```bash
curl -X PUT http://localhost:5000/api/cart/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"productId":"<product_id>","quantity":1}'
```

### Remove Cart Item

```bash
curl -X DELETE http://localhost:5000/api/cart/remove/<product_id> \
  -H "Authorization: Bearer <token>"
```

## 8. Notes for Frontend Integration

- Base URL: http://localhost:5000/api
- Enable CORS with CLIENT_URL in .env
- Save JWT token on frontend after login
- Remove token on logout

