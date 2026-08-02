const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), max: parseInt(process.env.RATE_LIMIT_MAX || '100') });
app.use(limiter);

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api', routes);

module.exports = app;
