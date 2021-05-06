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