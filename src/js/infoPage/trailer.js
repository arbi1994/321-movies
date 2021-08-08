//----- Movie trailer ------//
const playBtnChildren = document.querySelector(".movie__trailer") //target all movie__traile children
playBtnChildren.style.display = "none"
const playBtn = document.querySelector(".fa-play-circle") //target play button
const closeBtn = document.querySelector(".fa-times-circle") //target close button
closeBtn.style.display = "none" //set close button display to none as default

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
            document.querySelector(".coming-soon h1").innerText = ""
    }

        return
    }

    let trailerKey = ""

    /**
     * Check each trailer video name 
     * @param {String} str 
     */
    function checkName (str) {
        const regex = /^.*(Official|Trailer).*$/gi;
        const test = regex.test(str)

        return test
    }

    /**
     * Check if video.type and video.name is a Trailer
     */
    function findTrailer () {

        for(const video of videosArr){

            //check video type and video name 
            if(checkName(video.name) === true && video.type === "Trailer"){
                trailerKey = video.key

                break
            }
        }
    }

    if(videosArr.length === 1){
        trailerKey = videosArr[0].key
    }else{
        findTrailer()
    }
    
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
        document.querySelector(".movie__image iframe").src = `https://www.youtube.com/embed/${trailerKey}?modestbranding=1&autoplay=1&mute=0&controls=1&loop=1&rel=0&showinfo=0>`
    }, 1000)

    return trailerKey
}

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
setTimeout(function(){showPlayBtn()}, loadingTime)

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