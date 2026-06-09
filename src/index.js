require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Create logs dir
if (!fs.existsSync('logs')) fs.mkdirSync('logs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));
app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 ERP Backend running at http://localhost:${PORT}`);
});
