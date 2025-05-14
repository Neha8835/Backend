const express = require('express');
const router = express.Router();
const db = require('../db');

// Add store
router.post('/add', (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !address || !owner_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, address, owner_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding store' });
    res.status(201).json({ message: 'Store added successfully' });
  });
});

// Get all stores (with optional filters)
router.get('/', (req, res) => {
  const { name, email, address } = req.query;
  let sql = `
    SELECT s.*
    FROM stores s `;
  let params = [];

  if (name) {
    sql += " AND s.name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    sql += " AND s.email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    sql += " AND s.address LIKE ?";
    params.push(`%${address}%`);
  }

  //sql += " GROUP BY s.id";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching stores' });
    res.json(results);
  });
});

module.exports = router;
