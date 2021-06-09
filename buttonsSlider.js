/**
 * Genres Slider
 */
 const genresSlider = () => {

    const sliderContent = document.querySelector(".movies__slider") //outer
    const slider = document.querySelector(".movies__genres") //inner
    const btns = document.querySelectorAll(".genres__btn") //select all genre buttons
    const lastBtn = btns[btns.length - 1]
    
    let offsetX = 0
    
    //Get distance between right border of the last button and window left border
    const getLastBtnOffsetValues = () => {
        let innerRect = lastBtn.getBoundingClientRect()
        let rightInnerX = innerRect.right //offset x distance from right border of last btn
    
        return rightInnerX
    }
    
    //Get distance between right border of the sliderContainer and window left border
    const getContainerOffsetValues = () => {
        let outerRect = sliderContent.getBoundingClientRect()
        let rightOuterX = outerRect.right //offset x distance from right border of last btn
    
        return rightOuterX
    }
    
    //Move slider to the left
    const moveLeft = () => {
      const lastBtnOffsetX = getLastBtnOffsetValues()
      const containerOffsetX = getContainerOffsetValues()
    
      //if offsetX is bigger than the rightInnerX then set offsetX to 0 otherwise increase offsetX value
      lastBtnOffsetX <= containerOffsetX ? slider.style.left = `none`: offsetX += sliderContent.clientWidth / 4
    
      //hide right arrow
      if((lastBtnOffsetX - 50) < containerOffsetX){
          rightArrow.style.opacity = "0" 
          sliderContent.style.boxShadow = "none"
      }
    
      //if offsetX is bigger than 0 then show the left arrow otherwise hide
      offsetX > 0 ? leftArrow.style.opacity = '1' : leftArrow.style.opacity = '0'; leftArrow.style.cursor = "pointer"
    
      //move slider to the left 
      slider.style.left = `${-offsetX}px`
    
      // console.log("offset" + offsetX)
      // console.log(lastBtnOffsetX)
      // console.log(containerOffsetX)
    }
    
    //Move slider to the right
    const moveRight = () => {
      //show right arrow
      rightArrow.style.opacity = "1"
      //show box shadow 
      sliderContent.style.boxShadow = "inset -31px 0px 20px -25px #ffffff10"
      
      //if offsetX = 0 then set the offsetX to 0 otherwise increase its value
      offsetX === 0 ? offsetX = 0 : offsetX += -sliderContent.clientWidth / 4
    
      //hide left arrow if offset is 0 otherwise show
      if(offsetX <= 0){
        leftArrow.style.opacity = '0'
        leftArrow.style.cursor = "default"
      }else{
        leftArrow.style.opacity = '1' 
      }
    
      //move slidet to the right
      slider.style.left = `${-offsetX}px`
    }
    
    //Bind arrows to their event listener
    const rightArrow = document.querySelector(".fa-chevron-right")
    rightArrow.addEventListener(("click"), moveLeft)

    const leftArrow = document.querySelector(".fa-chevron-left")
    leftArrow.addEventListener(("click"), moveRight)
}