const express = require('express');
const dgram = require('dgram');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

function createMagicPacket(mac) {
  const macClean = mac.replace(/[:-]/g, '');
  if (macClean.length !== 12) throw new Error('Geçersiz MAC');

  const buffer = Buffer.alloc(6 + 16 * 6, 0xff);
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 6; j++) {
      buffer[6 + i * 6 + j] = parseInt(macClean.substr(j * 2, 2), 16);
    }
  }
  return buffer;
}

function sendMagicPacket(ip, port, mac) {
  const socket = dgram.createSocket('udp4');
  const packet = createMagicPacket(mac);

  socket.send(packet, 0, packet.length, port, ip, (err) => {
    if (err) console.log(err);
    else console.log('Gönderildi');
    socket.close();
  });
}

app.post('/wake', (req, res) => {
  const { mac, ip, port } = req.body;
  sendMagicPacket(ip, port, mac);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});