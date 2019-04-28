import HandlebarsInc from 'handlebars-inc/runtime';

/**
 * Analogue of `jQuery.ready()` for IE9 and beyond.
 */
function onReady(callback) {
  document.readyState === 'interactive' || document.readyState === 'complete'
    ? callback()
    : document.addEventListener('DOMContentLoaded', callback);
}

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

function getJSON(url, done) {
  const req = new XMLHttpRequest();
  req.overrideMimeType('application/json');
  req.open('GET', url);
  req.addEventListener('load', function() {
    if (req.status === 200) {
      done(JSON.parse(req.responseText));
    } else {
      throw new Error('Received unexpected response status ' + req.status);
    }
  });
  req.send();
}

function handleSearchButtonClick(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value;
  if (query) {
    const searchButton = document.getElementById('search-button');
    searchButton.classList.add('is-loading');
    searchButton.disabled = true;
    const queryEncoded = encodeURIComponent(query);
    const endpointURL =
      'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=' +
      queryEncoded;
    getJSON(endpointURL, payload => {
      const results = transformOpenSearchData(payload);

      searchButton.disabled = false;
      searchButton.classList.remove('is-loading');

      const searchContext = { query: query, results: results };
      const pageState = { search: searchContext };
      syncPageState(pageState);

      if (window.history) {
        window.history.pushState(
          pageState,
          '',
          '/search?query=' + queryEncoded
        );
      }
    });
  }
}

function handlePopState(event) {
  if (event.state) {
    // We have saved state for this URL, just update the UI with incremental-dom
    syncPageState(event.state);
  } else {
    // No saved state, need to load this page from the server
    window.location.reload();
  }
}

function initPartials() {
  const precompiledPartials = window.HandlebarsIncDemo.precompiledPartials;
  for (const partial in precompiledPartials) {
    const precompiled = precompiledPartials[partial];
    HandlebarsInc.partials[partial] = HandlebarsInc.template(precompiled);
  }
}

function syncPageState(state) {
  const searchPartial = HandlebarsInc.partials['search-main'];
  HandlebarsInc.patch(
    document.getElementById('main'),
    searchPartial(state.search, { backend: 'idom' })
  );
}

onReady(() => {
  initPartials();

  const pageState = window.HandlebarsIncDemo.initialPageState;
  syncPageState(pageState);

  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', handleSearchButtonClick);

  if (window.history) {
    window.history.replaceState(pageState, '');
    window.addEventListener('popstate', handlePopState);
  }
});
