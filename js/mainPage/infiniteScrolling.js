/**
 * Apply Infinite scrolling
 */
 let isScrolled = false //set scrolling to false


 const infiniteScroll = () => {
  
  const {scrollHeight, scrollTop, clientHeight} = document.documentElement
  
  if((scrollTop + clientHeight + 100) >= scrollHeight & !isScrolled){

    isScrolled = true //set isScrolled to true to continue scrolling after bottom reached 

    //if input value is null and pageNum value has reached totalPages value, return
    if(pageNum === totalPages || sessionStorage.getItem("Movie title") === "" || totalResults === 0){
      return
    }
    
    if(endPoint === "/discover/movie"){
      pageNum++;
      getMovies(pageNum)
    }

    if(endPoint === "/search/multi"){
      pageNum++; 
      getSearchedMovies(pageNum)
    }
  }

  setTimeout(() => {
      isScrolled = false;
  }, 1000);
}

//Bind the infiniteScroll function to the onscroll event
window.addEventListener("scroll", () => {
    infiniteScroll()
}) 