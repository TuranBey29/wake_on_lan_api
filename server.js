const express = require('express');
const cors = require('cors');
const wol = require('wake_on_lan');

const app = express();
const PORT = 3000;

// GEREKLİ MIDDLEWARE
app.use(cors());
app.use(express.json()); // BU ÇOK ÖNEMLİ

// WAKE ENDPOINT
app.post('/wake', (req, res) => {
  const macAddress = req.body.mac;
  if (!macAddress) {
    return res.status(400).json({ error: 'MAC adresi eksik' });
  }

  wol.wake(macAddress, function (error) {
    if (error) {
      return res.status(500).json({ error: 'Magic packet gönderilemedi.' });
    } else {
      return res.status(200).json({ message: 'Magic packet gönderildi!' });
    }
  });
});

// SERVER BAŞLAT
app.listen(PORT, () => {
  console.log(`Wake-on-LAN sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
