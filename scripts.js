import ScrollHandler from './scrollhandler.js'
import BaseClass from './baseClass/index.js'

window.addEventListener('load', () => {
  
  // const baseContainerEl = document.querySelector('.base-container')
  // const sectionEl = document.querySelector('.section')
  // const scrollHandler = new ScrollHandler(
  //   baseContainerEl,
  //   sectionEl,
  //   700
  // )

  const baseContainerEl = document.querySelector('.base-container')
  const sectionEl = document.querySelectorAll('.section')
  const baseClass = new BaseClass(
    baseContainerEl,
    sectionEl,
    700
  )

  console.log('baseClass.sections', baseClass.sections)
})