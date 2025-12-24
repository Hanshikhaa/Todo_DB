process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Disable TLS certificate validation
const express = require('express');
const nano = require('nano')
//('http://localhost:5984');
const cors = require('cors');
const app = express();

// Built-in middleware
app.use(express.json());
app.use(cors());
const COUCHDB_URL = process.env.COUCHDB_URL || 'https://ruler:ruler@192.168.57.254:5984/';
//const DB_NAME = 'hanshi_468';
const nanoInstance = nano(COUCHDB_URL);
const db = nanoInstance.db.use("hanshi_468");
// Simple custom middleware
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});


// ALL method
app.all('/todos', (req, res, next) => {
  console.log('Todos route accessed');
  next();
});

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET by id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  res.json(todo || { message: 'Not found' });
});

// POST
app.post('/todos', (req, res) => {
  const todo = {
    id: id++,
    title: req.body.title,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.send('Not found');

  todo.title = req.body.title;
  todo.completed = req.body.completed;
  res.json(todo);
});

// PATCH
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.send('Not found');

  if (req.body.title) todo.title = req.body.title;
  if (req.body.completed !== undefined) todo.completed = req.body.completed;

  res.json(todo);
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.send('Deleted');
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
