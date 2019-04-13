let express = require('express');
let fetch = require('node-fetch');

let router = express.Router();

/* GET Wikipedia search. */
router.get('/', async (req, res, next) => {
  let query = req.param('query');
  if (!query) {
    return res.redirect('/');
  }
  let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`;
  try {
    let response = await fetch(url);
    if (response.ok) {
      let result = await response.json();
      let titles = result[1];

      return res.render('index', { title: 'Express' });
    } else {
      throw new Error('Error retrieving Wikipedia search');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
