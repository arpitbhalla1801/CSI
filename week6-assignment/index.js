const express = require('express');
const app = express();
app.use(express.json());

let products = [];
let nextId = 1;

app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ error: 'Name and price are required.' });
  }
  const product = { id: nextId++, name, price };
  products.push(product);
  res.status(201).json(product);
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  const { name, price } = req.body;
  if (name) product.name = name;
  if (typeof price === 'number') product.price = price;
  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Product not found.' });
  products.splice(index, 1);
  res.json({ message: 'Product deleted.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
