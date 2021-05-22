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
        crew = crew.replace(/,/g, "");
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