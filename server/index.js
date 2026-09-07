const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Root API Health Check Route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'TripVault API is running ✈️' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));