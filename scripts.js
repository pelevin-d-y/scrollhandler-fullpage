"use strict";

window.onload = () => {
  setTimeout(() => {
    scrollTo(0, 0);
  }, 0);
};

document.addEventListener("DOMContentLoaded", () => {
  const baseContainer = document.querySelector(".base-container");
  const section = document.querySelector(".section");
  let sectionHeight = section.clientHeight;
  let baseContainerHeight = baseContainer.clientHeight;
  let currentTransform = 0;
  let resizeId;

  function getTransforms(translate3d) {
    return {
      "-webkit-transform": translate3d,
      "-moz-transform": translate3d,
      "-ms-transform": translate3d,
      transform: translate3d,
    };
  }

  function getCurrentSection() {
    return Math.round(currentTransform / sectionHeight) + 1;
  }

  function reBuild() {
    baseContainerHeight = baseContainer.clientHeight;
    sectionHeight = section.clientHeight;

    currentTransform =
      (getCurrentSection() - 1) * sectionHeight >= baseContainerHeight
        ? baseContainerHeight - sectionHeight
        : (getCurrentSection() - 1) * sectionHeight;

    startTransition();
  }

  function resizeHandler() {
    clearTimeout(resizeId);

    resizeId = setTimeout(function () {
      reBuild();
    }, 350);
  }

  /**
   * Checks if the passed element is an iterable element or not
   */
  function isArrayOrList(el) {
    return (
      Object.prototype.toString.call(el) === "[object Array]" ||
      Object.prototype.toString.call(el) === "[object NodeList]"
    );
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

  const startTransition = (direction) => {
    if (direction) {
      currentTransform =
        direction === "next"
          ? currentTransform + sectionHeight
          : currentTransform - sectionHeight;
    }

    var translate3d = "translate3d(0px, -" + currentTransform + "px, 0px)";
    css(baseContainer, getTransforms(translate3d));
  };

  new ScrollHandler(
    function () {
      console.log("next");
      const nextTransform = currentTransform + sectionHeight;
      if (nextTransform >= baseContainerHeight) {
        currentTransform = baseContainerHeight - sectionHeight;
        return;
      }

      startTransition("next");
    },
    function () {
      console.log("prev");
      if (currentTransform <= 0) {
        currentTransform = 0;
        return;
      }

      startTransition("prev");
    },
    700
  );

  window.addEventListener("resize", resizeHandler);
});
