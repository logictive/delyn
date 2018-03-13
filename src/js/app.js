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
})
