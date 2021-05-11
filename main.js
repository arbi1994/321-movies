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
    navBar.style.visibility = "visible"
    navBar.style.opacity = "1"
    navBar.style.backdropFilter = "blur(20px)";
    if(currScrollPos == 0){
      navBar.style.backdropFilter = "blur(0px)";
    }
  }else{
    navBar.style.opacity = "0"
    navBar.style.visibility = "hidden"
  }

  prevScrollPos = currScrollPos
})

/* Show search popup */
const searchIcon = document.querySelector(".hero__search")//search icon
const popup = document.querySelector(".search__popup")

searchIcon.addEventListener("click", () => {
  //open up search popup
  popup.classList.add("show")
})

const closePopup = document.querySelector(".fa-times")//close icon
closePopup.addEventListener("click", () => {
  //close down search popup
  popup.classList.remove("show")
})