let https = require('https');

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

function fetchWikipediaSearch(query, callback) {
  let url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${query}`;
  https
    .get(url, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });
      resp.on('end', () => {
        let results = transformOpenSearchData(JSON.parse(data));
        callback(null, results);
      });
    })
    .on('error', callback);
}

module.exports = { fetchWikipediaSearch };
