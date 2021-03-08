import ScrollHandler from './scrollhandler.js'
import BaseClass from './baseClass/index.js'

window.addEventListener('load', () => {
  console.log('BaseClass', BaseClass)
  const baseContainerEl = document.querySelector('.base-container')
  const sectionEl = document.querySelector('.section')
  const scrollHandler = new ScrollHandler(
    baseContainerEl,
    sectionEl,
    700
  )
})