window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 500); 
});