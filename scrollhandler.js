class ScrollHandler {
  constructor(baseContainer, section, time) {
    this.baseContainer = baseContainer
    this.section = section
    this.sectionHeight = section.clientHeight
    this.baseContainerHeight = baseContainer.clientHeight
    this.currentTransform = 0
    this.currentSection = 0
    this.sectionsQuantity = 0

    this.isScrollAllowed = {
      m: { up: true, down: true, left: true, right: true },
    }

    this.prevTime = null
    this.curTime = null
    this.timeDiff = null
    this.scrollings = []

    this.canScroll = true
    this.afterSectionLoadsId = null

    this['next'] = () => {
      const nextTransform = this.currentTransform + this.sectionHeight
      if (nextTransform >= this.baseContainerHeight) {
        this.currentTransform = this.baseContainerHeight - this.sectionHeight
        return
      }
      this.startTransition('next')
      this.setCurrentSection(this.currentSection + 1)
      this.setActiveNavigation()
    }

    (this['prev'] = () => {
      if (this.currentTransform <= 0) {
        this.currentTransform = 0
        return
      }
      this.startTransition('prev')
      this.setCurrentSection(this.currentSection - 1)
      this.setActiveNavigation()
    }),
      (this.time = time)

    this.xDown = null
    this.yDown = null

    this.resizeId = null

    this.disablePageScroll()
    this.addMouseWheelHandler()
    this.addTouchHandler()
    this.addResizeHandler()
    this.setSectionsQuantity()
    this.initNavigation()
  }

  disablePageScroll() {
    document.querySelector('body').classList.add('fp-init')
    document.querySelector('html').classList.add('fp-init')
  }

  getTouches(evt) {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ) // jQuery
  }

  handleTouchStart(evt) {
    const firstTouch = this.getTouches(evt)[0]
    this.xDown = firstTouch.clientX
    this.yDown = firstTouch.clientY
  }

  handleTouchMove(evt) {
    if (!this.xDown || !this.yDown) {
      return
    }

    var xUp = evt.touches[0].clientX
    var yUp = evt.touches[0].clientY

    var xDiff = this.xDown - xUp
    var yDiff = this.yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
      } else {
        /* right swipe */
      }
    } else {
      if (yDiff > 0) {
        this.move('next')
      } else {
        this.move('prev')
      }
    }
    /* reset values */
    this.xDown = null
    this.yDown = null
  }

  initNavigation() {
    const nav = document.querySelector('.fp-nav')
    const navList = nav.querySelector('.fp-nav__list')
    let i = 0
    const startNumberElement = document.querySelector('.fp-nav__start-number')
    startNumberElement.textContent = (this.currentSection + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    const endNumberElement = document.querySelector('.fp-nav__end-number')
    endNumberElement.textContent = this.sectionsQuantity.toLocaleString('en-US', { minimumIntegerDigits: 2 })
    
    while (this.sectionsQuantity > i) {
      let li = document.createElement('li')
      li.classList.add('fp-nav__item')
      li.classList.add(`fp-nav__item-${i}`)

      if (i === 0) {
        li.classList.add('active')
      }
      li.setAttribute('data-nav', i)
      li.addEventListener('click', (event) => {
        const navNumber = event.currentTarget.getAttribute('data-nav')
        this.currentSection = Number(navNumber)
        this.setActiveNavigation()
        this.moveToSection(this.currentSection)
      })
      navList.append(li)
      i++
    }
  }

  setActiveNavigation() {
    const prevActiveElement = document.querySelector('.fp-nav__item.active')
    const nextActiveElement = document.querySelector(`li[data-nav="${this.currentSection}"]`)
    const startNumberElement = document.querySelector('.fp-nav__start-number')
    startNumberElement.textContent = (this.currentSection + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    prevActiveElement.classList.remove('active')
    nextActiveElement.classList.add('active')
  }

  getTransforms(translate3d) {
    return {
      '-webkit-transform': translate3d,
      '-moz-transform': translate3d,
      '-ms-transform': translate3d,
      transform: translate3d,
    }
  }

  getCurrentSection() {
    return Math.round(this.currentTransform / this.sectionHeight) + 1
  }

  setCurrentSection(index) {
    if (index <= 0) {
      this.currentSection = 0
    }
    if (this.sectionsQuantity <= index) {
      this.currentSection = this.currentSection
    }

    this.currentSection = index
  }

  setSectionsQuantity() {
    this.sectionsQuantity = Math.round(
      this.baseContainerHeight / this.sectionHeight
    )
  }

  moveToSection(sectionNumber) {
    if (sectionNumber === 0) {
      this.currentTransform = 0
    } else {
      this.currentTransform = sectionNumber * this.sectionHeight
    }
    this.startTransition()
    this.setCurrentSection(sectionNumber)
  }

  isArrayOrList(el) {
    return (
      Object.prototype.toString.call(el) === '[object Array]' ||
      Object.prototype.toString.call(el) === '[object NodeList]'
    )
  }

  getList(item) {
    return !this.isArrayOrList(item) ? [item] : item
  }

  css(items, props) {
    items = this.getList(items)

    var key
    for (key in props) {
      if (props.hasOwnProperty(key)) {
        if (key !== null) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i]
            item.style[key] = props[key]
          }
        }
      }
    }

    return items
  }

  startTransition = (direction) => {
    if (direction) {
      this.currentTransform =
        direction === 'next'
          ? this.currentTransform + this.sectionHeight
          : this.currentTransform - this.sectionHeight
    }

    var translate3d = 'translate3d(0px, -' + this.currentTransform + 'px, 0px)'
    this.css(this.baseContainer, this.getTransforms(translate3d))
  }

  reRender() {
    this.baseContainerHeight = this.baseContainer.clientHeight
    this.sectionHeight = this.section.clientHeight
    this.currentTransform =
      (this.getCurrentSection() - 1) * this.sectionHeight >=
      this.baseContainerHeight
        ? this.baseContainerHeight - this.sectionHeight
        : (this.getCurrentSection() - 1) * this.sectionHeight
    this.startTransition()
  }

  resizeHandler() {
    clearTimeout(this.resizeId)
    this.resizeId = setTimeout(() => {
      this.reRender()
    }, 350)
  }

  getAverage(elements, number) {
    var sum = 0
    //taking `number` elements from the end to make the average, if there are not enought, 1
    var lastElements = elements.slice(Math.max(elements.length - number, 1))

    for (var i = 0; i < lastElements.length; i++) {
      sum = sum + lastElements[i]
    }

    return Math.ceil(sum / number)
  }

  MouseWheelHandler(e) {
    this.curTime = new Date().getTime()

    if (!this.isScrollAllowed.m.down && !this.isScrollAllowed.m.up) {
      preventDefault(e)
      return false
    }

    // cross-browser wheel delta
    e = e || window.event
    var value = e.wheelDelta || -e.deltaY || -e.detail
    var delta = Math.max(-1, Math.min(1, value))

    var horizontalDetection =
      typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined'
    var isScrollingVertically =
      Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta) ||
      Math.abs(e.deltaX) < Math.abs(e.deltaY) ||
      !horizontalDetection

    //Limiting the array to 150 (lets not waste memory!)
    if (this.scrollings.length > 149) {
      this.scrollings.shift()
    }

    //keeping record of the previous this.scrollings
    this.scrollings.push(Math.abs(value))

    //time difference between the last scroll and the current one
    this.timeDiff = this.curTime - this.prevTime
    this.prevTime = this.curTime
    //haven't they scrolled in a while?
    //(enough to be consider a different scrolling action to scroll another section)
    if (this.timeDiff > 200) {
      //emptying the array, we dont care about old this.scrollings for our averages
      this.scrollings = []
    }

    if (this.canScroll) {
      var averageEnd = this.getAverage(this.scrollings, 10)
      var averageMiddle = this.getAverage(this.scrollings, 70)
      var isAccelerating = averageEnd >= averageMiddle
      //to avoid double swipes...
      if (isAccelerating && isScrollingVertically) {
        //scrolling down?
        if (delta < 0) {
          this.move('next')
          //scrolling up?
        } else {
          this.move('prev')
        }
      }
    }

    return false
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
    document.removeEventListener('resize', this.resizeHandler, false)
  }

  move(direction) {
    this.canScroll = false
    this[direction]()
    clearTimeout(this.afterSectionLoadsId)
    this.afterSectionLoadsId = setTimeout(() => {
      this.canScroll = true
    }, this.time)
  }
}

export default ScrollHandler
