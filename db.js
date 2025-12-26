// db.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable TLS certificate validation

const nano = require('nano');

// CouchDB URL
const COUCHDB_URL =
  process.env.COUCHDB_URL || 'https://ruler:ruler@192.168.57.254:5984/';

// Create nano instance
const nanoInstance = nano(COUCHDB_URL);

// Use database
const db = nanoInstance.db.use("hanshi_468");

// Export db
module.exports = db;
