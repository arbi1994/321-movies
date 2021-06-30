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

    //set background img

    function backgroundImg () {
      let backgroundImg = document.querySelector(".movie-background img")

      json.belongs_to_collection == null || undefined ?
      backgroundImg.src = `${backgroundImgURL}${json.backdrop_path}` :
      backgroundImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
    }
    backgroundImg()

    function videoImg () {
      let videoImg = document.querySelector(".movie__image img");
      videoImg.src = `${backgroundImgURL}${json.backdrop_path}`
    }
    videoImg()
    

    //json.backdrop_path == null ? backgroundImg.src = `${imgURL}${json.belongs_to_collection.backdrop_path}` : backgroundImg.src = `${imgURL}${json.backdrop_path}`



    //set movie title
    document.querySelector(".movie__title").innerHTML = `${json.title}`;

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

/**
 * Get movies trailer data
 * @returns {string} The trailer key of the youtube video
 */
const getMovieTrailer = async () => {
  //movie id
  const movieID = sessionStorage.getItem("movie id");
  //url
  const url = `https://api.themoviedb.org/3/movie/${movieID}/videos?api_key=${APIKEY}&language=en-US`
  
  const resp = await fetch(url)
  
  const data = await resp.json()

  if(data.results.length === 0){
    console.log("No data available")
  }

  const videosArr = data.results

  let trailer = videosArr[0]
  
  let trailerKey = trailer.key

  return trailerKey
}

/**
 * Play movie trailer by creating an iframe element and
 * append it to the movie__image element
 */
const playMovieTrailer = async () => {
  let trailerKey = await getMovieTrailer()
  console.log(trailerKey)

  document.querySelector(".movie__image iframe").src = `https://www.youtube.com/embed/${trailerKey}?modestbranding=0&autoplay=1&mute=0&controls=1&loop=1&rel=0&showinfo=0>`
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

const cinemaEffectOn = () => {
  //set opacity of movie__details to 0
  document.querySelector(".movie__details").style.opacity = "0"
  //translate movie details to the center
  document.querySelector(".movie__image").classList.add("active")
  //set box shadow inset to the body to make background darker
  document.body.style.transition = "1s ease"
  document.body.style.boxShadow = "inset 0px 0px 300px 100px rgb(0, 0, 0, 1)"
}

const cinemaEffectOff = () => {
  //set opacity of movie__details to 1
  document.querySelector(".movie__details").style.opacity = "1"
  //translate movie details back to its original position
  document.querySelector(".movie__image").classList.remove("active")
  //remove box shadow
  document.body.style.boxShadow = "none"
}

/**
 * Bind all trailer functions to the play button click event
 */
playBtn.addEventListener("click", (e) => {
  cinemaEffectOn()
  getMovieTrailer()
  playMovieTrailer()
  hidePlayBtn()
}, {passive: true})

/**
 * Bind showPlayBtn function to the close button click event
 * and remove iframe element
 */
closeBtn.addEventListener("click", () => {
  let iframe = document.querySelector(".movie__image iframe") //select iframe element
  //document.querySelector(".movie__image").removeChild(iframe) //remove iframe element
  iframe.src = ""
  showPlayBtn()
  cinemaEffectOff()
}, {passive: true})


