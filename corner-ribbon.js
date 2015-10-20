(function () {
  var ready, options, getMaxZIndex, canvas, context, getTextWidth, measureText;

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

    for (i = 0, i < totalEls; i++) {
      zIndex = parseInt(document.defaultView.getComputedStyle(allEls[i]).zIndex, 10);
      max = zIndex ? Math.max(max, zIndex) : max;
    }

    return max;
  };

  canvas = document.createElement('canvas');
  context = canvas.getContext('2d');
  getTextWidth = function(text, font) {
    var metrics
    context.font = font;
    return context.measureText(text).width;
  };

  measureText = function(text, fontSize) {
    var div, result;

    div = document.createElement('div');
    document.body.appendChild(div);

    div.style.fontSize = fontSize + 'px';
    div.style.position = 'absolute';
    div.style.left = -1000;
    div.style.top = -1000;

    div.innerHTML = text;

    result = {
      width: div.clientWidth,
      height: div.clientHeight
    };

    document.body.removeChild(div);
    div = null;
    return result;
  };

  options.width = Math.max(Math.min(options.width, 500), 200);

  position = {};
  position.top = options.position.split('-')[0] === 'top';
  position.bottom = !position.top;
  position.left = options.position.split('-')[1] === 'left';
  position.right = !position.left;

  ready(function(){
    var sqrt2, ribbon, ribbonContent, computedStyle, words, textSize, rowCount, rowWidth, row, rows, word, deviation;

    sqrt2 = Math.sqrt(2);

    if (options.href) {
      ribbonContent = document.createElement('a');
      ribbonContent.setAttribute('href', options.href);
      if (options.targetBlank) {
        ribbonContent.setAttribute('target', '_blank');
      }
    } else {
      ribbonContent = document.createElement('div');
    }

    ribbon = document.createElement('div');
    ribbon.setAttribute('class', 'corner-ribbon corner-ribbon-position-' + options.position + ' corner-ribbon-font-size-' + options.fontSize);
    ribbon.setAttribute('style', 'z-index: ' + (getMaxZIndex() + 1) + '; width: ' + options.width + 'px; height: ' + options.width + 'px;');
    document.body.appendChild(ribbon);

    ribbonContent.innerHTML = options.text;
    ribbonContent.setAttribute('class', 'corner-ribbon-content');
    ribbonContent.setAttribute('style', 'width: ' + (parseInt(options.width) * sqrt2) + 'px; color: ' + options.color + '; background-color: ' + options.backgroundColor + ';');
    ribbon.appendChild(ribbonContent);

    computedStyle = window.getComputedStyle(ribbon);

    words = [];
    options.text.split(' ').forEach(function (word) {
      words.push({
        text: word,
        width: getTextWidth(word, computedStyle.fontSize + ' ' + computedStyle.fontFamily)
      });
    });

    textSize = measureText(options.text, s.getPropertyValue('font-size'));

    rowCount = Math.ceil(textSize.width / options.width);
    rowWidth = 0;
    row = [];
    rows = [];
    word = 0;

    while (rows.length < rowCount && word < words.length) {
      if (rowWidth + words[word].width >= options.width - (position.top ? rowCount - rows.length : rows.length) * 2 * textSize.height && (rows.length + 1) * textSize.height + 20 < options.width) {
        rows.push(row.join(' '));
        rowWidth = 0;
        row = [];
      }
      rowWidth += words[word].width;
      row.push(words[word].text);
      word++;
    }

    if (row.length) {
      if (rows.length < rowCount && (rows.length + 1) * textSize.height + 20 < options.width) {
        rows.push(row.join(' '));
      } else {
        rows[rows.length - 1] += '...';
      }
    }
    ribbonContent.innerHTML = rows.join('<br>');

    deviation = {};
    deviation.vertical = ((ribbonContent.clientWidth / 2 + ribbonContent.clientHeight / 2) / sqrt2) - ribbonContent.clientHeight * sqrt2;
    deviation.hoziontal = (((options.width - 1000) / 1000) * deviation - ribbonContent.clientHeight * sqrt2 / 2).toFixed(2);
    if (position.top) {
      ribbonContent.style.top = deviation.vertical + 'px';
    } else {
      ribbonContent.style.bottom = deviation.vertical + 'px';
    }
    if (position.right) {
      ribbonContent.style.right = deviation.hoziontal + 'px';
    } else {
      ribbonContent.style.left = deviation.hoziontal + 'px';
    }
  });
})();
