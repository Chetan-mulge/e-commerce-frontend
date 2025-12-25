const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        // Toggle the active class on the nav list
        navLinks.classList.toggle('nav-active');
    });
}

console.log("App Loaded: Mobile Menu Ready");