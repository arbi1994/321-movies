/**
 * Show/Hide navbar when scrolling
 */
 {
    const navBar = document.querySelector(".navbar")
    let prevScrollPos = window.pageYOffset
  
    window.addEventListener("scroll", () => {
      showHideNavbar()
    })
  
    const showHideNavbar = () => {
      let currScrollPos = window.pageYOffset
      //console.log(currScrollPos)
  
      if(prevScrollPos > currScrollPos){
        navBar.style.visibility = "visible"
        navBar.style.opacity = "1"
        navBar.style.backdropFilter = "blur(10px)";
  
        currScrollPos === 0 ? navBar.style.backdropFilter = "blur(0px)" : null
      }else{
        navBar.style.opacity = "0"
        navBar.style.visibility = "hidden"
      }
  
      prevScrollPos = currScrollPos
    }
  }