import HandlebarsInc from 'handlebars-inc/runtime';
import registerVerbatimHelper from 'handlebars-inc-verbatim';

// Global handlebars-inc instance is shared by event handlers
const handlebarsInstance = HandlebarsInc.create();

/**
 * Analogue of `jQuery.ready()` for IE9 and beyond.
 */
function onReady(callback) {
  document.readyState === 'interactive' || document.readyState === 'complete'
    ? callback()
    : document.addEventListener('DOMContentLoaded', callback);
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
    const endpointURL = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&origin=*&srsearch=${queryEncoded}`;
    getJSON(endpointURL, payload => {
      const results = payload.query.search;

      searchButton.disabled = false;
      searchButton.classList.remove('is-loading');

      const searchContext = { query: query, results: results };
      const pageState = { search: searchContext };
      syncPageState(handlebarsInstance, pageState);

      if (window.history) {
        window.history.pushState(
          pageState,
          '',
          `/search?query=${queryEncoded}`
        );
      }
    });
  }
}

function handlePopState(event) {
  if (event.state) {
    // We have saved state for this URL, just update the UI with incremental-dom
    syncPageState(handlebarsInstance, event.state);
  } else {
    // No saved state, need to load this page from the server
    window.location.reload();
  }
}

function initHandlebarsHelpers(handlebars) {
  registerVerbatimHelper(handlebars);
}

/**
 * Initialize the handlebars instance with precompiled partials installed on the
 * global scope by the server.
 */
function initPartials(handlebars) {
  const precompiledPartials = window.HandlebarsIncDemo.precompiledPartials;
  for (const partial in precompiledPartials) {
    const precompiled = precompiledPartials[partial];
    handlebars.partials[partial] = handlebars.template(precompiled);
  }
}

/**
 * Using `handlebars-inc`, update the page with the search data from the server
 * or from the `popstate` event. This is equivalent to rendering the page
 * template on the server.
 * @param handlebars - A configured `handlebars-inc` instance.
 * @param state - Context to populate the `search-main.hbs` partial.
 */
function syncPageState(handlebars, state) {
  const searchPartial = handlebars.partials['search-main'];
  handlebars.patch(
    document.getElementById('main'),
    searchPartial(state.search, { backend: 'idom' })
  );
}

onReady(() => {
  initHandlebarsHelpers(handlebarsInstance);
  initPartials(handlebarsInstance);

  const initialState = window.HandlebarsIncDemo.initialPageState;
  syncPageState(handlebarsInstance, initialState);

  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', handleSearchButtonClick);

  if (window.history) {
    window.history.replaceState(initialState, '');
    window.addEventListener('popstate', handlePopState);
  }
});
