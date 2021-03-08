class BaseClass {
  constructor(baseContainer, sections, time) {
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
      this.setCurrentSection(this.currentSection + 1)
      this.setCurrentTransform()
      if (this.getNextTransformValue() >= this.getBaseContainerHeight) {
        return
      }
      this.startTransition('next')
      this.setActiveNavigation()
    }
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

  setCurrentTransform() {
    this.currentTransform = this.currentSection * this.getSectionHeight()
  }

  startTransition = (direction) => {


    var translate3d = 'translate3d(0px, -' + this.currentTransform + 'px, 0px)'
    this.css(this.baseContainer, this.getTransforms(translate3d))
  }  
}

export default BaseClass