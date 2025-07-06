// Simple CRUD app using Express, Mongoose, and dotenv
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Secret Schema & Model
const secretSchema = new mongoose.Schema({
  content: { type: String, required: true },
}, { timestamps: true });

const Secret = mongoose.model('Secret', secretSchema);

// CRUD Routes
// Create
app.post('/secrets', async (req, res) => {
  try {
    const secret = new Secret({ content: req.body.content });
    await secret.save();
    res.status(201).json(secret);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
app.get('/secrets', async (req, res) => {
  try {
    const secrets = await Secret.find();
    res.json(secrets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
app.get('/secrets/:id', async (req, res) => {
  try {
    const secret = await Secret.findById(req.params.id);
    if (!secret) return res.status(404).json({ error: 'Not found' });
    res.json(secret);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
app.put('/secrets/:id', async (req, res) => {
  try {
    const secret = await Secret.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    );
    if (!secret) return res.status(404).json({ error: 'Not found' });
    res.json(secret);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/secrets/:id', async (req, res) => {
  try {
    const secret = await Secret.findByIdAndDelete(req.params.id);
    if (!secret) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
