import Events from './Events.js'

class FullPage extends Events {
  constructor(baseContainer = 'fp-container', options = {}) {
    const {sectionClass, time} = options
    if (typeof baseContainer === 'string') {
      baseContainer = document.querySelector(`.${baseContainer}`)
    }
    
    options.time = time || 700
    options.sections = baseContainer.querySelectorAll(`.${sectionClass || 'section'}`)

    super(baseContainer, options)
  }
}

export default FullPage