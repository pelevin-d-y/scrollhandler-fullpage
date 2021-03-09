import Navigation from './navigation.js'

class Handlers extends Navigation {
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

  getAverage(elements, number) {
    var sum = 0
    //taking `number` elements from the end to make the average, if there are not enought, 1
    var lastElements = elements.slice(Math.max(elements.length - number, 1))

    for (var i = 0; i < lastElements.length; i++) {
      sum = sum + lastElements[i]
    }

    return Math.ceil(sum / number)
  }

  move(direction) {
    this.canScroll = false
    this[direction]()
    clearTimeout(this.afterSectionLoadsId)
    this.afterSectionLoadsId = setTimeout(() => {
      this.canScroll = true
    }, this.time)
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

  navigationItemsHandler(event) {
    const navNumber = event.currentTarget.getAttribute('data-nav')
    this.setCurrentSection(Number(navNumber))
    this.setTransform()
    this.startTransition()
    this.setActiveNavigation()
  }

  resizeHandler() {
    clearTimeout(this.resizeId)
    this.resizeId = setTimeout(() => {
      this.reRender()
    }, 350)
  }
}

export default Handlers