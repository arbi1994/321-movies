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
      navBar.style.backdropFilter = "blur(10px)";

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

      const placeholder = document.createElement("div")
      card.appendChild(placeholder)
  
      //get ratings
      const rating = getRatings(movie)
  
      card.innerHTML += `
                        <img src="${placeholder}" data-src="${imgURL}${posterPath}" alt="">
  
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

      //do not display movies with no image and title
      if(posterPath === undefined || posterPath === null || movieTitle === null){
        card.style.display = "none"
      }

      //select all images
      const images = document.querySelectorAll(".cards__card img")
      let imageOptions = {}

      //create observer
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          //if we do not have any content on screen then just return out of the callback
          if(!entry.isIntersecting) return
          
          const image = entry.target 

          const newURL = image.getAttribute("data-src") //get the data-src attribute

          image.src = newURL //replace the actual image src with the data-src
         
          observer.unobserve(image) //remove observer after images have been properly loaded
        })
      }, imageOptions)

      images.forEach(image => {
        observer.observe(image) //assign the observer to each image so that it can track each image
      })
      
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
  
  if((scrollTop + clientHeight + 500) >= scrollHeight & !isScrolled){

      isScrolled = true //set isScrolled to true to continue scrolling after bottom reached 
      console.log("bottom")

      pageNum++;

      //if no data don't increase page number
      if(movies.length == 0){
        return 
      }
      
      if(endPoint == "/discover/movie"){
        getMovies(pageNum)
        console.log("bottom page")
      }
      if(endPoint == "/search/multi"){
        getSearchedMovies(pageNum)
      }

      setTimeout(() => {
          isScrolled = false;
      }, 1000);
  }
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
  const searchInput = document.querySelector(".search__bar .input").value
  const navInput = document.querySelector(".navbar__input").value

  return searchInput ? sessionStorage.setItem("input", searchInput) : sessionStorage.setItem("input", navInput)

}

/**
 * Get searched Movies data and Display it
 * @param {Integer} page 
 */
const getSearchedMovies = (page) => {
  if (page === 1) { movies = [] } //make sure it does not load same movies twice

  //const input = getSearchInput() //new input value reference

  const input = sessionStorage.getItem("input");

  endPoint = "/search/multi" //path

  let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&query=${input}&page=${page}` //search url
  console.log(url)

  displayMovies(url) //display movies
}

/**
 * Actions performed on click 
 */
const searchedMovies = () => {
  cardsContainer.innerHTML = "" //empty container before loading new data

  document.querySelector(".search__popup").classList.remove("show") //close search popup

  getSearchedMovies()

  window.location.href = "#movies"
}

//Bind search to the on click event

//At navbar input
document.querySelector(".fa-play").onclick = () => {
  searchedMovies()
  document.querySelector(".navbar__input").value = ""
}

//At search popup input
document.querySelector(".search").onclick = () => {
  getSearchInput()
  searchedMovies()
  document.querySelector(".search__bar .input").value = ""
}

//At navbar input when enter key is pressed
document.querySelector(".search__bar .input").onkeydown = (e) => {
  if(e.keyCode === 13){
    e.preventDefault()
    e.stopImmediatePropagation()

    searchedMovies()
  }
}

//At search popup input when enter key is pressed
document.querySelector(".navbar__input").onkeydown = (e) => {
  if(e.keyCode === 13){
    e.preventDefault()
    e.stopImmediatePropagation()
    
    searchedMovies()
  }
}


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

/** 
 * Slideshow
*/

let imgsArr = [] //carousel images
const pictureEl = document.querySelector(".hero__carousel picture")

//get latest 3 movies on cinema
const getCarouselData = async () => {
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKEY}` //url
  const resp = await fetch(url) //fetch url
  const json = await resp.json() //result
  const dataArr = Object.values(json)[1]
  //console.log(dataArr)

  //root path to the image files
  const imgURL = "https://image.tmdb.org/t/p/original"

  //loop through and get the first 3 data
  dataArr.forEach((data, index) => {
    if(index < 3){
      //console.log(data)
      const img = `${imgURL}${data.backdrop_path}`
      const title = `${data.original_title}`

      const imgEl = document.createElement("img")
      createImgElements(imgEl, img, title)

      imgsArr.push(imgEl)
    }
  })
}
getCarouselData()

let imgs = pictureEl.children
console.log(imgs)
let index = 0
let timer = 5000

function createImgElements(el, img, title){
  
  pictureEl.appendChild(el)
  el.src = img
  el.alt = title
}
// createImgElements()

function fadeIn(el){
  el.className = "fadeIn"
}

function fadeOut(el){
  el.className = ""
}

function changeImg(){

  fadeIn(imgs[index])

  index++

  if(index === imgs.length){
    index = 0
    index++
  }
  fadeOut(imgs[index])

  setTimeout("changeImg()", timer)
}

//Page logic
window.onload = () => {
  getMovies()
  genresSlider()
  changeImg()
}

//Bind the infiniteScroll function to the onscroll event
window.onscroll = () => {
  infiniteScroll()
}




