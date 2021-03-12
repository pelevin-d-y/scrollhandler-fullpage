import FullPage from './fullpage/index.js'

window.addEventListener('load', () => {
  const baseContainerEl = document.querySelector('.base-container')
  const FullPageInst = new FullPage(
    baseContainerEl,
    {
      onLeave: (nextSection) => {
        console.log(nextSection, 'onLeave')
      }
    }
  )
})