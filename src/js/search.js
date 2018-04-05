import getUrlParameter from './urlparameters';

var summaryInclude = 60;
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
    {name:'internetNo', weight:0.9},
    {name:'productNo', weight:0.9},
    {name:'title', weight:0.8},
    {name:'contents', weight:0.5},
    {name:'types', weight:0.3},
    {name:'categories', weight:0.3},
    {name:'shape', weight:0.3},
    {name:'polymer', weight:0.3},
  ]
};

var searchToggle = document.querySelector('#search-toggle');
var searchForm = document.querySelector('#search-query');
var searchInput = document.querySelector('.search-input');

var searchPageInput = document.querySelector('#search-page-query');
var searchResults = document.querySelector('#search-results');
var searchResultTemplate = document.querySelector('#search-result-template');
var searchQuery = getUrlParameter('s');

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

function displayResults(results) {
  for (const result of results) {
    var data = result.item;
    var id = data.internetNo + ' (' + data.productNo + ')';
    var title = data.title;
    var contents = data.contents;
    var snippet = '';
    var types = data.types;
    var categories = data.categories;
    var shape = data.shape;
    var permalink = data.permalink;
    var polymer = data.polymer;
    var image = data.image;

    if (snippet.length < 1) {
      snippet += contents.substring(0, summaryInclude * 2) + '&hellip;';
    }

    var templateDefinition = searchResultTemplate.innerHTML;
    var output = renderResult(templateDefinition, {
      id:id,
      title:title,
      snippet:snippet,
      types:types,
      categories:categories,
      shape:shape,
      link:permalink,
      polymer:polymer,
      image:image,
    });
    var e = document.createElement('div');
    e.innerHTML = output;
    searchResults.appendChild(e);
  }
}

function renderResult(template, data) {
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    template = template.replace(re, data[key]);
  }
  return template;
}


if (searchQuery) {
  searchPageInput.value = searchQuery;
  doSearch(searchQuery);
}

searchToggle.addEventListener('click', toggleSearch);
