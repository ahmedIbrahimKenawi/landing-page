/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
const navbar = document.querySelector('#navbar__list');
const sections = document.querySelectorAll('section');
const scrollTopBtn = document.getElementById('scrollTopBtn');

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

// get most near section to top of viewport
function mostNearSectionToViewportTop(){
  const viewportHeight = document.documentElement.clientHeight;

  let mostNear = sections[0];
  sections.forEach( section=>{
    const distance = section.getBoundingClientRect().top;
    if( distance < viewportHeight/2 && distance > -viewportHeight/2 ){
      mostNear = section
    }
  })
  
  return mostNear;
}

// hide nav bar during scrolling
function hideNavBar(){
  document.querySelector('nav.navbar__menu').classList.add('hide__nav');
}

// show nav bar after scroll end
const showNavBarAfterScrollEnd = (function(){
  let timer = null;
  return ()=>{
    if(timer !== null) {
      clearTimeout(timer);        
    }
    timer = setTimeout(()=>{
      document.querySelector('nav.navbar__menu').classList.remove('hide__nav');
    }, 100);
  }
})();

// return true if scroll below fold
function belowTheFold(){  
  const viewportHeight = document.documentElement.clientHeight;
  const scrolltop =  window.pageYOffset;
  return scrolltop > viewportHeight; 
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/


// build the nav
function buildTheNav(){

  let navbarHTML = ''
  sections.forEach( section=>{
    navbarHTML += `<li><a class="menu__link" href="#${section.id}">${section.dataset.nav}</a></li>`
  });

  navbar.insertAdjacentHTML("afterbegin", navbarHTML);
}



// Add class 'active' to section when near top of viewport
const addClassActiveToMostTopSection = (function(){
  let prevActiveSection;
  return ()=>{
    const section = mostNearSectionToViewportTop();

    if(prevActiveSection){
      if(prevActiveSection === section){
        return;
      }else{
        prevActiveSection.classList.remove('active')
      }
    }
    
    section.classList.add('active');
    prevActiveSection = section;
    
  }    
})();

// Add class 'activeLink' to anchor
function addClassActiveLink(href){
  const links = navbar.querySelectorAll('a');

  links.forEach( link =>{
    if(link.getAttribute('href') === href ){
      link.classList.add('activeLink');

    }else{
      link.classList.remove('activeLink');
    }
  })
}

// Scroll to anchor ID using scrollTO event
function scrollToSection( sectionId ){
  
  const section = document.getElementById(sectionId);
  const top = section.getBoundingClientRect().top + window.pageYOffset;
  
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}

//

function scrollTopButton(){
  
  if(belowTheFold()){
    scrollTopBtn.classList.add('showBtn');
  }else{
    scrollTopBtn.classList.remove('showBtn');
  }
}

/**
 * End Main Functions
 * Begin Events
 * 
*/


// Build menu 
buildTheNav();

// Scroll to section on link click
navbar.addEventListener('click', (event)=>{

  const target = event.target;
  if( event.target.nodeName !== 'A' ){
    return;
  }
  event.preventDefault();
  
  const href = target.getAttribute('href')
  const sectionId = href.replace('#', '');

  addClassActiveLink( href )
  scrollToSection( sectionId );

})


// handle click events on <button> 
class HandleClicksOnButton {

  constructor() {
    // Handle clicks by this
    document.addEventListener('click', this)
  }

  scrollTop(){
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  collapse(event){
    const target = event.target
    target.parentElement.querySelector('.collapsible').classList.toggle('collapse');
    
    let text = target.textContent
    if(text === 'Collapse'){
      target.textContent = 'Expand'
    }else{
      target.textContent = 'Collapse'
    }

  }

  handleEvent (event){
    const target = event.target;
    if(target.nodeName !== 'BUTTON'){
      return;
    }

    let action = target.dataset.action
    this[action](event)
  }

}

new HandleClicksOnButton();


// handle scroll events
window.addEventListener('scroll', (event)=>{

  // Set sections as active
  addClassActiveToMostTopSection();

  // hide nav during scroll and show after scroll end
  hideNavBar();
  showNavBarAfterScrollEnd();

  // Add a scroll to top button on the page
  // that’s only visible when the user scrolls below the fold of the page.
  scrollTopButton();
})

