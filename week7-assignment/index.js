require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

let products = [];
let nextId = 1;

// Dummy user for demonstration
const USER = { username: 'admin', password: 'password' };

// Login route to get JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Public: Create a product
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Name and price are required.' });
  }
  const product = { id: nextId++, name, price };
  products.push(product);
  res.status(201).json(product);
});

// Public: Read all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Public: Read one product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

// Protected: Update a product
app.put('/products/:id', authenticateToken, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  const { name, price } = req.body;
  if (name) product.name = name;
  if (typeof price === 'number') product.price = price;
  res.json(product);
});

// Protected: Delete a product
app.delete('/products/:id', authenticateToken, (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Product not found.' });
  products.splice(index, 1);
  res.json({ message: 'Product deleted.' });
});

// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}. This is a protected route.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
