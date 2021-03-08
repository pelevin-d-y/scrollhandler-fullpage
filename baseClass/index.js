class BaseClass {
  constructor(baseContainer, section, time) {
    this.section = section
    this.baseContainer = baseContainer
    this.time = time

    this.currentSection = 0
  }

  get sectionHeight() {
    return this.section.clientHeight
  }

  get baseContainerHeight() {
    return this.baseContainer.clientHeight
  }

  set currentSection(value) {
    this.currentSection = value 
  }
}

export default BaseClass