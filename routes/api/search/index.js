const express = require('express');
const { fetchWikipediaSearch } = require('../../../lib/wikipedia-search');

const router = express.Router();

router.get('/', (req, res, next) => {
  const query = req.query['query'];
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }
  fetchWikipediaSearch(query, (err, results) => {
    if (err) {
      next(err);
    }
    return res.json(results);
  });
});

module.exports = router;
