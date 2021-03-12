import BaseClass from './base.js'

class Navigation extends BaseClass {
  constructor (baseContainer, options) {
    super(baseContainer, options)
    this.initNavigation()
  }

  initNavigation() {
    const nav = document.querySelector('.fp-nav')
    const navList = nav.querySelector('.fp-nav__list')
    if (navList.children.length > 0) {
      return
    }

    let i = 0
    const startNumberElement = document.querySelector('.fp-nav__start-number')
    startNumberElement.textContent = (this.currentSection + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    const endNumberElement = document.querySelector('.fp-nav__end-number')
    endNumberElement.textContent = this.getSectionsQuantity().toLocaleString('en-US', { minimumIntegerDigits: 2 })
    
    while (this.getSectionsQuantity() > i) {
      let li = document.createElement('li')
      li.classList.add('fp-nav__item')
      li.classList.add(`fp-nav__item-${i}`)

      if (i === 0) {
        li.classList.add('active')
      }
      li.setAttribute('data-nav', i)
      navList.append(li)
      i++
    }
  }

  setActiveNavigation() {
    const prevActiveElement = document.querySelector('.fp-nav__item.active')
    const nextActiveElement = document.querySelector(`li[data-nav="${this.currentSection}"]`)
    const startNumberElement = document.querySelector('.fp-nav__start-number')
    startNumberElement.textContent = (this.currentSection + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    prevActiveElement.classList.remove('active')
    nextActiveElement.classList.add('active')
  }
}

export default Navigation