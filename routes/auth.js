const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Register (Normal User)
router.post('/register', async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'user')";
    db.query(sql, [name, email, hashedPassword, address], (err, result) => {
      if (err) return res.status(500).json({ message: 'Email may already exist' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login (All Roles)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    // No JWT, just return user info
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address
    });
  });
});

module.exports = router;
