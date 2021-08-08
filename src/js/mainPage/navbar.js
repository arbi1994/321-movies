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

    if(prevScrollPos > currScrollPos){
      navBar.style.visibility = "visible"
      navBar.style.opacity = "1"
      navBar.classList.add("active")

      if(currScrollPos === 0){
        navBar.classList.remove("active")
      }

    }else{
      navBar.classList.remove("active")
      navBar.style.visibility = "hidden"
      navBar.style.opacity = "0"
    }

    prevScrollPos = currScrollPos
  }

  //Refresh page when click on logo
  const logo = document.querySelector(".navbar__logo")
  if(logo !== null){
      logo.onclick = () => {
        window.location.reload()
    }
  }

  const aboutLink = document.querySelector(".about")
  console.log(aboutLink)

  aboutLink.addEventListener("click", () => {
    console.log("OK")
    window.open("/about.html", "_blank")
  })
}