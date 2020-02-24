class ScrollHandler {
  constructor(moveNextAction, movePrevAction, time) {
    this.isScrollAllowed = {
      m: { 'up':true, 'down':true, 'left':true, 'right':true }
    };
  
    this.prevTime = null;
    this.curTime = null;
    this.timeDiff = null;
    this.scrollings = [];
  
    this.canScroll = true;
    this.afterSectionLoadsId = null;

    this['next'] = moveNextAction;
    this['prev'] = movePrevAction;
    this.time = time

    this.addMouseWheelHandler();
    this.addToushHandler()
  }

  addMouseWheelHandler() {
    var prefix = '';
    var _addEventListener;

    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = 'on';
    }

    // detect available wheel event
    var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
              'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox


    if (support == 'DOMMouseScroll') {
        document[ _addEventListener ](prefix + 'MozMousePixelScroll', this.MouseWheelHandler.bind(this));
    }

    //handle MozMousePixelScroll in older Firefox
    else { 
        document[ _addEventListener ](prefix + support, this.MouseWheelHandler.bind(this));
    }
  }

  addToushHandler() {
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
      return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                

    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* left swipe */ 
            } else {
                /* right swipe */
            }                       
        } else {
            if ( yDiff > 0 ) {
              console.log('handleTouchMove next')
              this.move('next')
            } else { 
              console.log('handleTouchMove prev')
              this.move('prev')
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
  }

  

  getAverage (elements, number) {
    var sum = 0;
    //taking `number` elements from the end to make the average, if there are not enought, 1
    var lastElements = elements.slice(Math.max(elements.length - number, 1));

    for (var i = 0; i < lastElements.length; i++) {
      sum = sum + lastElements[i];
    }

    return Math.ceil(sum/number);
  }

  MouseWheelHandler(e) {
    this.curTime = new Date().getTime();
  
    if (!this.isScrollAllowed.m.down && !this.isScrollAllowed.m.up) {
      preventDefault(e);
      return false;
    }

    // cross-browser wheel delta
    e = e || window.event;
    var value = e.wheelDelta || -e.deltaY || -e.detail;
    var delta = Math.max(-1, Math.min(1, value));

    var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
    var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

    //Limiting the array to 150 (lets not waste memory!)
    if (this.scrollings.length > 149) {
      this.scrollings.shift();
    }

    //keeping record of the previous this.scrollings
    this.scrollings.push(Math.abs(value));

    //time difference between the last scroll and the current one
    this.timeDiff = this.curTime - this.prevTime;
    this.prevTime = this.curTime;
    //haven't they scrolled in a while?
    //(enough to be consider a different scrolling action to scroll another section)
    if (this.timeDiff > 200){
      //emptying the array, we dont care about old this.scrollings for our averages
      this.scrollings = [];
    }

    if (this.canScroll) {
      var averageEnd = this.getAverage(this.scrollings, 10);
      var averageMiddle = this.getAverage(this.scrollings, 70);
      var isAccelerating = averageEnd >= averageMiddle;
      //to avoid double swipes...
      if (isAccelerating && isScrollingVertically ){
        //scrolling down?
        if (delta < 0) {
          this.move('next')
        //scrolling up?
        } else {
          this.move('prev')
        }
      }
    }

    return false;
  }

  removeMouseWheelHandler() {
    if (document.addEventListener) {
        document.removeEventListener('mousewheel', this.MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
        document.removeEventListener('wheel', this.MouseWheelHandler, false); //Firefox
        document.removeEventListener('MozMousePixelScroll', this.MouseWheelHandler, false); //old Firefox
    } else {
        document.detachEvent('onmousewheel', this.MouseWheelHandler); //IE 6/7/8
    }
  }

  move(direction) {
    this.canScroll = false
    this[direction]();
    clearTimeout(this.afterSectionLoadsId);
    this.afterSectionLoadsId = setTimeout(() => {
      this.canScroll = true
    }, this.time)
  }
}