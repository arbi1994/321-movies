const asideProductionsEl = document.querySelector(".movie__image")
const movieTitle = document.querySelector(".movie__title")
const movieRating = document.querySelector(".movie__title .rating")
const movieDetailsDescriptions = document.querySelectorAll(".movie__details p")

//page title
let pageTitle = document.title

const loadingTime = 1000 //2sec

function addSkeletonLoader (img, title, descriptions) {
  img.classList.add("skeleton-loader")
  title.classList.add("skeleton-loader")

  descriptions.forEach(description => {
    description.classList.add("skeleton-loader")
  })
}
addSkeletonLoader(asideProductionsEl, movieTitle, movieDetailsDescriptions)


//const APIKEY = "f569c35640a9131fdf30825f47683372"; //api key
const APIKEY = config.API_KEY;

async function displayMovieBackdropImg () {
  const movieID = sessionStorage.getItem("movie id");
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;

  try{
    //root path to the image files
    const backgroundImgURL = "https://image.tmdb.org/t/p/original";
    //response
    const resp = await fetch(url);
    //convert response to json format
    const json = await resp.json();
    console.log(json);

    /**
      * Display background img
      */
    function backgroundImg () {
      let backgroundImg = document.querySelector(".movie-background img")

      if(json.backdrop_path){
        backgroundImg.src = `${backgroundImgURL}${json.backdrop_path}`
      }else{
        //if no belongs_to_collection or belongs_to_collection.backdrop_path available, display backdrop_path
        if(json.belongs_to_collection == null || json.belongs_to_collection.backdrop_path == null){
          backgroundImg.src = `${backgroundImgURL}${json.backdrop_path}`
        }else{
          backgroundImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
        }

        return
      }
    }
    backgroundImg()
  }catch(err){
    console.log(err.message);
  }
}
displayMovieBackdropImg()

async function getMovieDetails() {
  const movieID = sessionStorage.getItem("movie id");
  const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${APIKEY}&language=en-US`;

  try {
    //root path to the image files
    const backgroundImgURL = "https://image.tmdb.org/t/p/original";
    //response
    const resp = await fetch(url);
    //convert response to json format
    const json = await resp.json();
    //console.log(json);

    const setAsideElement = () => {
      /**
       * Display video imgf
       */
      function setVideoImg () {
        let videoImg = document.createElement("img")

        //Remove skeleton-loader and append img to its parent
        if(videoImg.src !== null){
          asideProductionsEl.classList.remove("skeleton-loader")
          asideProductionsEl.appendChild(videoImg)
        }
       
        //if no backdrop_path available, display backdrop_path contained in belongs_to_collection
        if(json.backdrop_path){
          videoImg.src = `${backgroundImgURL}${json.backdrop_path}`
        }else{
          //check if backdrop_path exists
          if(json.belongs_to_collection == null || json.belongs_to_collection.backdrop_path == null){
            asideProductionsEl.classList.remove("skeleton-loader")  
            asideProductionsEl.appendChild(videoImg)
          }else{
            videoImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
          }
          return
        }
      }
      setVideoImg()

      /**
       * Display productions imgs
       * @returns 
       */
      function displayProductions(){
        const logoImgUrl = "https://image.tmdb.org/t/p/original";
        const aside = document.querySelector("aside")
        //console.log(json.production_companies)
        const productionCompanies = json.production_companies

        const productionContainer = document.createElement("div")
        productionContainer.classList.add("production")
        aside.appendChild(productionContainer)
        
        let imgDiv = null
        let img = null

        //create img elements
        for(let i = 0; i < productionCompanies.length; i++){

          imgDiv = document.createElement("div")
          imgDiv.classList.add("production__img")
          productionContainer.appendChild(imgDiv)

          img = document.createElement("img") 
          img.src = `${logoImgUrl}${productionCompanies[i].logo_path}`
          imgDiv.appendChild(img)

          //if there is no img available do not display at all
          if(productionCompanies[i].logo_path == null){
            imgDiv.style.display = "none"
          }

          // //if there is an img but is null then do not display all the production container
          // if(productionCompanies.length === 1 && productionCompanies[i].logo_path == null){
          //   productionContainer.style.display = "none"
          //   return
          // }

        }
        
      }
      displayProductions()
    }
    setAsideElement()

    const setMovieDetails = () => {
      //Display movie title and set year relased
      function setTitleAndYear(){
        //title selector 
        const title = document.querySelector(".movie__title .title")
        const releaseDate = json.release_date.split("")
        releaseDate.splice(4, releaseDate.length)
        const year = releaseDate.join("")
    
        //set movie title
        title.innerHTML = `${json.title} (${year})`;
        //console.log(movieTitle.innerText)

        //Remove skeleton-loader when content is loaded
        if(movieTitle.innerHTML !== ""){
          movieTitle.classList.remove("skeleton-loader")
          title.classList.add("active")
        }

        if(json.release_date === ""){
          title.innerHTML = `${json.title}`;
        }

        //set page title 
        pageTitle = title.innerText

        console.log(pageTitle)
      }
      setTitleAndYear()

      //Display subheading info
      function setSubheading(){
        //create runtime element
        const runtime = document.createElement("p")
        runtime.classList.add("duration")

        //create divider element
        const divider = document.createElement("span")
        divider.classList.add("divider")

        //create production country/ies
        const prodCountries = document.createElement("p")
        prodCountries.classList.add("production-country")

        //add childs elements to parent
        const subHeading = document.querySelector(".movie__details--subheading")
        subHeading.appendChild(runtime)
        subHeading.appendChild(divider)
        subHeading.appendChild(prodCountries)

        //display runtime
        runtime.innerHTML = json.runtime + " min"

        if(json.runtime == null){
          runtime.innerHTML = "N/A min"
        }

        //check if production_countries array is empty
        if(json.production_countries.length <= 0){
          prodCountries.innerHTML = "N/A"
          return
        } 

        const productions = json.production_countries[0].iso_3166_1

        prodCountries.innerHTML = productions
      }
      setSubheading()

      //Display rating
      function setRating(){
        movieRating.innerHTML += `${json.vote_average}<h5>/10</h5>`

        if(json.vote_average === 0){
          movieRating.innerHTML = ""
        }

        //remove skeleton-loader
        if(movieRating.innerHTML !== ""){
          //movieRating.classList.remove("skeleton-loader")
          document.querySelector(".fa-star").classList.add("active")
          movieRating.classList.add("active")
        }
      }
      setRating()

      //get movie genres
      let genres = json.genres.map((genre) => genre.name);
      genres = spaceAfterComma(genres);
      console.log(genres)

      //set movie genres
      document.querySelector(".movie__genres p").innerHTML = `${genres}`;

      //remove skeleton loader
      if(document.querySelector(".movie__genres p").innerHTML !== ""){
        document.querySelector(".movie__genres p").classList.remove("skeleton-loader")
      }

      //if there is no data in genres array display message
      if(genres.length === 0){
        document.querySelector(".movie__genres p").innerHTML = "NO DATA"
        document.querySelector(".movie__genres p").classList.remove("skeleton-loader")
      }

      //set movie description
      document.querySelector(".movie__description p").innerHTML = `${json.overview}`;

      //remove skeleton loader
      if(document.querySelector(".movie__description p").innerHTML !== ""){
        document.querySelector(".movie__description p").classList.remove("skeleton-loader")
      }

      if(json.overview === ""){
        document.querySelector(".movie__description p").classList.remove("skeleton-loader")
        document.querySelector(".movie__description p").innerHTML = "NO DATA"
      }
    }
    setMovieDetails()

  } catch (err) {
    console.log(err.message);
  }
}
setTimeout(function(){getMovieDetails()}, loadingTime)

async function getMovieCastDirectors() {
  const movieID = sessionStorage.getItem("movie id");
  const url = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${APIKEY}&language=en-US`;

  try {
      //response
      const resp = await fetch(url);
      //convert response to json format
      const json = await resp.json();
      console.log(json)

      //set director/s
      let crew = json.crew.map(crew => {
        if(crew.job == "Director"){
          return crew.name
        }
      });

      let directors = crew.filter(crew => crew !== undefined).toString()
      directors = directors.replace(/,/g, ", ")  //replace comma with comma and space

      //if cast elements are 1 or less than 1, remove more button
      if(json.cast.length <= 1){
        document.querySelector("#more").style.display = "none"
      }

      //display
      document.querySelector(".movie__director p").innerHTML = directors;

      //remove skeleton loader
      if(document.querySelector(".movie__director p").innerHTML !== ""){
        document.querySelector(".movie__director p").classList.remove("skeleton-loader")
      }

      //check crew array length
      if(json.crew.length === 0 || crew === ""){
        document.querySelector(".movie__director p").classList.remove("skeleton-loader")
        document.querySelector(".movie__director p").innerHTML = "NO DATA"
      }
  
      //set cast
      let cast = json.cast.map(cast => cast.name)
      cast = spaceAfterComma(cast)

      //get only the first five actors
      let castArr = cast.split(", ")
      let moreCast = castArr.splice(5, cast.length)
  
      //display first five actors
      let castText = document.querySelector(".movie__main-cast p")
      castText.innerText = spaceAfterComma(castArr)

      //remove skeleton loader
      if(document.querySelector(".movie__main-cast p").innerHTML !== ""){
        document.querySelector(".movie__main-cast p").classList.remove("skeleton-loader")
      }

      //check if cast array is empty
      if(json.cast.length === 0){
        document.querySelector(".movie__main-cast p").classList.remove("skeleton-loader")
        document.querySelector(".movie__main-cast p").innerText = "NO DATA"
      }
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
setTimeout(function(){getMovieCastDirectors()}, loadingTime);

//put some space after comma for each word
function spaceAfterComma(array) {
  array = array.toString();
  array = array.replace(/,/gm, ", ");

  return array;
}

