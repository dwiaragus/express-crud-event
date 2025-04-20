// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
// const port = process.env.PORT || 5000;
const port = process.env.PORT || 3000;

// Use CORS middleware with specific origin (React frontend)
app.use(cors());

// Import Model
const Guest = require('./models/Guest');

// Middleware
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGO_URI;

// Connect to MongoDB (no need for useNewUrlParser and useUnifiedTopology)
mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Route untuk menambah tamu
app.post('/guests', async (req, res) => {
  try {
    // const guest = new Guest(req.body);
    // await guest.save();
    // res.status(201).json(guest);
    const client = await MongoClient.connect(uri);
    const db = client.db('halalbihalal');
    const collection = db.collection('Guest');

    await collection.insertOne(req.body);

    res.status(201).json({ message: 'Guest added successfully' });

    client.close();

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update tamu berdasarkan ID
// Update guest by email
app.put('/guests/email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const updatedGuest = await Guest.findOneAndUpdate(
      { Email_Address: { $regex: new RegExp(`^${email}$`, 'i') } }, // case-insensitive
      req.body,
      { new: true }
    );

    if (!updatedGuest) {
      return res.status(404).json({ message: 'Guest not found with that email' });
    }

    res.json(updatedGuest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Hapus tamu berdasarkan ID
app.delete('/guests/:id', async (req, res) => {
  try {
    const deletedGuest = await Guest.findByIdAndDelete(req.params.id);
    if (!deletedGuest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route untuk mendapatkan daftar tamu
app.get('/guests', async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('halalbihalal');
    const collection = db.collection('Guest');
    const guests = await collection.find({}).toArray();

    res.json(guests);
    client.close();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Mulai server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
