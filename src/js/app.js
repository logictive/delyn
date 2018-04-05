import './search';
import './progressiveimage';
import './youtube-embed';

var nav = document.querySelector('.navbar');
var position = 0;
var navShrink = 200;

function scroll() {
  if (position < navShrink) {
    nav.classList.remove('is-shrunk');
    position = window.pageYOffset;
  } else {
    nav.classList.add('is-shrunk');
    position = window.pageYOffset;
  }
}

function checkScroll() {
  position = window.pageYOffset;
  scroll();
}

function toggleNav(nav) {
  nav.classList.add('is-active');
  nav.classList.toggle('is-open');
  nav.addEventListener('transitionend', () => {
    nav.classList.remove('is-active');
  });
}

window.onload = function() {
  checkScroll();
};

window.addEventListener('scroll', scroll);

var navToggle = document.querySelector('.navbar-toggle');
var navbarNav = document.querySelector('.navbar-wrapper');

navToggle.addEventListener('click', () => toggleNav(navbarNav));

window.addEventListener('resize', () => {
  if (window.innerWidth > 767) {
    navbarNav.classList.remove('is-open');
  }
});

// Product List
var productControls = document.querySelectorAll('.product-controls button');
var productList = document.querySelector('.productlist');

productControls.forEach(function(item) {
  item.addEventListener('click', function() {
    Array.from(this.parentElement.children).forEach((child) => { child.classList.add('button-light'); });
    this.classList.remove('button-light');
    var viewType = this.dataset.view;
    productList.classList.add('is-changing');
    productList.addEventListener('transitionend', function() {
      this.classList = 'productlist';
      this.classList.add(viewType);
    });
  });
});


