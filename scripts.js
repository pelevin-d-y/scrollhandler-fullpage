'use strict'

const baseContainer = document.querySelector('.base-container')
const section = document.querySelector('.section')
const sectionHeight = section.clientHeight
const baseContainerHeight = baseContainer.clientHeight
let currentTransform = 0

function getTransforms(translate3d) {
  return {
      '-webkit-transform': translate3d,
      '-moz-transform': translate3d,
      '-ms-transform':translate3d,
      'transform': translate3d
  };
}

/**
* Checks if the passed element is an iterable element or not
*/
function isArrayOrList(el){
  return Object.prototype.toString.call( el ) === '[object Array]' ||
    Object.prototype.toString.call( el ) === '[object NodeList]';
  }

function getList(item) {
  return !isArrayOrList(item) ? [item] : item;
}

function css(items, props) {
  items = getList(items);

  var key;
  for (key in props) {
      if (props.hasOwnProperty(key)) {
          if (key !== null) {
              for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  item.style[key] = props[key];
              }
          }
      }
  }

  return items;
}

const nexSlide = () => {
  currentTransform += sectionHeight
  var translate3d = 'translate3d(0px, -' + currentTransform + 'px, 0px)';
  css(baseContainer, getTransforms(translate3d));
}

const prevSlide = () => {
  currentTransform -= sectionHeight
  var translate3d = 'translate3d(0px, -' + currentTransform + 'px, 0px)';
  css(baseContainer, getTransforms(translate3d));
}

const scrollHandler = new ScrollHandler(
  function() {
    console.log('next')
    nexSlide()
  },
  function() {
    console.log('prev')
    prevSlide()
  },
  700
)