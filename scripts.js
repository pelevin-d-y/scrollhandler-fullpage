import Events from './fullpage/events.js'

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
  const fullPage = new Events(
    baseContainerEl,
    sectionEl,
    700
  )
})