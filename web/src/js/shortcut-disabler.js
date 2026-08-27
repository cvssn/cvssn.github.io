document.addEventListener('keydown', function(event) {
    // ctrl + u
    if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();

        return false;
    }

    // ctrl + shift + i
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();

        return false;
    }

    // f12
    if (event.key === 'F12') {
        event.preventDefault();

        return false;
    }
});