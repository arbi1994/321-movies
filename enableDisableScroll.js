/**
 * Disable scrolling functionality
 * @param {DOM element} el 
 */
 const disableScroll = (el) => {
    el.classList.add("show") || el.classList.add("open")
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
};
  
/**
 * Enable back scrolling functionality
 * @param {DOM element} el 
 */
const enableScroll = (el) => {
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    el.classList.remove("show") || el.classList.remove("open")
}

window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});