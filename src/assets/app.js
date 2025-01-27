$(document).ready(function() {
  // fix menu when passed
  $('.masthead').visibility({
      once: false,
      onBottomPassed: function() {
        $('.fixed.menu').transition('fade in');
      },
      onBottomPassedReverse: function() {
        $('.fixed.menu').transition('fade out');
      }
    });

  // create sidebar and attach to menu open
  $('.ui.sidebar').sidebar('attach events', '.toc.item');
  $('.dropdown').dropdown();
  $('.ui.accordion').accordion();
  $('.ui.tabular.menu .item').tab();
  $('.unite-gallery').unitegallery({
    lightbox_type: 'compact'
  });

  videojs(document.querySelector('.video-js'));
});