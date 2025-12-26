// sample.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./routes');
app.use('/', routes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
