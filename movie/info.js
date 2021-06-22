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
        const imgURL = "https://image.tmdb.org/t/p/original";
        //response
        const resp = await fetch(url);
        //convert response to json format
        const json = await resp.json();
        console.log(json);

        //set movie backdrop img
        const movieImg = document.querySelector(".movie__image img");
        movieImg.setAttribute("src", `${imgURL}${json.backdrop_path}`);

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
        console.log(json);

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
        document.querySelector(".movie__main-cast p").innerHTML = cast
        
    } catch (err) {
        console.log(err.message);
    }
}
getMovieCastDirectors();

//put some space after comma for each word
function spaceAfterComma(array) {
    array = array.toString();
    array = array.replace(/,/g, ", ");

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

  let iframe = document.createElement("iframe")

  document.querySelector(".movie__image").appendChild(iframe)

  iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&color=white&autohide=2&modestbranding=1&border=0&wmode=opaque&enablejsapi=1&showinfo=0&rel=0">`

  iframe.setAttribute("frameborder", "0");

  iframe.setAttribute("class", "youtube-iframe"); 
  
  iframe.style.zIndex = "1"
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
 * Bind all trailer functions to the play button click event
 */
playBtn.addEventListener("click", () => {
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
  document.querySelector(".movie__image").removeChild(iframe) //remove iframe element
  showPlayBtn()
}, {passive: true})

// playBtn.addEventListener("mouseover", () => {
//   let trailerTxt = document.querySelector(".trailer")
//   trailerTxt.style.bottom = "10px"
// })

// playBtn.addEventListener("mouseout", () => {
//   let trailerTxt = document.querySelector(".trailer")
//   trailerTxt.style.bottom = "-100px"
// })

