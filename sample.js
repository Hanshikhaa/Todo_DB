//Todo App to perform CRUD operations on CouchDB using Express.js

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable TLS certificate validation
const express = require('express');
const nano = require('nano')
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
// db 
const COUCHDB_URL = process.env.COUCHDB_URL || 'https://ruler:ruler@192.168.57.254:5984/';

//const DB_NAME = 'hanshi_468';
const nanoInstance = nano(COUCHDB_URL);
const db = nanoInstance.db.use("hanshi_468");

//TEST COUCH TB CONNECTION
app.get('/test-db', async (req, res) => {
  try {
    const info = await db.info();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// GET all documents from CouchDB
app.get('/items', async (req, res) => {
  try {
    const result = await db.list({ include_docs: true });

    const data = result.rows.map(row => ({
      id: row.doc._id,
      ...row.doc
    }));

    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Create document
app.post('/items', async (req, res) => {
  try {
    const doc = {
      ...req.body,
      createdAt: new Date()
    };

    const response = await db.insert(doc);

    res.status(201).json({
      message: 'Document created successfully',
      id: response.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Full update
app.put('/items/:id', async (req, res) => {
  try {
    const doc = await db.get(req.params.id);

    const updatedDoc = {
      ...doc,
      ...req.body,
      updatedAt: new Date()
    };

    await db.insert(updatedDoc);

    res.json({
      message: 'Document updated successfully (PUT)'
    });
  } catch (err) {
    res.status(404).json({ message: 'Document not found' });
  }
});

// PATCH - Partial update
app.patch('/items/:id', async (req, res) => {
  try {
    const doc = await db.get(req.params.id);

    Object.keys(req.body).forEach(key => {
      doc[key] = req.body[key];
    });

    doc.updatedAt = new Date();

    await db.insert(doc);

    res.json({
      message: 'Document updated successfully (PATCH)'
    });
  } catch (err) {
    res.status(404).json({ message: 'Document not found' });
  }
});

// DELETE - Remove document
app.delete('/items/:id', async (req, res) => {
  try {
    const doc = await db.get(req.params.id);
    await db.destroy(doc._id, doc._rev);

    res.json({
      message: 'Document deleted successfully'
    });
  } catch (err) {
    res.status(404).json({ message: 'Document not found' });
  }
});
