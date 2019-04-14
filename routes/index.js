let express = require('express');

let router = express.Router();

router.get('/', async (_req, res) => {
  res.redirect('/search');
});

module.exports = router;
