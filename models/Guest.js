const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  "Nama": { type: String },
  "_id": { type: String },
  "check_in": String,
  "Email_Address": { type: String },
  "Nomor Handphone": { type: String },
  "Fakultas": { type: String },
  "Angkatan Masuk": { type: String },
  "Lembaga/ Instansi/ Perusahaan Tempat Bekerja": { type: String },
  "qr_code": { type: String },
  "Timestamp": { type: Date }
});

// 👇 pakai opsi { collection: 'Guest' } biar gak jadi 'guests'
const Guest = mongoose.model('Guest', guestSchema, 'Guest');

module.exports = Guest;
