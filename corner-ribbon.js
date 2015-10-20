(function () {
  var ribbon, options, ready, getMaxZIndex, setOptions, update;

  options = INSTALL_OPTIONS;

  ready = function (fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  getMaxZIndex = function () {
    var zIndex, max, allEls, totalEls, i;

    max = 0;
    allEls = document.getElementsByTagName('*');
    totalEls = allEls.length;

    for (i = 0; i < totalEls; i++) {
      zIndex = parseInt(document.defaultView.getComputedStyle(allEls[i]).zIndex, 10);
      max = zIndex ? Math.max(max, zIndex) : max;
    }

    return max;
  };

  setOptions = function(opts) {
    options = opts;

    update();
  };

  update = function() {
    var ribbonContent;

    options.width = Math.max(Math.min(options.width, 500), 100);

    if (options.href) {
      ribbonContent = document.createElement('a');
      ribbonContent.setAttribute('href', options.href);
      if (options.targetBlank) {
        ribbonContent.setAttribute('target', '_blank');
      }
    } else {
      ribbonContent = document.createElement('div');
    }

    if (!ribbon) {
      ribbon = document.createElement('div');
      document.body.appendChild(ribbon);
    } else {
      ribbon.innerHTML = '';
    }

    ribbon.className = 'corner-ribbon corner-ribbon-position-' + options.position + ' corner-ribbon-font-size-' + options.fontSize;
    ribbon.style.zIndex = getMaxZIndex() + 1;
    ribbon.style.width = ribbon.style.height = options.width + 'px';

    ribbonContent.innerHTML = options.text;
    ribbonContent.className = 'corner-ribbon-content';
    ribbonContent.style.color = options.color;
    ribbonContent.style.backgroundColor = options.backgroundColor;
    ribbon.appendChild(ribbonContent);
  };

  ready(update);

  window.CornerRibbon = {
    setOptions: setOptions
  };
})();
