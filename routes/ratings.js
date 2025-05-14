const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin Dashboard Stats
router.get('/dashboard', (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS total_users FROM users", (err, result1) => {
    if (err) return res.status(500).json({ message: 'Error getting users' });
    stats.total_users = result1[0].total_users;

    db.query("SELECT COUNT(*) AS total_stores FROM stores", (err, result2) => {
      if (err) return res.status(500).json({ message: 'Error getting stores' });
      stats.total_stores = result2[0].total_stores;

      db.query("SELECT COUNT(*) AS total_ratings FROM ratings", (err, result3) => {
        if (err) return res.status(500).json({ message: 'Error getting ratings' });
        stats.total_ratings = result3[0].total_ratings;

        res.json(stats);
      });
    });
  });
});

module.exports = router;
