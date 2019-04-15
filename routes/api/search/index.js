let express = require('express');
let { fetchWikipediaSearch } = require('../../../lib/wikipedia-search');

let router = express.Router();

router.get('/', (req, res, next) => {
  let query = req.query['query'];
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
