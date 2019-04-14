'use strict';

/* globals HandlebarsIdom */

(function() {
  /**
   * Analogue of `jQuery.ready()` for IE9 and beyond.
   */
  function onReady(callback) {
    document.readyState === 'interactive' || document.readyState === 'complete'
      ? callback()
      : document.addEventListener('DOMContentLoaded', callback);
  }

  var main, searchButton, searchInput;
  var searchPartial = HandlebarsIdom.partials['search/index'];

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
    var query = searchInput.value;
    if (query) {
      searchButton.classList.add('is-loading');
      searchButton.disabled = true;
      var url = '/api/search?query=' + encodeURIComponent(query);
      getJSON(url, function(results) {
        var searchContext = { query: query, results: results };
        HandlebarsIdom.patch(
          main,
          searchPartial(searchContext, { backend: 'idom' })
        );
        searchButton.disabled = false;
        searchButton.classList.remove('is-loading');

        if (window.history) {
          window.history.pushState(searchContext, '', '?query=' + query);
        }
      });
    }
  }

  function handlePopState(event) {
    if (event.state) {
      HandlebarsIdom.patch(
        main,
        searchPartial(event.state, { backend: 'idom' })
      );
    } else {
      window.location.reload();
    }
  }

  onReady(function() {
    main = document.getElementById('main');

    HandlebarsIdom.patch(
      main,
      searchPartial(window.initialData, { backend: 'idom' })
    );

    searchButton = document.getElementById('search-button');
    searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', handleSearchButtonClick);

    if (window.history) {
      window.history.replaceState(window.initialData, '');
      window.addEventListener('popstate', handlePopState);
    }
  });
})();
