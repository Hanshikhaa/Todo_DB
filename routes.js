// routes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// TEST COUCHDB CONNECTION
router.get('/test-db', async (req, res) => {
  try {
    const info = await db.info();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all documents
router.get('/items', async (req, res) => {
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
router.post('/items', async (req, res) => {
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
router.put('/items/:id', async (req, res) => {
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
router.patch('/items/:id', async (req, res) => {
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
router.delete('/items/:id', async (req, res) => {
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

module.exports = router;
