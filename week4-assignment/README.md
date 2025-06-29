# Express.js Web Server

A simple web server built with Express.js demonstrating basic routing and middleware functionality.

## Features

- Express.js framework
- Basic routing (GET, POST)
- Middleware for logging requests
- JSON API endpoints
- Dynamic routes with parameters
- Static file serving capability
- Form handling
- Error handling middleware
- 404 page handling

## Installation

1. Navigate to the project directory:
   ```bash
   cd week4-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Visit the server:
   ```
   http://localhost:3000
   ```

## Available Endpoints

### Web Pages
- `GET /` - Home page with endpoint documentation
- `GET /about` - About page with server information

### API Endpoints
- `GET /api/status` - Server status information (JSON)
- `GET /api/time` - Current timestamp information (JSON)
- `POST /api/echo` - Echo endpoint that returns sent data (JSON)
- `GET /users/:id` - Dynamic route to get user by ID (JSON)

### Special Routes
- `404` - Custom 404 page for undefined routes

## Middleware Used

1. **Built-in Middleware:**
   - `express.json()` - Parse JSON request bodies
   - `express.urlencoded()` - Parse URL-encoded form data
   - `express.static()` - Serve static files

2. **Custom Middleware:**
   - Request logging middleware
   - Error handling middleware

## Example Usage

### Test the API endpoints:

1. **Get server status:**
   ```bash
   curl http://localhost:3000/api/status
   ```

2. **Get current time:**
   ```bash
   curl http://localhost:3000/api/time
   ```

3. **Echo a message:**
   ```bash
   curl -X POST http://localhost:3000/api/echo \
        -H "Content-Type: application/json" \
        -d '{"message": "Hello Express!"}'
   ```

4. **Get user by ID:**
   ```bash
   curl http://localhost:3000/users/123
   ```

## Project Structure

```
week4-assignment/
├── index.js          # Main Express server file
├── package.json       # Project configuration and dependencies
├── node_modules/      # Installed dependencies
└── README.md         # This file
```

## Key Concepts Demonstrated

- **Routing**: Different HTTP methods and URL patterns
- **Middleware**: Request processing pipeline
- **Request/Response handling**: Processing incoming data and sending responses
- **Error handling**: Graceful error management
- **Static file serving**: Serving assets like CSS, JS, images
- **Dynamic routes**: URL parameters and route patterns
