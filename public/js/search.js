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
        var searchPartial = HandlebarsIdom.partials['search/index'];
        HandlebarsIdom.patch(
          main,
          searchPartial(searchContext, { backend: 'idom' })
        );
      });
    }
  }

  onReady(function() {
    main = document.getElementById('main');
    searchButton = document.getElementById('search-button');
    searchInput = document.getElementById('search-input');

    var searchPartial = HandlebarsIdom.partials['search/index'];
    HandlebarsIdom.patch(
      main,
      searchPartial(window.initialData, { backend: 'idom' })
    );

    searchButton.addEventListener('click', handleSearchButtonClick);
  });
})();
