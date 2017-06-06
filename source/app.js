(function () {
  'use strict'

  var options = INSTALL_OPTIONS
  var element

  function getMaxZIndex () {
    var max = 0
    var elements = document.getElementsByTagName('*')

    Array.prototype.slice.call(elements).forEach(function (element) {
      var zIndex = parseInt(document.defaultView.getComputedStyle(element).zIndex, 10)

      max = zIndex ? Math.max(max, zIndex) : max
    })

    return max
  }

  function updateElement () {
    var width = options.width = Math.max(Math.min(options.width, 500), 100)

    element = INSTALL.createElement({selector: 'body', method: 'append'}, element)
    element.setAttribute('app', 'corner-ribbon')
    element.setAttribute('data-size', options.fontSize)
    element.setAttribute('data-position', options.position)

    element.style.zIndex = getMaxZIndex() + 1
    element.style.width = element.style.height = width + 'px'

    var ribbonContent = document.createElement('a')

    if (options.href) {
      ribbonContent.setAttribute('href', options.href)
      if (options.targetBlank) {
        ribbonContent.setAttribute('target', '_blank')
      }
    }

    ribbonContent.innerHTML = options.text
    ribbonContent.className = 'ribbon-content'
    ribbonContent.style.color = options.color || '#fff'
    ribbonContent.style.backgroundColor = options.backgroundColor || '#000'

    element.appendChild(ribbonContent)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions
      updateElement()
    }
  }
}())
