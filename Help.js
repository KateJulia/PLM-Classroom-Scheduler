window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 1000); 
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const supportForm = document.getElementById('supportForm');
    const successOverlay = document.getElementById('successOverlay');
    const bottomTarget = document.querySelector('#bottom-target');

    //Smooth Scroll to Footer
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            bottomTarget.scrollIntoView({ behavior: 'smooth' });
        });
    }

    //Hide Scroll Indicator
    window.onscroll = function() {
        if (!scrollIndicator) return;
        
        let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (window.scrollY >= scrollableHeight - 10) {
            scrollIndicator.style.opacity = "0";
            scrollIndicator.style.pointerEvents = "none";
        } else {
            scrollIndicator.style.opacity = "1";
            scrollIndicator.style.pointerEvents = "auto";
        }
    };

    //Form Submission Logic
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            successOverlay.style.display = 'flex';
        });
    }
});

//Global function to close the success modal
function closeSuccess() {
    const successOverlay = document.getElementById('successOverlay');
    const supportForm = document.getElementById('supportForm');
    
    successOverlay.style.display = 'none';
    if (supportForm) supportForm.reset();
}