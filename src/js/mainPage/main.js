const cardsContainer = document.querySelector(".cards__container") //get cards container where we are going to display our cards
const genreBtns = document.querySelectorAll(".genre_btn") //select all buttons

const APIKEY = config.API_KEY;
let movies = [] //empty movies array where we are going to store our movies data
let genre = "" 
let endPoint = ""
let totalPages = 0
let totalResults = 0
let index = 0
let pageNum = 1

movieTitleArr = []

/**
 * Get movies data
 * @param {Number} page 
 * @param {String} url 
 */
const getMovies = (page) => {
  if (page == undefined) page = 1
  //path
  endPoint = "/discover/movie"

  
  let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre}`;
  console.log(url)

  displayMovies(url)
}

/**
 * Display movies data
 * @param {String} url 
 */
const displayMovies = async (url) => {
  if(movieTitleArr !== null) movieTitleArr = []

  try{
    //root path to the image files
    const imageKitURL = "https://ik.imagekit.io/iowcmbydcj3"
    const imgURL = "/t/p/w500"
    const imageKitTransformation = "?tr=bl-30"

    //response
    const resp = await fetch(url)

    if(resp.status >= 200 && resp.status <= 299){
      console.log(resp.status)
    }else{
      console.log("NO CONNECTION")
    }

    //convert response to json format
    const json = await resp.json()

    totalPages = json.total_pages //total number of pages
    
    totalResults = json.total_results //total number of movies per response

    //check if we get any data back or if session storage is empty. 
    //If it's so, display error message
    if(totalResults === 0 || sessionStorage.getItem("Movie title") === ""){
      errorMessage() //display error message
    }

    //convert json object into array of objects
    movies = Object.values(json)[1]
    //console.log(movies)
  
    movies.forEach((movie, index) => {
      
      movies.push(movie)
      //console.log(movies)
      
      //get movies titles
      const movieTitle = movie.original_title || movie.name

      movieTitleArr.push(movieTitle)
      
      //get image path
      const posterPath = movie.poster_path
      const imageURL = `${imageKitURL}${imgURL}`
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
  
      card.innerHTML = `
                        <img src="${imageURL}${posterPath}${imageKitTransformation}" data-lazy="${imageURL}${posterPath}" alt="">
  
                        <div class="cards__title">
                          <h5>${movieTitle}</h5>
                        </div>

                        <div class="cards__rating">

                          <h5>Rating</h5>
  
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
      if(posterPath === undefined || posterPath === null || movieTitle === null || movie.media_type === "tv"){
        card.style.display = "none"
      }

      //select all images
      const images = document.querySelectorAll(".cards__card img")

      let imageOptions = {
        threshold: .8,
        rootMargin: "0px 0px 10px 0px"
      }

      //create observer
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          //if we do not have any content on screen then just return out of the callback
          if(!entry.isIntersecting) return
          
          const image = entry.target 
          const newURL = image.getAttribute("data-lazy") //get the data-src attribute

          image.src = newURL //replace the actual image src with the data-src
         
          observer.unobserve(image) //remove observer after images have been properly loaded

        })
      }, imageOptions)

      images.forEach(image => {
        observer.observe(image) //assign the observer to each image so that it can track each image
      })
      
      //----- Link card to the movie details page -----//
      card.setAttribute("onClick", `linkMovieDetails(${card.id})`) 
    })
  }catch(err){
    console.log(err.message)

    if(err.message === "Failed to fetch"){
      console.log("CONNECTION LOST")

      cardsContainer.innerHTML = ""

      const svg = `
                <svg viewBox="0 0 496 464" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M202 1.09998C128.3 9.19998 64.7 50.9 28.6 114.8C15.6 137.8 6.1 166.5 1.9 195.5C1.1 200.5 0.5 213.2 0.5 224C0.5 244.5 1.6 254.1 5.6 272.8C23.5 354.1 86.9 419.8 167.5 440.5C220.4 454.1 271.7 449 322.3 425.3C330.8 421.2 332.3 420.8 333.1 422.2C335.5 426.6 343.7 436.4 348.3 440.6C383.1 472.1 435.7 471.4 469 439C481.1 427.3 489.1 413.5 493.6 396.4C496.3 386.1 496.2 365.2 493.3 354.5C486 327.6 467.1 305.5 442.3 295L437.2 292.8L439.1 286.2C445.4 264.4 447.5 248.9 447.5 223.5C447.4 200.5 446.1 189.5 441 168.8C423.4 98.7 371.5 40.6 303 14.5C291.2 9.99998 270.8 4.69998 257 2.49998C244.4 0.59998 213.8 -0.20002 202 1.09998ZM244.1 17C281.8 20.8 318.8 35.2 348.9 57.8C358.4 64.9 376.2 82.1 384.6 92.1C427 143 442.5 215.7 424.4 279.6L421.8 288.8L412.1 288.3C370.8 286.1 333.8 313.5 322.7 354.5C319.1 368 320 392.4 324.5 404.3C325.1 405.7 323.3 406.9 313.9 411.5C244.2 444.9 161.1 436.7 99.1 390.2C89.6 383.1 71.8 365.9 63.4 355.9C54 344.6 44.7 330.1 37.5 315.5C-8.9 221.4 22.2 108.2 110.5 50C149.3 24.4 198.1 12.4 244.1 17ZM421.2 305.4C431.4 307.4 438.7 310.3 447.2 315.9C457.3 322.5 466.8 333.1 471.9 343.3C478 355.7 479.5 362.3 479.4 377C479.3 387.7 478.9 390.7 476.7 397.5C472.9 409 467.7 417.3 458.5 426.5C449.3 435.7 441 440.9 429.5 444.7C422.7 446.9 419.7 447.3 409 447.4C394.3 447.5 387.7 446 375.3 439.9C360.8 432.7 346.6 417.1 341 402.2C333.3 381.8 335.1 358.3 345.7 340C350.4 332 363.5 318.7 371.3 314.1C386.5 305.2 404.1 302.1 421.2 305.4Z" fill="url(#paint0_linear)"/>
                <path d="M192.5 108C149.5 114.6 109.9 133.9 78.8 163.5C68.6 173.2 68.5 173 87.3 191.7C106.3 210.7 105.5 210.5 118 199.4C138.8 180.8 163.6 168.2 192.2 161.8C201.2 159.8 205.2 159.5 224 159.5C242.8 159.5 246.8 159.8 255.8 161.8C284.4 168.2 309 180.7 330 199.4C342.5 210.5 341.7 210.7 360.7 191.7C379.5 173 379.4 173.2 369.3 163.5C338 133.8 297.9 114.3 255.3 108C237.2 105.4 209.7 105.4 192.5 108ZM262.5 125.4C296.9 132.7 325.1 146.7 353.5 170.5L356.5 173L341.7 187.8L334.1 181.7C311.5 163.7 287 152.2 257.9 145.8C248.7 143.8 244.7 143.6 224 143.6C203.3 143.6 199.3 143.8 190 145.8C160.4 152.3 134.2 165 110.2 184.7L106.3 187.9L98.9 180.4L91.5 173L94.5 170.5C122 147.4 151 132.8 182.8 126C198.9 122.6 204.5 122.1 228 122.5C247.5 122.8 252.1 123.2 262.5 125.4Z" fill="url(#paint1_linear)"/>
                <path d="M208 180.5C207.2 180.7 203.1 181.4 199 182C177.1 185.6 152.7 197.3 133.6 213.5C126.3 219.7 123.7 223.8 124.5 227.3C124.9 228.6 131.8 236.3 140 244.5C158 262.5 158 262.5 168.2 253.8C177.2 246.1 186.8 240.7 198 236.8C207.2 233.6 208 233.5 224 233.5C240.4 233.5 240.6 233.5 250.7 237.1C262.6 241.3 269.5 245.2 279.3 253.4C290.2 262.5 289.9 262.6 308.2 244.2C322.4 230.1 323.4 228.8 323.4 225.4C323.4 222.1 322.7 221 317 215.8C299.4 199.8 276.3 187.9 252.4 182.5C246.1 181 212.1 179.5 208 180.5ZM245.1 197.5C263.4 200.9 281.6 208.8 296.1 219.5L304.1 225.4L289.2 240.3L282.9 235.7C270 226.6 255.2 220.5 239.8 218C229.1 216.3 208.8 217.2 198.6 219.9C188.7 222.5 173.7 229.6 165.3 235.6L158.8 240.2L144 225.6L146.8 223.3C161 211.4 180.9 202 200.5 198C212.1 195.6 233.6 195.4 245.1 197.5Z" fill="url(#paint2_linear)"/>
                <path d="M215.5 263.9C201.1 267.8 190.1 280.4 188.4 295.1C187.2 305.8 192.7 319.4 200.9 325.9C209.1 332.3 212.6 333.5 224 333.5C233.1 333.5 235.1 333.2 239 331.1C249.8 325.4 255.7 318.1 258.6 307.1C262.6 291.3 254.4 273.9 239.4 266.6C233.3 263.6 221.5 262.3 215.5 263.9ZM234.9 282.3C241.6 286.8 245.1 296 243.1 303.8C240.8 312.3 233 318 223.8 318C217.2 318 212.5 315.7 208.3 310.2C203.1 303.3 203 294.7 208.2 287C213.8 278.8 226.3 276.6 234.9 282.3Z" fill="url(#paint3_linear)"/>
                <path d="M370.5 338.5C368.9 340 368 342 368 344.1C368 346.9 369.8 349.2 382.2 361.7L396.4 376L382.2 390.3C369.8 402.8 368 405.1 368 407.9C368 412.2 371.8 416 376.1 416C378.9 416 381.2 414.2 393.7 401.8L408 387.6L422.3 401.8C434.8 414.2 437.1 416 439.9 416C444.2 416 448 412.2 448 407.9C448 405.1 446.2 402.8 433.8 390.3L419.6 376L433.8 361.7C446.2 349.2 448 346.9 448 344.1C448 339.8 444.2 336 439.9 336C437.1 336 434.8 337.8 422.3 350.2L408 364.4L393.7 350.2C381.2 337.8 378.9 336 376.1 336C374 336 372 336.9 370.5 338.5Z" fill="url(#paint4_linear)"/>
                <defs>
                <linearGradient id="paint0_linear" x1="248.026" y1="0.462891" x2="248" y2="326.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#AAB2FF"/>
                <stop offset="1" stop-color="#ECA0FF"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="248.026" y1="0.462891" x2="248" y2="326.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#AAB2FF"/>
                <stop offset="1" stop-color="#ECA0FF"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="248.026" y1="0.462891" x2="248" y2="326.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#AAB2FF"/>
                <stop offset="1" stop-color="#ECA0FF"/>
                </linearGradient>
                <linearGradient id="paint3_linear" x1="248.026" y1="0.462891" x2="248" y2="326.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#AAB2FF"/>
                <stop offset="1" stop-color="#ECA0FF"/>
                </linearGradient>
                <linearGradient id="paint4_linear" x1="248.026" y1="0.462891" x2="248" y2="326.5" gradientUnits="userSpaceOnUse">
                <stop stop-color="#AAB2FF"/>
                <stop offset="1" stop-color="#ECA0FF"/>
                </linearGradient>
                </defs>
                </svg>
                `
      const errorMessage = document.createElement("div")
      errorMessage.classList.add("error")
      errorMessage.innerHTML = `${svg}
                                <h3>Connection lost</h3> 
                                <h4> Please <a id="tryAgain" href="#home" onclick="location.reload(true)">try again</a>
                                or check your internet connection</h4>`
      cardsContainer.appendChild(errorMessage)
    }
  }
}

/**
 * Get the ratings and convert them into %
 * @param {Object} movie 
 * @returns {Number}
 */
const getRatings = (movie) => {
  
  const vote = movie.vote_average //get average vote

  const votePercent = (vote / 10) * 100 //transform vote into percentage

  return votePercent
}

/**
 * Link current page with Movie details page
 * @param {Integer} id 
 */
const linkMovieDetails = (id) => {
  sessionStorage.setItem("movie id", id); //save id to session storage

  window.open("/dist/info.html", "_blank"); //when click on a movie, link to movies details

  console.log("linked");
}

/**
 * Scroll back to top when the page has been refreshed
 */
const scrollBacktoTop = () => {
  if(history.scrollRestoration){ 

    history.scrollRestoration = 'manual'

  }else{
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }
}
scrollBacktoTop()

const fromLeftTitle = document.querySelector(".from-left")
const fromTopTitle = document.querySelector(".from-top")
const fromRightTitle = document.querySelector(".from-right")
const fromBottomTitle = document.querySelector(".from-bottom")

const animateHeroContainer = () => {
  
  let tl = anime.timeline({
    easing: 'easeInOutCirc',
    duration: 1000
  })

  tl
  .add({
    targets: '.from-left',
    left: 0
  })
  .add({
    targets: '.from-top',
    top: 0,
    easing: "easeInOutQuint"
  }, "-=700")
  .add({
    targets: '.from-right',
    right: 0,
  }, "-=700")
  .add({
    targets: '.from-bottom',
    bottom: 0,
  }, "-=700")
}

//Page logic
window.onload = () => {
  //cardsContainer.innerHTML = "" //reset cardsContainer
  getMovies()
  animateHeroContainer()
}









