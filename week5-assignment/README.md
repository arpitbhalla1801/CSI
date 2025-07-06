# Week 5 Assignment: MongoDB CRUD App

This is a simple Node.js application demonstrating Create, Read, Update, and Delete (CRUD) operations using MongoDB and Mongoose.

## Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas)

## Setup
1. Clone this repository or copy the `week5-assignment` folder.
2. Install dependencies:
   ```bash
   npm install express mongoose dotenv
   ```
3. Create a `.env` file in `week5-assignment` (already provided):
   ```env
   MONGODB_URI=mongodb://localhost:27017/crud_demo
   PORT=3000
   ```
   - Change `MONGODB_URI` if using MongoDB Atlas or a different host.

## Running the App
```bash
node index.js
```

The server will start on the port specified in `.env` (default: 3000).

## API Endpoints
- `POST   /secrets`         - Create a new secret
- `GET    /secrets`         - Get all secrets
- `GET    /secrets/:id`     - Get a secret by ID
- `PUT    /secrets/:id`     - Update a secret by ID
- `DELETE /secrets/:id`     - Delete a secret by ID

### Example Request (using curl)
Create a secret:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"content":"my secret"}' http://localhost:3000/secrets
```

## License
MIT
