const express = require('express');
const https = require('https');
const expressHandlebars = require('../express-handlebars');

function getJSON(url, callback) {
  https
    .get(url, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });
      resp.on('end', () => {
        try {
          const payload = JSON.parse(data);
          callback(null, payload);
        } catch (e) {
          callback(e);
        }
      });
    })
    .on('error', callback);
}

const router = express.Router();

/**
 * Convenience endpoint to redirect to a Wikipedia page based on its `pageid`.
 */
router.get('/external', (req, res, next) => {
  const pageid = req.query['pageid'];
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageid}&inprop=url&format=json`;
  getJSON(url, (err, payload) => {
    if (err) {
      return next(err);
    }
    const { fullurl } = payload.query.pages[pageid];
    res.status(301).redirect(fullurl);
  });
});

function makeSearchLocals(searchContext, precompiledTemplates) {
  return {
    title: 'Search',
    precompiled: precompiledTemplates,
    search: searchContext,
    extraScripts: ['/build/search-page.js'],
    pageStateJSON: JSON.stringify({ search: searchContext }),
  };
}

router.get('/', (req, res, next) => {
  const query = req.query['query'];
  // Retrieve precompiled Handlebars partials to send to the client
  expressHandlebars
    .getPartials({ precompiled: true, cache: req.app.enabled('view cache') })
    .then(precompiledTemplates => {
      if (query) {
        const queryEncoded = encodeURIComponent(query);
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${queryEncoded}`;
        getJSON(url, (err, payload) => {
          if (err) {
            return next(err);
          }
          const searchContext = { query, results: payload.query.search };
          res.render(
            'search',
            makeSearchLocals(searchContext, precompiledTemplates)
          );
        });
      } else {
        // No query, no search results
        const searchContext = {};
        res.render(
          'search',
          makeSearchLocals(searchContext, precompiledTemplates)
        );
      }
    })
    .catch(next);
});

module.exports = router;
