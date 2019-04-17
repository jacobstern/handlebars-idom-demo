'use strict';

/* globals HandlebarsInc */

(function() {
  /**
   * Analogue of `jQuery.ready()` for IE9 and beyond.
   */
  function onReady(callback) {
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback);
  }

  function getJSON(url, done) {
    var req = new XMLHttpRequest();
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
    var searchInput = document.getElementById('search-input');
    var query = searchInput.value;
    if (query) {
      var searchButton = document.getElementById('search-button');
      searchButton.classList.add('is-loading');
      searchButton.disabled = true;
      var url = '/api/search?query=' + encodeURIComponent(query);
      getJSON(url, function(results) {
        searchButton.disabled = false;
        searchButton.classList.remove('is-loading');

        var searchContext = { query: query, results: results };
        var pageState = { search: searchContext };
        syncPageState(pageState);

        if (window.history) {
          window.history.pushState(pageState, '', '?query=' + query);
        }
      });
    }
  }

  function handlePopState(event) {
    if (event.state) {
      syncPageState(event.state);
    } else {
      window.location.reload();
    }
  }

  function syncPageState(state) {
    var searchPartial = HandlebarsInc.partials['search-main'];
    HandlebarsInc.patch(
      document.getElementById('main'),
      searchPartial(state.search, { backend: 'idom' })
    );
  }

  onReady(function() {
    var pageState = window.pageState;
    syncPageState(pageState);

    var searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', handleSearchButtonClick);

    if (window.history) {
      window.history.replaceState(pageState, '');
      window.addEventListener('popstate', handlePopState);
    }
  });
})();
