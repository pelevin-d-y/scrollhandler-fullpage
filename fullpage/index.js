import Events from './Events.js'

class FullPage extends Events {
  constructor(baseContainer = 'fp-container', sections = 'fp-section', time, options) {
    if (typeof baseContainer === 'string') {
      baseContainer = document.querySelector(`.${baseContainer}`)
    }

    if (typeof sections === 'string') {
      sections = document.querySelectorAll(`.${sections}`)
    }

    super(baseContainer, sections, time, options)
  }
}

export default FullPage