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

const APIKEY = "f569c35640a9131fdf30825f47683372"; //api key

async function getMovieDetails() {
  const movieID = sessionStorage.getItem("movie id");
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;

  try {
    //root path to the image files
    const backgroundImgURL = "https://image.tmdb.org/t/p/original";
    //const imgURL = "https://image.tmdb.org/t/p/original";
    //response
    const resp = await fetch(url);
    //convert response to json format
    const json = await resp.json();
    console.log(json);
    //console.log(json.belongs_to_collection.backdrop_path)

    /**
     * Display background img
     */
    function backgroundImg () {
      let backgroundImg = document.querySelector(".movie-background img")

      //if no belongs_to_collection or belongs_to_collection.backdrop_path available, display backdrop_path
      json.belongs_to_collection == null || json.belongs_to_collection.backdrop_path == null
      ? backgroundImg.src = `${backgroundImgURL}${json.backdrop_path}` 
      : backgroundImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
    }
    backgroundImg()

    /**
     * Display video img
     */
    function videoImg () {
      let videoImg = document.querySelector(".movie__image img");
      videoImg.src = `${backgroundImgURL}${json.backdrop_path}`

      //if no backdrop_path available, display backdrop_path contained in belongs_to_collection
      if(json.backdrop_path == null) videoImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
    }
    videoImg()

    //Display movie title and set year relased
    function setTitleAndYear(){
      const releaseDate = json.release_date.split("")
      releaseDate.splice(4, releaseDate.length)
      const year = releaseDate.join("")
  
      //set movie title
      document.querySelector(".title").innerHTML = `${json.title} (${year})`;
      
      if(json.release_date === ""){
        document.querySelector(".title").innerHTML = `${json.title}`;
      }
    }
    setTitleAndYear()

    //Display rating
    function setRating(){
      console.log(json.vote_average)
      document.querySelector(".rating").innerHTML += `${json.vote_average}<h5>/10</h5>`

      if(json.vote_average === 0){
        document.querySelector(".rating").innerHTML = ""
      }
    }
    setRating()

    //get movie genres
    let genres = json.genres.map((genre) => genre.name);
    genres = spaceAfterComma(genres);
    //set movie genres
    document.querySelector(".movie__genres p").innerHTML = `${genres}`;

    //set movie description
    document.querySelector(
    ".movie__description p"
    ).innerHTML = `${json.overview}`;

  } catch (err) {
    console.log(err.message);
  }
}
getMovieDetails();

async function getMovieCastDirectors() {
  const movieID = sessionStorage.getItem("movie id");
  const url = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${APIKEY}&language=en-US`;

  try {
      //response
      const resp = await fetch(url);
      //convert response to json format
      const json = await resp.json();

      //if cast elements are 1 or less than 1, remove more button
      if(json.cast.length <= 1){
        document.querySelector("#more").style.display = "none"
      }

      //set director/s
      let crew = json.crew.map(crew => {
        if(crew.job == "Director"){
            return crew.name
        }
      });

      //remove all commas
      crew = crew.toString();
      crew = crew.replace(/,/g, " ");

      //display
      document.querySelector(
      ".movie__director p"
      ).innerHTML = crew;
  
      //set cast
      let cast = json.cast.map(cast => cast.name)
      cast = spaceAfterComma(cast)

      //get only the first five actors
      let castArr = cast.split(", ")
      let moreCast = castArr.splice(5, cast.length)
  
      //display first five actors
      let castText = document.querySelector(".movie__main-cast p")
      castText.innerText = spaceAfterComma(castArr)

      let moreBtn = document.querySelector("#more") //target more button

      //bind more button to click event
      moreBtn.addEventListener("click", (e) => {

        //add the rest of the cast
        castText.innerText += ", " + spaceAfterComma(moreCast)

        //if the button id is "less", replace actual id with "more",
        //change its text, and display only the first five actors
        if(e.target.id === "less"){

          moreBtn.id = "more"
          moreBtn.innerText = "More" 
          castText.innerText = spaceAfterComma(castArr)

        }else{

          moreBtn.id = "less"
          moreBtn.innerText = "Less" 
        }
      })        
    } catch (err) {
      console.log(err.message);
    }
}
getMovieCastDirectors();

//put some space after comma for each word
function spaceAfterComma(array) {
  array = array.toString();
  array = array.replace(/,/gm, ", ");

  return array;
}

//----- Movie trailer ------//
let index = 0

/**
 * Get movies trailer data
 * @returns {string} The trailer key of the youtube video
 */
const getMovieTrailer = async () => {

  //movie id
  const movieID = sessionStorage.getItem("movie id");

  //url
  const url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${APIKEY}&language=en-US`
  
  try {
    const resp = await fetch(url)
    const data = await resp.json()
  
    const videosArr = data.results
    console.log(videosArr)
  
    //check if data fetched is empty or not
    //display error message if it is empty
    if(videosArr.length <= 0){
      console.log("No data available")
      document.querySelector(".coming-soon").classList.add("active")
      return
    }

    let trailerKey = ""

    function checkName (str) {
      const regex = /^.*(Final Trailer|Official Trailer|Trailer).*$/i;
      const found = str.match(regex)

      console.log(found)

      if(found === null && videosArr[index].type !== "Trailer"){
        index++
      }else{
        trailerKey = videosArr[index].key
      }
    }
  
    //check if video type and video name is a Trailer
    videosArr.forEach((video, index) => {
      checkName(video.name)
    })

    if(videosArr.length === 1){
      trailerKey = videosArr[0].key
    }
    
    console.log(trailerKey)
    return trailerKey

  } catch (error) {
    console.log(error.message)
  }
}

/**
 * Play movie trailer by creating an iframe element and
 * append it to the movie__image element
 */
const playMovieTrailer = async () => {
  let trailerKey = await getMovieTrailer()

  if(trailerKey === undefined) return

  setTimeout(() => {
    document.querySelector(".movie__image iframe").src = `https://www.youtube.com/embed/${trailerKey}?modestbranding=0&autoplay=1&mute=0&controls=1&loop=1&rel=0&showinfo=0>`
  }, 1000)

  return trailerKey
}

const playBtnChildren = document.querySelector(".movie__trailer") //target all movie__traile children
const playBtn = document.querySelector(".fa-play-circle") //target play button
const closeBtn = document.querySelector(".fa-times-circle") //target close button
closeBtn.style.display = "none" //set close button display to none as default

/**
 * Hide play button and show close button
 * by changing their display attribute
 */
const hidePlayBtn = () => {
  playBtnChildren.style.display = "none" //remove play button
  closeBtn.style.display = "block" //show close button
}

/**
 * Show play button and hide close button
 * by changing their display attribute
 */
const showPlayBtn = () => {
  playBtnChildren.style.display = "block" //show play button
  closeBtn.style.display = "none" //remove close button
}

/**
 * Added some box shadow inset to make background all around a bit darker
 * so that it gives that feel of cinema mode
 */
const cinemaEffectOn = () => {
  //set opacity of movie__details to 0
  document.querySelector(".movie__details").style.opacity = "0"
  //translate aside to the center
  document.querySelector("aside").classList.add("active")
  //increase z-index of the iframe so that we can click the video player buttons
  document.querySelector(".movie__image").classList.add("active")
  //hide production element
  document.querySelector(".production ").classList.add("active")
  //set box shadow inset to the background backdrop img to make background darker
  document.querySelector(".movie-background").classList.add("active")
}

/**
 * Remove the box shadow inset previously created 
 */
const cinemaEffectOff = () => {
  //translate aside back to its original position
  document.querySelector("aside").classList.remove("active")
  //back to default style
  document.querySelector(".movie__image").classList.remove("active")

  setTimeout(function(){
    //set opacity of movie__details to 1
    document.querySelector(".movie__details").style.opacity = "1"
    //show production 
    document.querySelector(".production ").classList.remove("active")
  }, 500)

  //remove box shadow
  document.querySelector(".movie-background").classList.remove("active")
}

/**
 * Remove iframe element
 * @param {DOM element} iframe 
 */
function removeIframe(iframe){
  const iframeContainer = document.querySelector(".movie__image")
  iframeContainer.removeChild(iframe)
}

/**
 * Create iframe element
 */
function createIframe(){
  const iframeContainer = document.querySelector(".movie__image")

  const iframe = document.createElement("iframe")

  //set all the attributes needed
  iframe.setAttribute("frameborder", "0")
  iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture")
  iframe.setAttribute("allowfullscreen", "")

  iframeContainer.appendChild(iframe)
}

/**
 * Bind all trailer functions to the play button click event
 */
playBtn.addEventListener("click", async(e) => {

  let iframe = document.querySelector(".movie__image iframe") //iframe selector

  if(await playMovieTrailer() === undefined) return //if trailer key is undefined just return

  //scroll back to top if pageYOffset value is greater than 0
  if(window.pageYOffset > 0){
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });
  }

  playMovieTrailer()

  hidePlayBtn()

  cinemaEffectOn()

  if(iframe == undefined) createIframe() //if the iframe has been removed, recreate a new one
})

/**
 * Bind showPlayBtn function to the close button click event
 * and remove iframe element
 */
closeBtn.addEventListener("click", (e) => {

  let iframe = document.querySelector(".movie__image iframe") //select iframe element

  iframe.src = ""

  showPlayBtn()

  cinemaEffectOff()

  removeIframe(iframe) //remove iframe when closing video
})


