const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Add user (admin only)
router.post('/add', async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, address, role], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error adding user' });
      res.status(201).json({ message: 'User added successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (with optional filters)
router.get('/', (req, res) => {
  const { name, email, address, role } = req.query;
  let sql = "SELECT * FROM users WHERE 1=1";
  let params = [];

  if (name) {
    sql += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (email) {
    sql += " AND email LIKE ?";
    params.push(`%${email}%`);
  }
  if (address) {
    sql += " AND address LIKE ?";
    params.push(`%${address}%`);
  }
  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(results);
  });
});

module.exports = router;
