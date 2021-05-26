/* BURGER MENU */
(function(){
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
})()

/* Show/Hide navbar when scrolling */
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
(function(){
  //const searchIcon = document.querySelector(".hero__search")//search icon
  const popup = document.querySelector(".search__popup")

  document.querySelector(".navbar__button").addEventListener("click", () => {
    //open up search popup
    popup.classList.add("show")
    document.querySelector("#home").style.boxShadow = "inset 0px 0px 500px 200px rgb(0, 0, 0, 0.5)"
  })

  document.querySelector(".fa-times").addEventListener("click", () => {
    //close down search popup
    popup.classList.remove("show")
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
      document.querySelector(".fa-play").style.opacity = "0"

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


//get cards container where we are going to display our cards
const cardsContainer = document.querySelector(".cards__container")  
const APIKEY = "f569c35640a9131fdf30825f47683372" //api key
let movies = [] //empty movies array where we are going to store our movies data
let pageNum = 1; //set page number to 1
let genre = "" 
let endPoint = ""

/**
 * Get all movies genres
 * @returns {Array of Objects}
 */
async function getMoviesGenres(){
  //api url
  const APIURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US`
  //response
  try{
    const resp = await fetch(APIURL)
    //convert response to json format
    const json = await resp.json()
    //convert json into an array of objects
    const genres = Object.values(json)[0]
    //console.log(genres)

    return genres
  }catch(err){
    console.log(err.message)
  }
}

/**
 * Assign each genre id to each genre_btn
 * @param {NodeList object} btn 
 */
async function assignGenreId(btn){
  const genres = await getMoviesGenres()
  genres.forEach(genre => {
    if(genre.name == btn.id){
        btn.id = genre.id
    }  
  })
}

const genreBtns = document.querySelectorAll(".genre_btn") //select all buttons

/**
 * Assign each button id to the genre variable and load data accordingly on button click  
 */
const genreId = () => {

    genreBtns.forEach(btn => {
        assignGenreId(btn)
    
        btn.addEventListener('click', () => {
            cardsContainer.innerHTML = "" //empty the cards container before loading new data
            pageNum = 1 //reset page number to 1
            
            genre = btn.id 
            console.log(genre)

            let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNum}&with_genres=${genre}`;
            
            //call function to get and populate data
            getMovies(pageNum, url)
            console.log(url)
            console.log(pageNum)
        })
    })
}
genreId()

/**
 * Get movies data
 * @param {Number} page 
 * @param {String} url 
 */
const getMovies = (page, url) => {
  // when the user changes genres or year, we need to clear
  // the movies array out instead of just filtering
  // so it doesn’t add the same movie twice
  if (page === 1) { movies = [] }

  //path
  endPoint = "/discover/movie"
  // url
  url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNum}&with_genres=${genre}`;  console.log(url)

  displayMovies(url)
}

const displayMovies = async (url) => {
  try{
    //root path to the image files
    const imgURL = "https://image.tmdb.org/t/p/w500"
    //response
    const resp = await fetch(url)
    //convert response to json format
    const json = await resp.json()
    //convert json object into array of objects
    movies = Object.values(json)[1]

    movies.forEach((movie, index) => {
      movies.push(movie)

      //get movies titles
      const movieTitle = movie.original_title
      //get image path
      const posterPath = movie.poster_path
      //create card
      const card = document.createElement("div")
      //assign a class to it
      card.classList.add("cards__card")
      //assign id
      card.id = movie.id
      //append it to the parent
      cardsContainer.appendChild(card)
  
      //get ratings
      const rating = getRatings(movie)
  
      card.innerHTML += `
                        <img src="${imgURL}${posterPath}" alt="">
  
                        <div class="cards__title">
                          <h6>${movieTitle}</h6>
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
      
      card.setAttribute("onClick", `linkMovieDetails(${card.id})`)
    })
  }catch(err){
    console.log(err.message)
  }
}

/**
 * Get the ratings and convert them into %
 * @param {Object} movie 
 * @returns {Number}
 */
const getRatings = (movie) => {
  //get average vote
  const vote = movie.vote_average
  //transform vote into percentage
  const votePercent = (vote / 10) * 100

  return votePercent
}

/**
 * Apply Infinite scrolling
 */
let isScrolled = false //set scrolling to false
const infiniteScroll = () => {
  const {scrollHeight, scrollTop, clientHeight} = document.documentElement
  
  if((scrollTop + clientHeight + 100) >= scrollHeight & !isScrolled){

      isScrolled = true //set isScrolled to true to continue scrolling after bottom reached 
      console.log("bottom")

      pageNum++;

      //if no data don't increase page number
      if(movies.length == 0){
        return 
      }
      
      if(endPoint == "/discover/movie"){
        getMovies(pageNum)
      }
      if(endPoint == "/search/multi"){
        getSearchedMovies(pageNum)
      }

      setTimeout(() => {
          isScrolled = false;
      }, 1000);
  }
}

//Bind the infiniteScroll function to the onscroll event
window.onscroll = () => {
  infiniteScroll()
}
//Load movies on page load
window.onload = () => {
  getMovies()
}

/**
 * Link current page with Movie details page
 * @param {Integer} id 
 */
const linkMovieDetails = (id) => {
  sessionStorage.setItem("movie id", id);
  window.open("pages/info.html", "_blank");
  console.log("linked");
}

/**
 * Get input value
 * @returns {String}
 */
const getSearchInput = () => {
  return document.querySelector(".search__bar .input").value
}

const getSearchedMovies = (page) => {
  if (page === 1) { movies = [] } //make sure it does not load same movies twice

  const input = getSearchInput() //new reference
  
  endPoint = "/search/multi" //path

  let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&query=${input}&page=${page}` //search url
  console.log(url)

  displayMovies(url) //display movies
}

const search = () => {
  cardsContainer.innerHTML = "" //empty container before loading new data
  // const input = getSearchInput
  // //if there is no text inserted then display message
  // if(input.length == 0){
  //   alert("Please type something...")
  // }

  document.querySelector(".search__popup").classList.remove("show") //close search popup
  

  console.log(document.querySelector(".search__bar .input").innerText)

  getSearchedMovies()

  window.location.href = "#movies"

  document.querySelector(".search__bar .input").textContent = "" //reset input container
  console.log(document.querySelector(".search__bar .input").innerText)
}

//Display results on click
const playIcon = document.querySelector(".search__bar a") //select play icon
playIcon.addEventListener("click", (e) => {
  e.preventDefault()

  search()
  
})
document.querySelector(".search__bar .input").addEventListener('keydown', (e) => {
  if(e.keyCode === 13){
    e.preventDefault()
    e.stopImmediatePropagation()

    search()

    document.querySelector("#home").style.boxShadow = "none"
  }
})






