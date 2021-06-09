/**
 * Show and hide search window and navbar search input
 */
(function(){
    //const searchIcon = document.querySelector(".hero__search")//search icon
    const searchWindow = document.querySelector(".search__window")
  
    //open up search window
    document.querySelector(".navbar__button").addEventListener("click", () => {
      disableScroll(searchWindow)
      document.querySelector("#home").style.boxShadow = "inset 0px 0px 500px 200px rgb(0, 0, 0, 0.5)"
    })
  
      //close down search window
    document.querySelector(".fa-times").addEventListener("click", () => {
      enableScroll(searchWindow)
      document.querySelector("#home").style.boxShadow = "none"
    })
  
    //open up input box
    document.querySelector(".navbar__input").onclick = (e) => {
      document.querySelector(".navbar__input").classList.add("slide-left")
      document.querySelector(".fa-play").style.opacity = "1"
    }

    //close input box by clicking anywhere in the body document
    document.querySelector("body").onclick = (e) => {
      if(!e.target.classList.contains("navbar__input")){
        document.querySelector(".navbar__input").classList.remove("slide-left")
        document.querySelector(".fa-play").style.opacity = "1"
      }
    }

    //show underline when hover over
    document.querySelector(".navbar__input").addEventListener("mouseover", () => {
      document.querySelector(".underline").style.background = "#f4f0fa"
    }) 

    //on mouse out hide underline
    document.querySelector(".navbar__input").addEventListener("mouseout", () => {
      document.querySelector(".underline").style.background = "#f4f0fa00"
    })
})()

/**
 * Get input value
 * @returns {String}
 */
 const getSearchInput = () => {
    const searchInput = document.querySelector(".search__bar .input").value
    const navInput = document.querySelector(".navbar__input").value
  
    return searchInput ? sessionStorage.setItem("input", searchInput) : sessionStorage.setItem("input", navInput)
}
  
/**
 * Get searched Movies data and Display it
 */
const getSearchedMovies = (page) => {
    
    const input = sessionStorage.getItem("input");

    endPoint = "/search/multi" //path

    if(page === undefined){
        page = 1
    }

    if(page === totalPages){
        return
    }

    let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&query=${input}&page=${page}` //search url

    displayMovies(url) //display movies
}

/**
 * Actions performed on click 
 */
const searchedMovies = (e) => {
cardsContainer.innerHTML = "" //empty container before loading new data
const targetElement = document.querySelector(".search__window")

if(e.keyCode === 13){
    document.querySelector(".search__bar .input").value = "" //remove search bar input value after press enter
    document.querySelector(".navbar__input").value = "" //remove navbar input value after press enter
    enableScroll(targetElement)
}

    document.querySelector(".search__window").classList.remove("show") //close search popup

    getSearchedMovies()

    window.location.href = "#movies"
}

//Bind search to the on click event

//At navbar input
document.querySelector(".fa-play").onclick = (e) => {
    getSearchInput()
    searchedMovies(e)

    document.querySelector(".search__bar .input").value = "" //remove search bar input value after click
    enableScroll(document.querySelector(".search__window"))
}

//At search window input
document.querySelector(".search").onclick = (e) => {
    getSearchInput()
    searchedMovies(e)

    document.querySelector(".navbar__input").value = "" //remove navbar input value after click
    enableScroll(document.querySelector(".search__window"))
}

//At navbar input when enter key is pressed
document.querySelector(".search__bar .input").onkeydown = (e) => {
    if(e.keyCode === 13){
        e.preventDefault()
        e.stopImmediatePropagation()

        pageNum = 1

        getSearchInput()
        searchedMovies(e)
    }
}

//At search popup input when enter key is pressed
document.querySelector(".navbar__input").onkeydown = (e) => {
    if(e.keyCode === 13){
        e.preventDefault()
        e.stopImmediatePropagation()
        
        pageNum = 1

        getSearchInput()
        searchedMovies(e)
    }
}
