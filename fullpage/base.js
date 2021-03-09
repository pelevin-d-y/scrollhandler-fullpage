class BaseClass {
  constructor(baseContainer, sections, time, options) {
    this.options = options
    this.sections = Array.from(sections)
    this.baseContainer = baseContainer
    this.time = time

    this.currentSection = 0
    this.currentTransform = 0


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
      const nextSection = this.currentSection + 1
      if (nextSection >= this.getSectionsQuantity()) {
        return
      }
      this.setCurrentSection(nextSection)
      this.setTransform()
      this.startTransition('next')
      this.setActiveNavigation()
    }

    this['prev'] = () => {
      const nextSection = this.currentSection - 1
      if (nextSection < 0) {
        return
      }
      this.setCurrentSection(nextSection)
      this.setTransform()
      this.startTransition('prev')
      this.setActiveNavigation()
    }

    this.disablePageScroll()
  }

  getSectionHeight() {
    return this.sections[0].clientHeight
  }

  getBaseContainerHeight() {
    return this.baseContainer.clientHeight
  }

  getSectionsQuantity() {
    return this.sections.length
  }

  setCurrentSection(value) {
    this.currentSection = value 
  }

  setTransform() {
    this.currentTransform = this.currentSection * this.getSectionHeight()
  }

  getTransforms(translate3d) {
    return {
      '-webkit-transform': translate3d,
      '-moz-transform': translate3d,
      '-ms-transform': translate3d,
      transform: translate3d,
    }
  }

  isArrayOrList(el) {
    return (
      Object.prototype.toString.call(el) === '[object Array]' ||
      Object.prototype.toString.call(el) === '[object NodeList]'
    )
  }

  startTransition = () => {
    this.options.onLeave(this.currentSection)
    var translate3d = 'translate3d(0px, -' + this.currentTransform + 'px, 0px)'
    this.css(this.baseContainer, this.getTransforms(translate3d))
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

  disablePageScroll() {
    document.querySelector('body').classList.add('fp-init')
    document.querySelector('html').classList.add('fp-init')
  }

  reRender() {
    this.setTransform()
    this.startTransition()
  }
}

export default BaseClass