let express = require('express');
let expressHandlebars = require('../../express-handlebars');
let { fetchWikipediaSearch } = require('../../wikipedia-search');

let router = express.Router();

function prepareViewParams(searchContext, useViewCache, callback) {
  expressHandlebars
    .getPartials({ precompiled: true, cache: useViewCache })
    .then(precompiled => {
      let params = {
        title: 'Search',
        precompiled,
        search: searchContext,
        extraScripts: ['/js/search.js'],
      };
      let pageData = { search: params.search };
      params.pageDataJSON = JSON.stringify(pageData);
      callback(null, params);
    })
    .catch(callback);
}

router.get('/', (req, res, next) => {
  let query = req.query['query'];
  let useViewCache = req.app.enabled('view cache');
  if (query) {
    fetchWikipediaSearch(query, (err, results) => {
      if (err) {
        return next(err);
      }
      let searchContext = { query, results };
      prepareViewParams(searchContext, useViewCache, (err, params) => {
        if (err) {
          return next(err);
        }
        res.render('search/index', params);
      });
    });
  } else {
    // No query, no search results
    let searchContext = {};
    prepareViewParams(searchContext, useViewCache, (err, params) => {
      if (err) {
        return next(err);
      }
      res.render('search/index', params);
    });
  }
});

module.exports = router;
