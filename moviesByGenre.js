/**
 * Get all movies genres
 * @returns {Array of Objects}
 */
async function getMoviesGenres(){
    //api url
    const APIURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKEY}&language=en-US`
    //response
    try{
    const resp = await fetch(APIURL)
    //convert response to json format
    const json = await resp.json()
    //convert json into an array of objects
    const genres = Object.values(json)[0]

    return genres
    }catch(err){
        console.log(err.message)
    }
}
  
/**
 * Assign each genre id to each genre_btn
 * @param {NodeList object} btn 
 */
async function assignGenreId(btn){
    const genres = await getMoviesGenres()

    genres.forEach(genre => {
        if(genre.name == btn.id){
            btn.id = genre.id
        }  
    })
}

/**
 * Assign each button id to the genre variable and load data accordingly on button click  
 */
const loadMoviesByGenre = () => {

    genreBtns.forEach(btn => {
        assignGenreId(btn)
    
        btn.addEventListener('click', () => {
            cardsContainer.innerHTML = "" //empty the cards container before loading new data
            pageNum = 1 //reset page number to 1
            
            genre = btn.id 
            console.log(genre)

            let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNum}&with_genres=${genre}`;
            
            //call function to get and populate data
            getMovies(pageNum, url)
            console.log(url)
            console.log(pageNum)
        })
    })
}

loadMoviesByGenre()