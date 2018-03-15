// JS Goes here - ES6 supported

var nav = document.querySelector('.navbar');
var position = 0;
var navShrink = 200;

window.addEventListener('scroll', function(){
  if(position < navShrink) {
    nav.classList.remove('is-shrunk');
    position = window.pageYOffset;
    console.log(position);
  } else {
    nav.classList.add('is-shrunk');
    position = window.pageYOffset;
    console.log(position);
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