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

    // 1. Smooth Scroll to Footer
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            bottomTarget.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 2. Hide Scroll Indicator when at the bottom
    window.onscroll = function() {
        if (!scrollIndicator) return;
        
        let scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // If we are within 10px of the bottom, hide the arrow
        if (window.scrollY >= scrollableHeight - 10) {
            scrollIndicator.style.opacity = "0";
            scrollIndicator.style.pointerEvents = "none";
        } else {
            scrollIndicator.style.opacity = "1";
            scrollIndicator.style.pointerEvents = "auto";
        }
    };

    // 3. Form Submission Logic
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            successOverlay.style.display = 'flex';
        });
    }
});

// 4. Global function to close the success modal
function closeSuccess() {
    const successOverlay = document.getElementById('successOverlay');
    const supportForm = document.getElementById('supportForm');
    
    successOverlay.style.display = 'none';
    if (supportForm) supportForm.reset();
}