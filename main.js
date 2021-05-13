/* BURGER MENU */
{
  const burgerIcon = document.querySelector(".navbar__burger img") //open icon
  const closeIcon = document.querySelector(".menu--mobile__close") //close icon
  const menu = document.querySelector(".nav__menu--mobile") //menu
  const navLinks = document.querySelectorAll(".menu__list a")

  burgerIcon.addEventListener("click", () => {
      menu.classList.add("open")
  })
  closeIcon.addEventListener("click", () => {
      menu.classList.remove("open")
  })
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open")
    })
  })
}

/* Show/Hide navbar when scrolling */
{
  const navBar = document.querySelector(".navbar")
  let prevScrollPos = window.pageYOffset

  window.addEventListener("scroll", () => {
    showHideNavbar()
  })

  function showHideNavbar(){
    let currScrollPos = window.pageYOffset
    //console.log(currScrollPos)

    if(prevScrollPos > currScrollPos){
      navBar.style.visibility = "visible"
      navBar.style.opacity = "1"
      navBar.style.backdropFilter = "blur(20px)";

      currScrollPos == 0 ? navBar.style.backdropFilter = "blur(0px)" : null
    }else{
      navBar.style.opacity = "0"
      navBar.style.visibility = "hidden"
    }

    prevScrollPos = currScrollPos
  }
}

/* Show search popup */
{
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
}

//api key
const APIKEY = "f569c35640a9131fdf30825f47683372"
//we need api url
const APIURL = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=ads`
//get cards container where we are going to display our cards
const cardsContainer = document.querySelector(".cards__container")

//function to call the api (asyn/await)
async function getLatestMoviesData(){
  //response
  const resp = await fetch(APIURL)
  //convert response to json format
  const json = await resp.json()
  console.log(json)
  //convert json object into array of objects
  const movies = Object.values(json)[1]

  return movies
}

async function populateCards(){
  const movies = await getLatestMoviesData()
  console.log(movies)
  //get img URL
  const imgURL = "https://image.tmdb.org/t/p/w500"

  movies.forEach((movie, index) => {
    //get movies titles
    const movieTitle = movie.original_title
    //get image path
    const posterPath = movie.poster_path
    //create card
    const card = document.createElement("div")
    //assign a class to it
    card.classList.add("cards__card")
    //append it to the parent
    cardsContainer.appendChild(card)

    //get ratings
    const rating = getRatings(movie)

    card.innerHTML = `
                      <img src="${imgURL}${posterPath}" alt="">

                      <div class="cards__title">
                        <h5>${movieTitle}</h5>
                      </div>
                      <div class="cards__rating">
                        <h6>Rating</h6>

                        <div class="rating__stars">
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>

                          <div class="rating__stars--inner" style="width: ${rating}%;">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                          </div>
                        </div>
                      </div>
                    `
  })

}
populateCards()

//calculate movie rating
function getRatings(movie){
    //get average vote
    const vote = movie.vote_average
    //transform vote into percentage
    const votePercent = (vote / 10) * 100

    return votePercent
}


