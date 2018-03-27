var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize:true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    {name:"title",weight:0.8},
    {name:"contents",weight:0.5},
    {name:"types",weight:0.3},
    {name:"categories",weight:0.3}
  ]
};

var searchToggle = document.querySelector('#search-toggle');
var searchForm = document.querySelector('#search-query');
var searchInput = document.querySelector('.search-input');

var searchPageInput = document.querySelector('#search-page-query');
var searchResults = document.querySelector('#search-results');
var searchQuery = new URLSearchParams(document.location.search.substr(1)).get('s');

function toggleSearch() {
  if (!searchForm.classList.contains('is-open')) {
    searchForm.classList.add('is-open');
    searchInput.focus();
  } else {
    searchInput.blur();
    searchForm.classList.remove('is-open');
    searchToggle.blur();
  }
}

function doSearch(query) {
  var url = '/index.json';
  fetch(url).then((r) => r.json())
    .then((data) => doFuse(data));
}

function doFuse(data) {
  var pages = data;
  var fuse = new Fuse(pages, fuseOptions);
  var result = fuse.search(searchQuery);
  if (result.length > 0) {
    displayResults(result);
  } else {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('No matches found'));
    searchResults.appendChild(p);
  }
}

function displayResults() {

}


if (searchQuery) {
  searchPageInput.value = searchQuery;
  doSearch(searchQuery);
}

searchToggle.addEventListener('click', toggleSearch);
