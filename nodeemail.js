const nodemailer = require('nodemailer');
const fs = require('fs'); // kalau QR code dalam bentuk file

const guests = [
  { name: 'John Doe', email: 'john@example.com', qrPath: './qrs/john.png' },
  { name: 'Jane Smith', email: 'jane@example.com', qrPath: './qrs/jane.png' }
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'agusdwiaryati33@gmail.com',
    pass: 'your-app-password' // atau pakai SMTP secure login
  }
});

async function sendEmail(guest) {
  const mailOptions = {
    from: '"Undangan" <agusdwiaryati33@gmail.com>',
    to: guest.Email_Address,
    subject: 'QR Code Undangan',
    html: `<p>Halo ${guest.Nama}, ini QR Code kamu:</p>`,
    attachments: [
      {
        filename: 'qrcode.png',
        path: guest.qrPath,
        cid: 'qruniqueid' // supaya bisa ditampilkan inline
      }
    ]
  };

  // Kirim email
  await transporter.sendMail(mailOptions);
  console.log(`✅ Email terkirim ke ${guest.email}`);
}

// Loop semua tamu
async function sendAll() {
  for (const guest of guests) {
    await sendEmail(guest);
  }
}

sendAll().catch(console.error);
