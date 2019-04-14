let express = require('express');
let expressHandlebars = require('../../express-handlebars');
let { fetchWikipediaSearch } = require('../../wikipedia-search');

let router = express.Router();

router.get('/', (req, res, next) => {
  let query = req.query['query'];
  if (!query) {
    return res.redirect('/');
  }
  fetchWikipediaSearch(query, (err, results) => {
    if (err) next(err);
    let searchContext = { query, results };
    expressHandlebars
      .getPartials({ precompiled: true, cache: req.app.enabled('view cache') })
      .then(precompiled => {
        res.render('search/index', {
          title: 'Search',
          precompiled,
          search: searchContext,
          extraScripts: ['/js/search.js'],
          initialDataPayload: JSON.stringify(searchContext),
        });
      })
      .catch(next);
  });
});

module.exports = router;
