let express = require('express');
let https = require('https');

let router = express.Router();

function transformOpenSearchData(data) {
  let [titles, descriptions, urls] = data.slice(1);
  return titles.map((title, i) => {
    return {
      title,
      description: descriptions[i],
      url: urls[i],
    };
  });
}

function fetchWikipediaOpenSearch(query, callback) {
  let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`;
  https
    .get(url, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });
      resp.on('end', () => {
        callback(null, JSON.parse(data));
      });
    })
    .on('error', callback);
}

router.get('/', async (req, res, next) => {
  let query = req.query['query'];
  if (!query) {
    return res.redirect('/');
  }
  fetchWikipediaOpenSearch(query, (err, data) => {
    if (err) next(err);
    let results = transformOpenSearchData(data);
    let searchContext = { query, results };
    return res.render('search', { title: 'Search', search: searchContext });
  });
});

module.exports = router;
