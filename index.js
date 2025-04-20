const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const dataPath = path.join(__dirname, 'guests.json');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.options('*', cors()); // preflight

app.use(express.json());

// MongoDB URI
const uri = 'mongodb+srv://caca:admin123@cluster0.nhdcgk1.mongodb.net/?appName=Cluster0';

// Connect to MongoDB (no need for useNewUrlParser and useUnifiedTopology)
mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));


// Schema tamu (MongoDB)
const GuestSchema = new mongoose.Schema({
  id: String,
  name: String,
  checkedIn: { type: Boolean, default: false },
});

const Guest = mongoose.model('Guest', GuestSchema);

// Endpoint untuk tambah tamu ke JSON file
app.post('/add-guest', (req, res) => {
  const { name, email, phone, faculty, angkatan, company } = req.body;

  const newGuest = {
    _id: uuidv4(),
    Timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }),
    "Email Address": email,
    "Nama": name,
    "Nomor Handphone": phone,
    "Fakultas": faculty,
    "Angkatan Masuk": angkatan,
    "Lembaga/ Instansi/ Perusahaan Tempat Bekerja": company,
    "qr_code": `qr_images/qr_${Math.floor(Math.random() * 1000)}_${name.replace(/ /g, '_')}.png`
  };

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read database' });

    const guests = JSON.parse(data);
    guests.push(newGuest);

    fs.writeFile(dataPath, JSON.stringify(guests, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to write database' });
      res.json(newGuest);
    });
  });
});

// MongoDB endpoint (jika ingin digunakan)
app.post('/guests', async (req, res) => {
  const guest = new Guest(req.body);
  await guest.save();
  res.json(guest);
});

app.get('/guests', async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
});

app.put('/guests/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const guest = await Guest.findOne({ id });
  if (!guest) return res.status(404).json({ message: 'Tamu tidak ditemukan' });

  guest.name = name;
  await guest.save();

  res.json({ message: 'Tamu berhasil diperbarui', guest });
});

app.post('/checkin', async (req, res) => {
  const { id } = req.body;
  const guest = await Guest.findOne({ id });

  if (!guest) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  if (guest.checkedIn) return res.status(400).json({ message: 'Tamu sudah check-in' });

  guest.checkedIn = true;
  await guest.save();
  res.json({ message: 'Check-in berhasil', guest });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
