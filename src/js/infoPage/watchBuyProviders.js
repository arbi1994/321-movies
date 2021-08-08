//------- Watch/Buy services -------------//

let resultsArr = []
const providersContainer = document.querySelector(".movie__providers")
const rentPlatforms = document.querySelector(".platforms_rent") //rent div
const buyPlatforms = document.querySelector(".platforms_buy") //buy div
rentPlatforms.innerHTML = ""
buyPlatforms.innerHTML = ""
let countries = []
let countriesIso = []
/**
 * Function to get the navigator language
 * @returns {String}
 */
function getLocale() {
  if (navigator.languages !== undefined) {
    console.log(navigator.languages[0].slice(-2))
    return navigator.languages[0].slice(-2);
  }
  // return navigator.language;
}
getLocale()

function getCountryCode(){
  return localStorage.getItem('country_code')
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
  //console.log(results)

  //convert results object into an array of objects
  countriesIso = Object.entries(results).map(res => res[0])
  console.log(countriesIso)

  //if there is no country available with any streaming and/or service provider,
  //do not display anything
  if(countriesIso.length === 0) {
    document.querySelector(".header__subheader").style.display = "none"
    document.querySelector(".movie__streaming").style.display = "none"
    document.querySelector(".header__title h3").innerHTML += "<h4>(not available)</h4>"
    return
  }

  resultsArr = Object.entries(results)
  console.log(resultsArr)

  //check if resultsArr is empty
  if(resultsArr.length === 0){
    rentPlatforms.innerHTML = "<h3>Not available</h3>"
    buyPlatforms.innerHTML = "<h3>Not available</h3>"
  }

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
    console.log(locale)

    if(getCountryCode() === locale){

      result.forEach((res, index) => {

        //check if key value is an object
        if(typeof(res) === "object"){

          const linkToProvider = res.link

          for(let i = 0; i <= result.length; i++){
            const objKey = Object.keys(result[index])[i]

            if(objKey == "flatrate" || objKey == "flatrate_and_buy" || objKey == "rent"){
              res[objKey].forEach(res => {
                displayStreamingProviders(res, linkToProvider, rentPlatforms)
              })
            }
          
            if(objKey == "buy"){
              res[objKey].forEach(res => {
                displayStreamingProviders(res, linkToProvider, buyPlatforms)
              })
            }
          }

          //if there is no data in the streaming ul element, display message
          if(rentPlatforms.children.length === 0){
            rentPlatforms.innerHTML = "<p>Not available</p>"
          }

          //if there is no data in the buy ul element, display message
          if(buyPlatforms.children.length === 0){
            buyPlatforms.innerHTML = "<p>Not available</p>"
          }
        
        }
      })
    }

  })
}

streamingServices()

/**
 * Get locations data
 */
async function getLocationsData() {

  const url = `https://api.themoviedb.org/3/configuration/countries?api_key=${APIKEY}`

  try {
    const resp = await fetch(url)
    const json = await resp.json()

    return json

  } catch (error) {
    console.log(error.message)
  }
}
getLocationsData()

/**
 * Populate dropdown element with country names
 */
async function populateDropDown(){
  let country_select = document.querySelector("#country");
  let countryLabel = document.querySelector(`.dropdown  label[for="country"]`)
  countryLabel.innerHTML = "Select country"

  let optionEl = null

  try {
    const locationJson = await getLocationsData()

    countriesIso.forEach((iso, index) => {
      //create option element
      optionEl = document.createElement("option")

      //append option el to its parent el
      country_select.appendChild(optionEl)

      for(let {english_name: countryName, iso_3166_1: countryCode} of locationJson){

        if(countryCode === iso){
          optionEl.value = countryCode
          optionEl.innerText = countryName
        }

      }

      function dropDownValidation(){
        //check if we have anything in sessionStorage
        if(localStorage.getItem('country_name') !== null && localStorage.getItem('country_code') === iso){
          countryLabel.innerHTML = localStorage.getItem('country_name')
          providersContainer.style.display = "block"
        }

        //if there is no data in the streaming ul element, display message
        if(rentPlatforms.children.length === 0){
          countryLabel.innerHTML = localStorage.getItem('country_name')
          rentPlatforms.innerHTML = "<p>Not available</p>"
        }

        //if there is no data in the buy ul element, display message
        if(buyPlatforms.children.length === 0){
          countryLabel.innerHTML = localStorage.getItem('country_name')
          buyPlatforms.innerHTML = "<p>Not available</p>"
        }

        //check if we localStorage is empty
        if(localStorage.getItem('country_name') === null){
          countryLabel.innerHTML = "Select country"
          providersContainer.style.display = "none"
        }
      }

      dropDownValidation()
    })

    country_select.addEventListener('change', function (event) {

      let selected_text = this.options[this.selectedIndex].text // selected option element value

      let selected_value = this.value
      let selected_country = selected_text
      console.log(selected_country)

      localStorage.setItem('country_code', selected_value)
      localStorage.setItem('country_name', selected_country)
     
      // console.log(selected_text)
      window.location.reload()
    });
  }catch(error){
    console.log(error.message)
  }
}

populateDropDown()
