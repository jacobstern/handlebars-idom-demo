let express = require('express');

let router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
