const youtube = document.querySelectorAll('.youtube');

youtube.forEach((video) => {
  const source = 'https://img.youtube.com/vi/' + video.dataset.embed + '/sddefault.jpg';
  const image = new Image();
  image.src = source;
  image.addEventListener('load', () => {
    video.querySelector('.youtube-wrapper').appendChild(image);
  });

  video.querySelector('.youtube-wrapper').addEventListener('click', function() {
    console.log('this');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.parentNode.dataset.embed + '?rel=0&showinfo=0&autoplay=1');
    this.innerHTML = '';
    this.appendChild(iframe);
  });
});
