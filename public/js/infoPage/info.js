const asideProductionsEl = document.querySelector(".movie__image")
const movieTitle = document.querySelector(".movie__title .title")
const movieRating = document.querySelector(".movie__title .rating")
const movieDetailsDescriptions = document.querySelectorAll(".movie__details p")

const loadingTime = 2000 //2sec

function addSkeletonLoader (img, title, rating, descriptions) {
  img.classList.add("skeleton-loader")
  title.classList.add("skeleton-loader")
  rating.classList.add("skeleton-loader")
  descriptions.forEach(description => {
    description.classList.add("skeleton-loader")
  })
}
addSkeletonLoader(asideProductionsEl, movieTitle, movieRating, movieDetailsDescriptions)


const APIKEY = "f569c35640a9131fdf30825f47683372"; //api key

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

      //if no belongs_to_collection or belongs_to_collection.backdrop_path available, display backdrop_path
      json.belongs_to_collection == null || json.belongs_to_collection.backdrop_path == null
      ? backgroundImg.src = `${backgroundImgURL}${json.backdrop_path}` 
      : backgroundImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
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
    console.log(json);

    const setAsideElement = () => {
      /**
       * Display video img
       */
      function setVideoImg () {
        let videoImg = document.createElement("img")

        videoImg.src = `${backgroundImgURL}${json.backdrop_path}`

        videoImg.src = `${backgroundImgURL}${json.backdrop_path}`

        //Remove skeleton-loader and append img to its parent
        if(videoImg.src !== null){
          asideProductionsEl.classList.remove("skeleton-loader")
          asideProductionsEl.appendChild(videoImg)
        }
       
        //if no backdrop_path available, display backdrop_path contained in belongs_to_collection
        if(json.backdrop_path == null) videoImg.src = `${backgroundImgURL}${json.belongs_to_collection.backdrop_path}`
      }
      setVideoImg()

      /**
       * Display productions imgs
       * @returns 
       */
      function displayProductions(){
        const logoImgUrl = "https://image.tmdb.org/t/p/original";
        const aside = document.querySelector("aside")
        console.log(json.production_companies)
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

          //if there is an img but is null then do not display all the production container
          if(productionCompanies.length === 1 && productionCompanies[i].logo_path == null){
            productionContainer.style.display = "none"
            return
          }

        }
        
      }
      displayProductions()
    }
    setAsideElement()

    const setMovieDetails = () => {
      //Display movie title and set year relased
      function setTitleAndYear(){
        const releaseDate = json.release_date.split("")
        releaseDate.splice(4, releaseDate.length)
        const year = releaseDate.join("")
    
        //set movie title
        movieTitle.innerHTML = `${json.title} (${year})`;
        console.log(movieTitle.innerText)

        //Remove skeleton-loader when content is loaded
        if(movieTitle.innerHTML !== ""){
          movieTitle.classList.remove("skeleton-loader")
          movieTitle.classList.add("active")
        }

        if(json.release_date === ""){
          document.querySelector(".title").innerHTML = `${json.title}`;
        }
      }
      setTitleAndYear()

      //Display subheading info
      function setSubheading(){
        //create runtime element
        const runtime = document.createElement("h6")
        runtime.classList.add("duration")

        //create divider element
        const divider = document.createElement("span")
        divider.classList.add("divider")

        //create production country/ies
        const prodCountries = document.createElement("h6")
        prodCountries.classList.add("production-country")

        //add childs elements to parent
        const subHeading = document.querySelector(".movie__details--subheading")
        subHeading.appendChild(runtime)
        subHeading.appendChild(divider)
        subHeading.appendChild(prodCountries)

        runtime.innerHTML = json.runtime + " min"

        prodCountries.innerText = json.production_countries[0].iso_3166_1
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
          movieRating.classList.remove("skeleton-loader")
          document.querySelector(".fa-star").classList.add("active")
          movieRating.classList.add("active")
        }
      }
      setRating()

      //get movie genres
      let genres = json.genres.map((genre) => genre.name);
      genres = spaceAfterComma(genres);

      //set movie genres
      document.querySelector(".movie__genres p").innerHTML = `${genres}`;

      //remove skeleton loader
      if(document.querySelector(".movie__genres p").innerHTML !== ""){
        document.querySelector(".movie__genres p").classList.remove("skeleton-loader")
      }

      //set movie description
      document.querySelector(".movie__description p").innerHTML = `${json.overview}`;

       //remove skeleton loader
       if(document.querySelector(".movie__description p").innerHTML !== ""){
        document.querySelector(".movie__description p").classList.remove("skeleton-loader")
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
      document.querySelector(".movie__director p").innerHTML = crew;

      //remove skeleton loader
      if(document.querySelector(".movie__director p").innerHTML !== ""){
        document.querySelector(".movie__director p").classList.remove("skeleton-loader")
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

//----- Movie trailer ------//
index = 0

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
  
    const videosArr = data.results //trailer videos array
    console.log(videosArr)
  
    //check if data fetched is empty or not
    //display error message if it is empty
    if(videosArr.length <= 0){
      document.querySelector(".coming-soon").classList.add("active")
      document.querySelector(".coming-soon h1").innerText = "COMING SOON"

      //close coming-soon div
      document.querySelector(".coming-soon .fa-times").onclick = () => {
        document.querySelector(".coming-soon").classList.remove("active")
      }

      return
    }

    let trailerKey = ""

    /**
     * Check each trailer video name 
     * @param {String} str 
     */
    function checkName (str) {
      const regex = /^.*(Final Trailer|Official Trailer|Trailer).*$/i;
      const found = str.match(regex)

      console.log(found)

      //if regex does not match (returns null) and the trailer type is not "Trailer" go check next result
      //otherwise just return trailer key
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

  //hide production element
  document.querySelector(".production").classList.add("active")
 
  //increase z-index of the iframe so that we can click the video player buttons
  document.querySelector(".movie__image").classList.add("active")

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
    document.querySelector(".production").classList.remove("active")
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


//------- Streaming/Buy services -------------//
let resultsArr = []
const strmPlatforms = document.querySelector(".platforms_rent") //rent div
const buyPlatforms = document.querySelector(".platforms_buy") //buy div
strmPlatforms.innerHTML = ""
buyPlatforms.innerHTML = ""

/**
 * Function to get the navigator language
 * @returns {String}
 */
function getLocale() {
  if (navigator.languages != undefined) {
    //console.log(navigator.language.slice(-2))
    // sessionStorage.setItem("locale", navigator.languages[0].slice(-2))
    return navigator.languages[0].slice(-2);
  }
  return navigator.language;
}
getLocale()

function getCountryCode(){
  return sessionStorage.getItem('country_code')
}
getCountryCode()

/**
 * Get streaming and buy services data and display them
 */
async function streamingServices(){
  //get movide id
  const movieID = sessionStorage.getItem("movie id")
  //streaming providers url
  const url = `https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${APIKEY}`

  //send request
  const req = await fetch(url)
  //get response
  const resp = await req.json()

  //results
  const results = resp.results
  console.log({results: results})

  //convert results object into an array of objects
  resultsArr = Object.entries(results)

  /**
   * Display the data fetched
   * @param {String} res 
   * @param {String} link 
   * @param {DOM element} platforms 
   */
  function displayStreamingProviders(res, link, platforms){

    //create li and a link elements
    const platform = document.createElement("li")
    const platformLink = document.createElement("a")

    //append children to parents
    platform.appendChild(platformLink)
    platforms.appendChild(platform)

    //logo img path
    const logoPath = res.logo_path

    //root path to the image files
    const logoRootPath = "https://image.tmdb.org/t/p/original";

    //create img element
    const img = document.createElement("img")
    //set img src
    img.src = `${logoRootPath}${logoPath}`
    //set img alt
    img.alt = `Now streaming on ${res.provider_name}`
    //append to a parent
    platformLink.appendChild(img)

    //link platformLink
    platformLink.href = `${link}`
  }
  
  resultsArr.forEach((result, index) => {
    const locale = result[0]

    if(getCountryCode() === locale || getLocale() === locale){
      
      if(getCountryCode()){
        getLocale = getCountryCode()
      }

      result.forEach((res, index) => {

        //check if key value is an object
        if(typeof(res) === "object"){

          const linkToProvider = res.link

          for(let i = 0; i <= result.length; i++){
            const objKey = Object.keys(result[index])[i]

            if(objKey == "flatrate" || objKey == "flatrate_and_buy" || objKey == "rent"){
              res[objKey].forEach(res => {
                displayStreamingProviders(res, linkToProvider, strmPlatforms)
              })
            }
          
            if(objKey == "buy"){
              res[objKey].forEach(res => {
                displayStreamingProviders(res, linkToProvider, buyPlatforms)
              })
            }
          }

          // if(sessionStorage.getItem('country_name') !== null && sessionStorage.getItem('country_code') !== result[0]){
          //   console.log(sessionStorage.getItem('country_code'), result[0])

      
          // }

          //if there is no data in the streaming ul element, display message
          if(strmPlatforms.children.length === 0){
            strmPlatforms.innerHTML = "<h3>Not available</h3>"
          }

          //if there is no data in the buy ul element, display message
          if(buyPlatforms.children.length === 0){
            buyPlatforms.innerHTML = "<h3>Not available</h3>"
          }
        
        }
      })
    }
  })
}

streamingServices()

/**
 * Populate dropdown element with country names
 */
async function populateDropDownEl() {

  const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${APIKEY}`

  let country_select = document.querySelector("#country");
  let countryLabel = document.querySelector(`.dropdown  label[for="country"]`)

  let optionEl = null

  try {
    const resp = await fetch(url)
    const json = await resp.json()
    console.log(json)

    json.forEach((country, index) => {
      //create option element
      optionEl = document.createElement("option")
      //setting attributes
      optionEl.value = country.iso_3166_1
      optionEl.innerText = country.native_name
      //append option el to its parent el
      country_select.appendChild(optionEl)

      //check if session storage is null
      if(sessionStorage.getItem('country_name') == null){

        //if locale value is same as one of the option elements value
        //set label innerHTML equal to the relative country name value
        if(getLocale() == optionEl.value){
          console.log("Ok")
          countryLabel.innerHTML = country.native_name
        }
       
      }else{
        countryLabel.innerHTML = sessionStorage.getItem('country_name')
      }

     
      //check if country selected has streaming or buy provider
      //if it doesn't then display a "Not available" message 
 
      // if(sessionStorage.getItem('country_code') !== resultsArr[index][0]){

      //   strmPlatforms.innerHTML = "<h3>Not available</h3>"
      //   buyPlatforms.innerHTML = "<h3>Not available</h3>"
      // }else{

      // }
     
   
    })

    country_select.addEventListener('change', function (event) {

      let selected_text = this.options[this.selectedIndex].text // selected option element value

      let selected_value = this.value
      let selected_country = selected_text
      console.log(selected_country)

      sessionStorage.setItem('country_code', selected_value)
      sessionStorage.setItem('country_name', selected_country)
     
      // console.log(selected_text)
      window.location.reload()
    });

    console.log(country_select.length, resultsArr.length)

  

  } catch (error) {
    console.log(error.message)
  }
}
populateDropDownEl()