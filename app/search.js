/**
 * Show and hide search window and navbar search input
 */
(function(){
    //const searchIcon = document.querySelector(".hero__search")//search icon
    const searchWindow = document.querySelector(".search__window")
  
    //open up search window
    document.querySelector(".navbar__button").addEventListener("click", () => {
      disableScroll(searchWindow)
      document.querySelector("#home").style.boxShadow = "inset 0px 0px 500px 200px rgb(0, 0, 0, 0.5)"
    })
  
      //close down search window
    document.querySelector(".fa-times").addEventListener("click", () => {
      enableScroll(searchWindow)
      document.querySelector("#home").style.boxShadow = "none"
    })
  
    //open up input box
    document.querySelector(".navbar__input").onclick = (e) => {
      document.querySelector(".navbar__input").classList.add("slide-left")
      document.querySelector(".fa-play").style.opacity = "1"
    }

    //close input box by clicking anywhere in the body document
    document.querySelector("body").onclick = (e) => {
      if(!e.target.classList.contains("navbar__input")){
        document.querySelector(".navbar__input").classList.remove("slide-left")
        document.querySelector(".fa-play").style.opacity = "1"
      }
    }

    //show underline when hover over
    document.querySelector(".navbar__input").addEventListener("mouseover", () => {
      document.querySelector(".underline").style.background = "#f4f0fa"
    }) 

    //on mouse out hide underline
    document.querySelector(".navbar__input").addEventListener("mouseout", () => {
      document.querySelector(".underline").style.background = "#f4f0fa00"
    })
})()

/**
 * Get input value
 * @returns {String}
 */
 const getSearchInput = () => {
  const searchInput = document.querySelector(".search__bar .input").value
  const navInput = document.querySelector(".navbar__input").value

  return searchInput ? sessionStorage.setItem("Movie title", searchInput) : sessionStorage.setItem("Movie title", navInput)
}
  
/**
 * Get searched Movies data and Display it
 */
const getSearchedMovies = (page) => {
    
  const input = sessionStorage.getItem("Movie title");

  endPoint = "/search/multi" //path

  if(page === undefined){
    page = 1
  }

  if(page === totalPages){
    return
  }
  
  let url = `https://api.themoviedb.org/3${endPoint}?api_key=${APIKEY}&query=${input}&page=${page}` //search url

  displayMovies(url) //display movies
}

/**
 * Function to display error message when a user do not search 
 * for the right movie or just press enter with an empty input box
 * @param {DOM element} input 
 * @param {Array} arr 
 */
// function errorMessage(input, arr){

//   const error = document.createElement("div")

//   error.classList.add("input_error")

//   cardsContainer.appendChild(error)

//   const svg = `<svg viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <g id="error">
//                     <g id="Paper">
//                         <path id="Vector" d="M205.291 240.069H49.0628C43.7649 240.063 38.6857 238.105 34.9395 234.623C31.1933 231.142 29.0861 226.421 29.0801 221.498V50.9788C29.0861 46.055 31.1933 41.3346 34.9395 37.853C38.6857 34.3714 43.7649 32.413 49.0628 32.4074H194.407L225.273 55.2721V221.498C225.267 226.421 223.16 231.142 219.414 234.623C215.668 238.105 210.589 240.063 205.291 240.069V240.069Z" fill="#E6E6E6"/>
//                         <path id="Vector_2" d="M49.0627 37.7537C45.29 37.7577 41.673 39.1523 39.0052 41.6316C36.3375 44.1109 34.8369 47.4725 34.8326 50.9788V221.498C34.8369 225.004 36.3375 228.365 39.0052 230.845C41.673 233.324 45.29 234.719 49.0627 234.723H205.291C209.064 234.719 212.681 233.324 215.348 230.845C218.016 228.365 219.517 225.004 219.521 221.498V57.8477L192.395 37.7537H49.0627Z" fill="white"/>
//                         <path id="Vector_3" d="M174.904 87.336H103.776C102.893 87.336 102.047 87.0102 101.423 86.4302C100.799 85.8502 100.448 85.0636 100.448 84.2434C100.448 83.4231 100.799 82.6365 101.423 82.0565C102.047 81.4766 102.893 81.1507 103.776 81.1507H174.904C175.787 81.1507 176.633 81.4766 177.257 82.0565C177.881 82.6365 178.232 83.4231 178.232 84.2434C178.232 85.0636 177.881 85.8502 177.257 86.4302C176.633 87.0102 175.787 87.336 174.904 87.336V87.336Z" fill="#B493DC"/>
//                         <path id="Vector_4" d="M188.631 97.7736H103.776C102.894 97.7725 102.049 97.4462 101.426 96.8663C100.803 96.2865 100.453 95.5005 100.453 94.681C100.453 93.8615 100.803 93.0755 101.426 92.4956C102.049 91.9158 102.894 91.5895 103.776 91.5884H188.631C189.068 91.5878 189.502 91.6674 189.906 91.8226C190.31 91.9777 190.677 92.2055 190.987 92.4927C191.296 92.7799 191.542 93.121 191.709 93.4965C191.877 93.872 191.963 94.2745 191.963 94.681C191.963 95.0875 191.877 95.49 191.709 95.8654C191.542 96.2409 191.296 96.582 190.987 96.8693C190.677 97.1565 190.31 97.3842 189.906 97.5394C189.502 97.6946 189.068 97.7742 188.631 97.7736V97.7736Z" fill="#B493DC"/>
//                         <path id="Vector_5" d="M174.905 127.925H103.779C102.896 127.925 102.05 128.251 101.426 128.831C100.802 129.411 100.451 130.197 100.451 131.017C100.451 131.838 100.802 132.624 101.426 133.204C102.05 133.784 102.896 134.11 103.779 134.11H174.905C175.787 134.11 176.634 133.784 177.258 133.204C177.882 132.624 178.232 131.838 178.232 131.017C178.232 130.197 177.882 129.411 177.258 128.831C176.634 128.251 175.787 127.925 174.905 127.925V127.925Z" fill="#CCCCCC"/>
//                         <path id="Vector_6" d="M188.632 138.364H103.779C102.896 138.364 102.05 138.69 101.426 139.27C100.802 139.85 100.451 140.637 100.451 141.457C100.451 142.277 100.802 143.063 101.426 143.643C102.05 144.223 102.896 144.549 103.779 144.549H188.632C189.515 144.549 190.361 144.223 190.985 143.643C191.609 143.063 191.96 142.277 191.96 141.457C191.96 140.637 191.609 139.85 190.985 139.27C190.361 138.69 189.515 138.364 188.632 138.364Z" fill="#CCCCCC"/>
//                         <path id="Vector_7" d="M174.904 180.888H103.776C102.893 180.888 102.047 180.562 101.423 179.982C100.799 179.402 100.448 178.616 100.448 177.795C100.448 176.975 100.799 176.188 101.423 175.609C102.047 175.029 102.893 174.703 103.776 174.703H174.904C175.787 174.703 176.633 175.029 177.257 175.609C177.881 176.188 178.232 176.975 178.232 177.795C178.232 178.616 177.881 179.402 177.257 179.982C176.633 180.562 175.787 180.888 174.904 180.888V180.888Z" fill="#CCCCCC"/>
//                         <path id="Vector_8" d="M188.631 191.326H103.776C102.894 191.324 102.049 190.998 101.426 190.418C100.803 189.838 100.453 189.052 100.453 188.233C100.453 187.413 100.803 186.627 101.426 186.048C102.049 185.468 102.894 185.141 103.776 185.14H188.631C189.068 185.14 189.502 185.219 189.906 185.375C190.31 185.53 190.677 185.757 190.987 186.045C191.296 186.332 191.542 186.673 191.709 187.048C191.877 187.424 191.963 187.826 191.963 188.233C191.963 188.639 191.877 189.042 191.709 189.417C191.542 189.793 191.296 190.134 190.987 190.421C190.677 190.708 190.31 190.936 189.906 191.091C189.502 191.247 189.068 191.326 188.631 191.326Z" fill="#CCCCCC"/>
//                         <path id="Ellipse 44" d="M74.1563 100.393C80.652 100.393 85.9177 95.4991 85.9177 89.4622C85.9177 83.4253 80.652 78.5314 74.1563 78.5314C67.6607 78.5314 62.3949 83.4253 62.3949 89.4622C62.3949 95.4991 67.6607 100.393 74.1563 100.393Z" fill="#B493DC"/>
//                         <path id="Path 395" d="M72.9908 93.6319C72.7263 93.6324 72.4687 93.5528 72.257 93.4053L72.2438 93.3961L69.4797 91.431C69.3513 91.3399 69.2435 91.2262 69.1625 91.0964C69.0814 90.9665 69.0287 90.8231 69.0074 90.6743C68.9861 90.5254 68.9965 90.3742 69.0382 90.2291C69.0799 90.0841 69.1519 89.9481 69.2502 89.829C69.3484 89.7098 69.4711 89.6099 69.611 89.5348C69.7509 89.4598 69.9053 89.4111 70.0655 89.3916C70.2256 89.3721 70.3884 89.3822 70.5444 89.4212C70.7003 89.4602 70.8465 89.5275 70.9744 89.6191L72.7648 90.895L76.9955 85.7654C77.0936 85.6465 77.2159 85.5467 77.3555 85.4717C77.4952 85.3967 77.6493 85.348 77.8091 85.3284C77.969 85.3088 78.1314 85.3186 78.2872 85.3573C78.443 85.3961 78.589 85.4629 78.717 85.5541L78.7173 85.5543L78.6911 85.5882L78.718 85.5543C78.9762 85.7387 79.1451 86.0108 79.1877 86.3108C79.2303 86.6108 79.143 86.9142 78.9451 87.1545L73.9689 93.1854C73.8538 93.3243 73.7058 93.4368 73.5364 93.514C73.3669 93.5912 73.1806 93.6311 72.9919 93.6306L72.9908 93.6319Z" fill="white"/>
//                         <path id="Vector_9" d="M87.1266 136.237C87.1271 137.673 86.8234 139.094 86.2327 140.421C85.6421 141.747 84.776 142.953 83.684 143.968C82.592 144.984 81.2954 145.789 79.8684 146.339C78.4414 146.888 76.9118 147.171 75.3671 147.172C75.266 147.173 75.1649 147.17 75.0643 147.16C72.7517 147.105 70.508 146.417 68.6139 145.183C66.7198 143.949 65.2594 142.223 64.4155 140.221C63.5717 138.219 63.3818 136.03 63.8696 133.929C64.3575 131.827 65.5014 129.906 67.1583 128.406C68.8151 126.905 70.9113 125.892 73.1845 125.493C75.4578 125.095 77.807 125.328 79.9384 126.164C82.0697 127 83.8885 128.401 85.1671 130.193C86.4456 131.985 87.1272 134.087 87.1266 136.237V136.237Z" fill="#CCCCCC"/>
//                         <path id="Ellipse 44_2" d="M74.1563 193.945C80.652 193.945 85.9177 189.051 85.9177 183.014C85.9177 176.977 80.652 172.083 74.1563 172.083C67.6607 172.083 62.3949 176.977 62.3949 183.014C62.3949 189.051 67.6607 193.945 74.1563 193.945Z" fill="#CCCCCC"/>
//                         <path id="Vector_10" d="M224.673 56.0079H200.494C198.729 56.0079 197.036 55.3563 195.788 54.1963C194.54 53.0363 193.839 51.4631 193.839 49.8227V33.2261C193.839 33.1534 193.861 33.0822 193.902 33.0206C193.944 32.9591 194.003 32.9097 194.074 32.878C194.144 32.8464 194.223 32.8338 194.3 32.8418C194.378 32.8498 194.452 32.8779 194.513 32.923L224.931 55.3183C224.999 55.3682 225.048 55.4363 225.072 55.5134C225.096 55.5905 225.094 55.6726 225.065 55.7484C225.037 55.8242 224.984 55.8899 224.914 55.9364C224.843 55.9829 224.759 56.0079 224.673 56.0079Z" fill="#CCCCCC"/>
//                         <path id="Vector_11" d="M87.1265 136.237C87.1271 137.673 86.8234 139.094 86.2327 140.421C85.642 141.747 84.7759 142.953 83.6839 143.968C82.5919 144.984 81.2954 145.789 79.8684 146.339C78.4413 146.888 76.9118 147.171 75.3671 147.172C75.266 147.174 75.1649 147.17 75.0643 147.16C73.5449 143.638 72.9591 139.828 73.3564 136.051C73.7537 132.275 75.1225 128.642 77.3472 125.46C80.0831 125.896 82.5651 127.217 84.3546 129.189C86.1441 131.161 87.1259 133.657 87.1265 136.237V136.237Z" fill="#B493DC"/>
//                         <path id="Vector_12" d="M100.448 131.02C100.45 130.2 100.801 129.413 101.425 128.833C102.05 128.253 102.896 127.926 103.779 127.925H121.503C122.538 129.882 123.274 131.964 123.689 134.11H103.779C102.897 134.11 102.05 133.784 101.426 133.205C100.802 132.626 100.45 131.84 100.448 131.02V131.02Z" fill="#B493DC"/>
//                         <path id="Vector_13" d="M124.101 138.364C124.102 140.453 123.804 142.533 123.216 144.549H103.779C102.896 144.549 102.05 144.223 101.426 143.643C100.802 143.063 100.451 142.277 100.451 141.457C100.451 140.637 100.802 139.85 101.426 139.27C102.05 138.69 102.896 138.364 103.779 138.364H124.101Z" fill="#B493DC"/>
//                         <path id="Vector_14" d="M167.954 176.507C167.453 177.272 166.645 177.82 165.708 178.031C164.772 178.241 163.783 178.098 162.961 177.632L120.57 153.601C120.163 153.37 119.809 153.067 119.527 152.709C119.246 152.351 119.043 151.945 118.931 151.514C118.819 151.083 118.799 150.635 118.873 150.197C118.946 149.759 119.112 149.339 119.36 148.96C119.609 148.582 119.935 148.252 120.321 147.991C120.706 147.73 121.143 147.541 121.607 147.437C122.07 147.333 122.552 147.314 123.023 147.382C123.495 147.451 123.947 147.605 124.354 147.836L166.745 171.866C167.567 172.333 168.157 173.084 168.384 173.954C168.611 174.824 168.456 175.743 167.954 176.507V176.507Z" fill="#3F3D56"/>
//                         <path id="Vector_15" d="M125.564 152.477C122.57 157.038 118.189 160.672 112.973 162.919C107.758 165.165 101.942 165.924 96.2625 165.099C90.5828 164.274 85.2939 161.903 81.0644 158.284C76.835 154.666 73.8551 149.963 72.5016 144.771C71.148 139.578 71.4816 134.129 73.4602 129.113C75.4387 124.097 78.9734 119.739 83.6172 116.589C88.2609 113.44 93.8052 111.641 99.549 111.421C105.293 111.2 110.978 112.567 115.886 115.349C122.46 119.085 127.171 125.093 128.985 132.053C130.8 139.013 129.569 146.359 125.564 152.477ZM82.1397 127.86C79.8945 131.281 78.7913 135.244 78.9695 139.248C79.1476 143.251 80.5992 147.116 83.1406 150.353C85.6821 153.589 89.1992 156.053 93.2473 157.432C97.2954 158.811 101.693 159.044 105.883 158.1C110.073 157.157 113.868 155.08 116.788 152.132C119.708 149.184 121.622 145.497 122.288 141.538C122.954 137.579 122.341 133.526 120.528 129.89C118.715 126.255 115.783 123.201 112.102 121.114C107.164 118.322 101.237 117.465 95.6198 118.73C90.0027 119.994 85.1548 123.278 82.1397 127.86V127.86Z" fill="#3F3D56"/>
//                     </g>
//                     <g id="Person">
//                         <path id="Vector_16" d="M218.771 146.71C226.985 146.71 233.644 140.521 233.644 132.887C233.644 125.254 226.985 119.065 218.771 119.065C210.558 119.065 203.899 125.254 203.899 132.887C203.899 140.521 210.558 146.71 218.771 146.71Z" fill="#A0616A"/>
//                         <path id="Vector_17" d="M217.81 210.376C217.523 209.545 217.429 208.668 217.532 207.801C217.636 206.934 217.935 206.097 218.411 205.345C218.887 204.593 219.528 203.943 220.293 203.438C221.058 202.932 221.929 202.583 222.85 202.412C223.141 202.359 223.437 202.325 223.733 202.311L239.4 178.943L225.089 166.299C224.543 165.816 224.104 165.237 223.799 164.596C223.495 163.954 223.33 163.263 223.314 162.562C223.299 161.861 223.432 161.164 223.708 160.511C223.984 159.859 224.396 159.263 224.921 158.76C225.446 158.256 226.073 157.854 226.766 157.577C227.458 157.299 228.204 157.152 228.958 157.144C229.712 157.136 230.461 157.267 231.161 157.529C231.86 157.791 232.497 158.18 233.034 158.672L252.793 176.778L252.832 176.823C253.444 177.688 253.739 178.712 253.674 179.745C253.609 180.777 253.188 181.763 252.472 182.555L230.522 206.683C230.587 206.876 230.642 207.072 230.685 207.271C230.869 208.127 230.856 209.009 230.647 209.859C230.438 210.71 230.039 211.509 229.474 212.206C228.909 212.903 228.193 213.481 227.371 213.903C226.549 214.325 225.641 214.58 224.706 214.653C224.516 214.668 224.328 214.676 224.141 214.676C222.733 214.67 221.363 214.251 220.226 213.479C219.089 212.707 218.244 211.621 217.81 210.376V210.376Z" fill="#A0616A"/>
//                         <path id="Vector_18" d="M194.276 325.258L186.852 325.257L183.321 298.645L194.278 298.645L194.276 325.258Z" fill="#A0616A"/>
//                         <path id="Vector_19" d="M196.169 331.945L172.232 331.945V331.663C172.232 330.526 172.473 329.4 172.942 328.35C173.41 327.299 174.096 326.344 174.961 325.54C175.826 324.736 176.854 324.099 177.984 323.663C179.114 323.228 180.326 323.004 181.549 323.004H181.55L196.17 323.005L196.169 331.945Z" fill="#2F2E41"/>
//                         <path id="Vector_20" d="M268.064 315.718L261.686 319.248L244.001 298.062L253.415 292.852L268.064 315.718Z" fill="#A0616A"/>
//                         <path id="Vector_21" d="M273.373 320.564L252.805 331.945L252.65 331.704C252.024 330.727 251.611 329.645 251.435 328.519C251.259 327.394 251.323 326.248 251.624 325.145C251.925 324.043 252.456 323.007 253.188 322.095C253.92 321.184 254.837 320.415 255.889 319.834L255.889 319.833L268.451 312.882L273.373 320.564Z" fill="#2F2E41"/>
//                         <path id="Vector_22" d="M182.385 313.538C177.411 259.115 174.453 208.556 192.633 187.932L192.773 187.772L223.368 199.146L223.419 199.247C223.522 199.456 233.697 220.257 231.324 234.248L238.87 266.511L263.476 304.802C263.675 305.11 263.8 305.454 263.844 305.811C263.888 306.168 263.85 306.529 263.733 306.871C263.616 307.213 263.421 307.528 263.163 307.795C262.905 308.062 262.588 308.275 262.235 308.419L251.541 312.792C250.938 313.036 250.26 313.07 249.632 312.887C249.004 312.705 248.467 312.318 248.121 311.798L221.354 271.234L206.235 240.121C206.153 239.952 206.013 239.813 205.838 239.725C205.662 239.637 205.46 239.605 205.263 239.635C205.066 239.664 204.885 239.753 204.748 239.887C204.611 240.022 204.525 240.195 204.504 240.379L196.123 313.593C196.053 314.215 195.737 314.791 195.237 315.21C194.736 315.628 194.087 315.859 193.414 315.858H185.101C184.419 315.854 183.763 315.615 183.26 315.186C182.758 314.757 182.446 314.169 182.385 313.538V313.538Z" fill="#2F2E41"/>
//                         <path id="Vector_23" d="M192.736 188.363L192.59 188.298L192.567 188.149C191.424 180.715 192.777 172.455 196.588 163.598C198.466 159.264 201.958 155.701 206.426 153.558C210.894 151.415 216.042 150.836 220.932 151.925V151.925C223.748 152.57 226.39 153.751 228.689 155.395C230.989 157.038 232.896 159.107 234.29 161.472C235.666 163.811 236.505 166.392 236.752 169.048C236.999 171.705 236.65 174.381 235.727 176.905C230.923 189.962 224.691 202.178 224.628 202.3L224.498 202.555L192.736 188.363Z" fill="#B493DC"/>
//                         <path id="Vector_24" d="M159.355 169.846C160.092 169.305 160.943 168.916 161.853 168.702C162.763 168.489 163.711 168.456 164.636 168.607C165.56 168.758 166.44 169.089 167.217 169.578C167.995 170.067 168.652 170.703 169.146 171.444C169.302 171.679 169.439 171.925 169.558 172.178L198.596 177.632L206.327 160.747C206.623 160.102 207.053 159.518 207.592 159.028C208.132 158.538 208.771 158.152 209.472 157.893C210.173 157.634 210.922 157.507 211.677 157.518C212.431 157.53 213.175 157.68 213.867 157.96C214.558 158.241 215.183 158.646 215.705 159.152C216.227 159.658 216.637 160.255 216.909 160.909C217.181 161.563 217.312 162.26 217.292 162.961C217.273 163.662 217.105 164.353 216.797 164.993L205.467 188.533L205.436 188.584C204.778 189.419 203.849 190.034 202.786 190.339C201.723 190.644 200.582 190.623 199.533 190.278L167.529 179.618C167.357 179.743 167.178 179.859 166.993 179.967C166.195 180.426 165.301 180.724 164.371 180.84C163.441 180.956 162.495 180.888 161.595 180.641C160.694 180.393 159.861 179.972 159.148 179.404C158.436 178.836 157.86 178.135 157.459 177.346C157.378 177.187 157.304 177.026 157.238 176.863C156.751 175.635 156.693 174.296 157.073 173.036C157.453 171.776 158.252 170.659 159.355 169.846V169.846Z" fill="#A0616A"/>
//                         <path id="Vector_25" d="M272.5 147.69C271.067 145.331 268.98 143.17 266.221 142.298C262.657 141.172 258.799 142.371 255.135 143.172C252.312 143.788 249.363 144.166 246.518 143.645C243.673 143.125 240.929 141.586 239.634 139.175C237.73 135.627 239.334 131.397 239.218 127.434C239.159 125.277 238.573 123.16 237.505 121.244C236.438 119.327 234.916 117.661 233.054 116.371C231.193 115.081 229.041 114.2 226.76 113.795C224.479 113.39 222.129 113.472 219.888 114.034C216.379 113.093 213.203 113.006 211.033 115.513C208.303 115.513 205.685 116.52 203.754 118.315C201.824 120.109 200.739 122.542 200.739 125.08H210.582C210.116 127.412 210.649 129.822 212.068 131.794C213.806 134.167 216.827 135.883 217.409 138.701C217.973 141.433 215.975 144.024 213.879 146.01C211.784 147.995 209.353 149.963 208.698 152.677C208.298 154.737 208.753 156.862 209.972 158.622C211.19 160.361 212.7 161.907 214.445 163.201C222.308 169.461 231.653 173.904 241.717 176.167C248.804 177.753 256.556 178.164 263.135 175.247C265.767 174.08 268.113 172.422 270.026 170.377C271.94 168.332 273.38 165.943 274.259 163.359C275.137 160.774 275.434 158.05 275.131 155.354C274.829 152.659 273.933 150.05 272.5 147.69V147.69Z" fill="#2F2E41"/>
//                         <path id="Vector_26" d="M274.722 332.531H159.67C159.51 332.531 159.356 332.472 159.242 332.366C159.128 332.261 159.065 332.118 159.065 331.968C159.065 331.819 159.128 331.676 159.242 331.57C159.356 331.465 159.51 331.406 159.67 331.406H274.722C274.882 331.406 275.037 331.465 275.15 331.57C275.264 331.676 275.327 331.819 275.327 331.968C275.327 332.118 275.264 332.261 275.15 332.366C275.037 332.472 274.882 332.531 274.722 332.531Z" fill="#CCCCCC"/>
//                     </g>
//                 </g>
//             </svg>`

//   error.innerHTML = `<h4>😓 Oops, movie not found</h4>
//                     <p>Please try to search for another movie</p>
//                     ${svg}`;

//   !input.value == "" || !arr.length == 0 ? cardsContainer.removeChild(error) : console.log("Movie found") //Remove error message
// }


//Bind search to the on click event

//At navbar input when enter key is pressed

document.querySelector("#navbarSearch-form").onsubmit = (e) => {
  e.preventDefault()
  cardsContainer.innerHTML = "" //empty container before loading new data
  
  getSearchInput()

  getSearchedMovies()

  enableScroll(document.querySelector(".search__window"))

  document.querySelector(".navbar__input").value = "" //remove navbar input value after click
}

//At search popup input when enter key is pressed
document.querySelector("#search-form").onsubmit = (e) => {
  e.preventDefault()
  cardsContainer.innerHTML = "" //empty container before loading new data

  getSearchInput()

  getSearchedMovies()

  enableScroll(document.querySelector(".search__window"))

  document.querySelector(".search__bar .input").value = "" //remove search bar input value after click
}




