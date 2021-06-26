/**
 * Apply Infinite scrolling
 */
 let isScrolled = false //set scrolling to false
 let pageNum = 1

 const infiniteScroll = () => {
   
   const {scrollHeight, scrollTop, clientHeight} = document.documentElement
   
   if((scrollTop + clientHeight + 100) >= scrollHeight & !isScrolled){
 
      isScrolled = true //set isScrolled to true to continue scrolling after bottom reached 
      
      if(endPoint === "/discover/movie"){
        pageNum++;
        getMovies(pageNum)
      }

      if(endPoint === "/search/multi"){
        
        pageNum++; 
        getSearchedMovies(pageNum)
      }

      setTimeout(() => {
          isScrolled = false;
      }, 1000);
   }
}

//Bind the infiniteScroll function to the onscroll event
window.addEventListener("scroll", () => {
    infiniteScroll()
}) 