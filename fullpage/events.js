import Handlers from './handlers.js';

class Events extends Handlers {
  constructor(baseContainer, sections, time) {
    super(baseContainer, sections, time)
    this.navigationListeners=[]

    this.addTouchHandler()
    this.addMouseWheelHandler()
    this.addResizeHandler()
    this.addNavigationHandlers()
  }

  addTouchHandler() {
    document.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      false
    )
    document.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      false
    )
  }

  addMouseWheelHandler() {
    var prefix = ''
    var _addEventListener

    if (window.addEventListener) {
      _addEventListener = 'addEventListener'
    } else {
      _addEventListener = 'attachEvent'
      prefix = 'on'
    }

    // detect available wheel event
    var support =
      'onwheel' in document.createElement('div')
        ? 'wheel' // New browsers
        : document.onmousewheel !== undefined
        ? 'mousewheel' // IE
        : 'DOMMouseScroll' // old Firefox

    if (support == 'DOMMouseScroll') {
      document[_addEventListener](
        prefix + 'MozMousePixelScroll',
        this.MouseWheelHandler.bind(this)
      )
    }

    //handle MozMousePixelScroll in older Firefox
    else {
      document[_addEventListener](
        prefix + support,
        this.MouseWheelHandler.bind(this)
      )
    }
  }

  addResizeHandler() {
    window.addEventListener('resize', this.resizeHandler.bind(this))
  }

  addNavigationHandlers() {
    const navigationItems = document.querySelectorAll('.fp-nav__item')
    this.navigationItems = navigationItems

    navigationItems.forEach((item) => {
      const _listener = this.navigationItemsHandler.bind(this)
      this.navigationListeners.push(_listener)
      item.addEventListener('click', _listener)
    })
  }

  removeNavigationHandlers() {
    const navigationItems = document.querySelectorAll('.fp-nav__item')
    navigationItems.forEach((item, index) => {
      item.removeEventListener('click', this.navigationListeners[index])
    })
  }

  removeMouseWheelHandler() {
    if (document.addEventListener) {
      document.removeEventListener('mousewheel', this.MouseWheelHandler, false)
      document.removeEventListener('wheel', this.MouseWheelHandler, false)
      document.removeEventListener(
        'MozMousePixelScroll',
        this.MouseWheelHandler,
        false
      )
    } else {
      document.detachEvent('onmousewheel', this.MouseWheelHandler)
    }
  }

  removeTouchHandler() {
    document.removeEventListener('touchstart', this.handleTouchStart, false)
    document.removeEventListener('touchmove', this.handleTouchMove, false)
  }

  removeEventListeners() {
    this.removeMouseWheelHandler()
    this.removeTouchHandler()
    this.removeNavigationHandlers()
    document.removeEventListener('resize', this.resizeHandler, false)
  }
}

export default Events