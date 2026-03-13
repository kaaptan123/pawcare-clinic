const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = ['http://localhost:3000', process.env.CLIENT_URL].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => { if (!origin || allowedOrigins.includes(origin)) return cb(null, true); cb(new Error('CORS blocked')); },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'DoctorG24 API is running', version: '2.0' }));
app.get('/', (req, res) => res.json({ message: 'DoctorG24 API v2.0 🐾' }));

// ── KEEP-ALIVE PING (prevents Render free tier cold starts) ───
// Pings itself every 14 minutes so server stays warm
const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;
setInterval(async () => {
  try {
    const http = require('http');
    const https = require('https');
    const client = SELF_URL.startsWith('https') ? https : http;
    client.get(`${SELF_URL}/api/health`, (r) => {
      console.log(`🏓 Keep-alive ping: ${r.statusCode}`);
    }).on('error', () => {});
  } catch(e) {}
}, 14 * 60 * 1000); // every 14 minutes

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctorg24';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await require('./config/seed')();
    app.listen(PORT, () => console.log(`🚀 DoctorG24 Server v2.0 on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });
