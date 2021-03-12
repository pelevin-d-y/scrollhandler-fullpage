import Handlers from './handlers.js'

class Events extends Handlers {
  constructor(baseContainer, options) {
    super(baseContainer, options)
    this.navigationListeners = []
    this.listeners = {}

    this.addTouchHandler()
    this.addMouseWheelHandler()
    this.addResizeHandler()
    this.addNavigationHandlers()
  }

  addTouchHandler() {
    const _touchStartListener = this.handleTouchStart.bind(this)
    document.addEventListener('touchstart', _touchStartListener, false)
    const _touchMoveListener = this.handleTouchMove.bind(this)
    document.addEventListener('touchmove', _touchMoveListener, false)

    this.listeners.touchStartHandler = _touchStartListener
    this.listeners.touchMoveHandler = _touchMoveListener
  }

  addMouseWheelHandler() {
    var prefix = ''
    var _addEventListener
    const _listener = this.MouseWheelHandler.bind(this)

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
      document[_addEventListener](prefix + 'MozMousePixelScroll', _listener)
    }

    //handle MozMousePixelScroll in older Firefox
    else {
      document[_addEventListener](prefix + support, _listener)
    }

    this.listeners.mouseWheelHandler = _listener
  }

  addResizeHandler() {
    const _listener = this.resizeHandler.bind(this)
    window.addEventListener('resize', _listener)
    this.listeners.resizeHandler = _listener
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
      document.removeEventListener(
        'mousewheel',
        this.listeners.mouseWheelHandler,
        false
      )

      document.removeEventListener(
        'wheel',
        this.listeners.mouseWheelHandler,
        false
      )

      document.removeEventListener(
        'MozMousePixelScroll',
        this.listeners.mouseWheelHandler,
        false
      )
    } else {
      document.detachEvent('onmousewheel', this.listeners.mouseWheelHandler)
    }
  }

  removeTouchHandler() {
    document.removeEventListener('touchstart', this.listeners.touchStartHandler, false)
    document.removeEventListener('touchmove', this.listeners.touchMoveHandler, false)
  }

  removeEventListeners() {
    this.removeMouseWheelHandler()
    this.removeTouchHandler()
    document.removeEventListener('resize', this.listeners.resizeHandler, false)
  }
}

export default Events
