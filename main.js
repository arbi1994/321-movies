const cardsContainer = document.querySelector(".cards__container") //get cards container where we are going to display our cards
const genreBtns = document.querySelectorAll(".genre_btn") //select all buttons
const APIKEY = "f569c35640a9131fdf30825f47683372" //api key
let movies = [] //empty movies array where we are going to store our movies data
let pageNum = 1; //set page number to 1
let genre = "" 
let endPoint = ""
totalPages = 0

/**
 * Get movies data
 * @param {Number} page 
 * @param {String} url 
 */
const getMovies = (page, url) => {
  //path
  endPoint = "/discover/movie"
  // url
  url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNum}&with_genres=${genre}`;
  console.log(url)

  displayMovies(url)
}

/**
 * Display movies data
 * @param {String} url 
 */
const displayMovies = async (url) => {
  try{
    //root path to the image files
    const imageKitURL = "https://ik.imagekit.io/iowcmbydcj3"
    const imgURL = "/t/p/w500"
    const imageKitTransformation = "?tr=bl-30"
    //response
    const resp = await fetch(url)
    //convert response to json format
    const json = await resp.json()

    totalPages = json.total_pages //total number of pages

    //convert json object into array of objects
    movies = Object.values(json)[1]
  

    movies.forEach((movie, index) => {
      
      movies.push(movie)
      //console.log(movies)
      
      //get movies titles
      const movieTitle = movie.original_title
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
  
      card.innerHTML += `
                        <img src="${imageURL}${posterPath}${imageKitTransformation}" data-lazy="${imageURL}${posterPath}" alt="">
  
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
      let imageOptions = {
        threshold: 1,
        rootMargin: "0px 0px -10px 0px"
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

  window.open("movie/info.html", "_blank"); //when click on a movie, link to movies details

  console.log("linked");
}

/**
 * Scroll back to top when the page has been refreshed
 */
const scrollBacktoTop = () => {
  if(history.scrollRestoration){ 
    history.scrollRestoration = 'manual';

  }else{
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }
}
scrollBacktoTop()

//Page logic
window.onload = () => {
  getMovies()
  genresSlider()
  changeImg()
}




