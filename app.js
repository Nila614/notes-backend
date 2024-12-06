const express = require('express');
const app = express();
const connection = require('./db');
require('dotenv').config();

app.use(express.json()); 

// CREATE
app.post('/notes', (req, res) => {
  const { title, datetime, note } = req.body;
  const query = 'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)';
  connection.query(query, [title, datetime, note], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'Note sukses dibuat', id: result.insertId });
  });
});

// READ ALL
app.get('/notes', (req, res) => {
  const query = 'SELECT * FROM notes';
  connection.query(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// READ ONE
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const query = 'SELECT * FROM notes WHERE id = ?';
  connection.query(query, [noteId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row.length === 0) {
      res.status(404).json({ message: 'Note tidak ditemukan' });
      return;
    }
    res.json(row[0]);
  });
});

// UPDATE
app.put('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const { title, datetime, note } = req.body;
  const query = 'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?';
  connection.query(query, [title, datetime, note, noteId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Note tidak ditemukan' });
      return;
    }
    res.json({ message: 'Update note sukses' });
  });
});

// DELETE
app.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const query = 'DELETE FROM notes WHERE id = ?';
  connection.query(query, [noteId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Note tidak ditemukan' });
      return;
    }
    res.json({ message: 'Menghapus note sukses' });
  });
});

// end
app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
