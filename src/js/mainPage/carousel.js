let imgsArr = [] //carousel images
const carousel = document.querySelector(".hero__carousel") //carousel selector
let imgs = carousel.childNodes
index = 0
let timer = 5000

/**
 * Get latest 3 movies on cinema
 */
const getCarouselData = async () => {
  
  const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKEY}` //url
  const resp = await fetch(url) //fetch url
  const json = await resp.json() //result
  const dataArr = Object.values(json)[1]
  //console.log(dataArr)

  //root path to the image files
  const imgURL = "/t/p/original"

  //loop through and get the first 3 data
  dataArr.forEach((data, index) => {
    if(index < 3){
      const imageKitURL = "https://ik.imagekit.io/iowcmbydcj3"
      const img = `${imageKitURL}${imgURL}${data.backdrop_path}`
      const title = `${data.original_title}`

      const imgEl = document.createElement("img")
      createImgElements(imgEl, img, title)

      imgsArr.push(img)
    }

    changeImg()
  })
}

/**
 * Append img elementes to the parent and populate each one of them
 * @param {DOM element} el 
 * @param {String} img 
 * @param {String} title 
 */
function createImgElements(el, img, title){ 
  carousel.appendChild(el)
  el.src = img
  el.alt = title
}

/**
 * Carousel logic
 */
function changeImg(){

  /**
   * Fadein effect
   * @param {DOM element} el 
   */
  function fadeIn(el){
    el.className = "fadeIn"
  }

  /**
   * Replace fadein class with and empty class
   * @param {DOM element} el 
   */
  function fadeOut(el){
    el.className = ""
  }

  fadeOut(imgs[index])

  index++

  if(index === imgs.length){
    index = 0
  }

  fadeIn(imgs[index])

  setTimeout("changeImg()", timer)
}

window.onload = () => {getCarouselData()}

