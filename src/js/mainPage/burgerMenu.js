/* BURGER MENU */
(function(){
  const burgerIcon = document.querySelector(".navbar__burger img") //open icon
  const closeIcon = document.querySelector(".menu--mobile__close") //close icon
  const menu = document.querySelector(".nav__menu--mobile") //menu
  const navLinks = document.querySelectorAll(".menu__list a")

  const openMenu = () => {
      burgerIcon.addEventListener("click", () => {
      menu.classList.add("open")
      disableScroll(menu)
    })
  }

  const closeMenu = () => {
    closeIcon.addEventListener("click", () => {
      menu.classList.remove("open")
      enableScroll(menu)
    })
  }

  const navigateMenu = () => {
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open")
        enableScroll(menu)
      })
    })
  }

  if(menu !== null){
    openMenu()
    closeMenu()
    navigateMenu()
  }

})()