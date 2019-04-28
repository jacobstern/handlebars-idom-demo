const express = require('express');
const https = require('https');
const expressHandlebars = require('../express-handlebars');

function transformOpenSearchData(data) {
  const [titles, descriptions, urls] = data.slice(1);
  return titles.map((title, i) => {
    return {
      title,
      description: descriptions[i],
      url: urls[i],
    };
  });
}

function fetchWikipediaSearch(query, callback) {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`;
  https
    .get(url, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });
      resp.on('end', () => {
        const results = transformOpenSearchData(JSON.parse(data));
        callback(null, results);
      });
    })
    .on('error', callback);
}

const router = express.Router();

function prepareViewParams(searchContext, useViewCache, callback) {
  expressHandlebars
    .getPartials({ precompiled: true, cache: useViewCache })
    .then(precompiled => {
      const initialPageState = { search: searchContext };
      const params = {
        title: 'Search',
        precompiled,
        search: searchContext,
        extraScripts: ['/build/search-page.js'],
        pageStateJSON: JSON.stringify(initialPageState),
      };
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
        res.render('search', params);
      });
    });
  } else {
    // No query, no search results
    const searchContext = {};
    prepareViewParams(searchContext, useViewCache, (err, params) => {
      if (err) {
        return next(err);
      }
      res.render('search', params);
    });
  }
});

module.exports = router;
