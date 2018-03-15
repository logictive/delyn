// JS Goes here - ES6 supported

var nav = document.querySelector('.navbar');
var position = 0;
var navShrink = 200;

window.addEventListener('scroll', function(){
  if(position < navShrink) {
    nav.classList.remove('is-shrunk');
    position = window.pageYOffset;
  } else {
    nav.classList.add('is-shrunk');
    position = window.pageYOffset;
  }
});

var navToggle = document.querySelector('.navbar-toggle');
var navbarNav = document.querySelector('.navbar-nav');

navToggle.addEventListener('click', () => {
    navbarNav.classList.add('is-active');
    navbarNav.classList.toggle('is-open');
    navbarNav.addEventListener('transitionend', () => {
      navbarNav.classList.remove('is-active');
    })
});

window.addEventListener('resize', () => {
  if ( window.innerWidth > 767) {
    navbarNav.classList.remove('is-open');
  }
});

// Product List
var productControls = document.querySelectorAll('.product-controls button');
var productList = document.querySelector('.productlist');

productControls.forEach(function(item) {
  item.addEventListener('click', function() {
    Array.from(this.parentElement.children).forEach((child) => { child.classList.add('button-light') });
    this.classList.remove('button-light');
    var viewType = this.dataset.view;
    productList.classList.add('is-changing');
    productList.addEventListener('transitionend', function() {
      this.classList = 'productlist';
      this.classList.add(viewType);
    });
  });
});
