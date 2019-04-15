const express = require('express');
const expressHandlebars = require('../../express-handlebars');
const { fetchWikipediaSearch } = require('../../lib/wikipedia-search');

const router = express.Router();

function prepareViewParams(searchContext, useViewCache, callback) {
  expressHandlebars
    .getPartials({ precompiled: true, cache: useViewCache })
    .then(precompiled => {
      const params = {
        title: 'Search',
        precompiled,
        search: searchContext,
        extraScripts: ['/js/search.js'],
      };
      const pageData = { search: params.search };
      params.pageDataJSON = JSON.stringify(pageData);
      callback(null, params);
    })
    .catch(callback);
}

router.get('/', (req, res, next) => {
  const query = req.query['query'];
  const useViewCache = req.app.enabled('view cache');
  if (query) {
    fetchWikipediaSearch(query, (err, results) => {
      if (err) {
        return next(err);
      }
      const searchContext = { query, results };
      prepareViewParams(searchContext, useViewCache, (err, params) => {
        if (err) {
          return next(err);
        }
        res.render('search/index', params);
      });
    });
  } else {
    // No query, no search results
    const searchContext = {};
    prepareViewParams(searchContext, useViewCache, (err, params) => {
      if (err) {
        return next(err);
      }
      res.render('search/index', params);
    });
  }
});

module.exports = router;
