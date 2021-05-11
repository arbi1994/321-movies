/* BURGER MENU */
const burgerIcon = document.querySelector(".navbar__burger img") //open icon
const closeIcon = document.querySelector(".menu--mobile__close") //close icon
const menu = document.querySelector(".navbar__menu--mobile") //menu

burgerIcon.addEventListener("click", () => {
    menu.classList.add("open")
})
closeIcon.addEventListener("click", () => {
    menu.classList.remove("open")
})

/* Show/Hide navbar when scrolling */
const navBar = document.querySelector(".navbar")
let prevScrollPos = window.pageYOffset

window.addEventListener("scroll", () => {
  let currScrollPos = window.pageYOffset
  console.log(currScrollPos)

  if(prevScrollPos > currScrollPos){
    //navBar.style.top = "0"
    navBar.style.opacity = "1"
    navBar.style.backdropFilter = "blur(20px)";
    if(currScrollPos == 0){
      navBar.style.backdropFilter = "blur(0px)";
    }
  }else{
    navBar.style.opacity = "0"
  }

  prevScrollPos = currScrollPos
})