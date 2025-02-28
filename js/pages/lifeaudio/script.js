function menu(event) {
    event.preventDefault();
    
    const nav = document.querySelector('nav');
    const elements = document.querySelectorAll('article, section, address');
    
    if (nav.style.display === 'none' || nav.style.display === '') {
        nav.style.display = 'flex';

        elements.forEach(element => {
            element.style.display = 'none';
        });
    } else {
        nav.style.display = 'none';

        elements.forEach(element => {
            element.style.display = 'flex';
        });
    }
}

function slideshow() {
    const slideshows = document.querySelectorAll('article, section, div');

    slideshows.forEach(slideshow => {
        const images = slideshow.querySelectorAll('img');

        let index = 0;
        let playing = true;

        function displayImage(index) {
            images.forEach((image, i) => {
                image.loading = i === index ? 'eager' : 'lazy';
                image.style.display = i === index ? 'block' : 'none';
            });
        }

        function slide() {
            if (playing) {
                index = (index + 1) % images.length;
                
                displayImage(index);
            }
        }

        displayImage(index);

        slideshow.addEventListener('click', () => {
            playing = !playing;
        });

        setInterval(slide, 500);
    });
}

document.addEventListener('DOMContentLoaded', slideshow);