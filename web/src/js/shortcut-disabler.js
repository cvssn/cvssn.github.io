document.addEventListener('keydown', function(event) {
    // ctrl + u
    if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();

        return false;
    }

    // ctrl + shift + c
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();

        return false;
    }

    // ctrl + shift + i
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();

        return false;
    }

    // ctrl + shift + j
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'j') {
        event.preventDefault();

        return false;
    }

    // f12
    if (event.key === 'F12') {
        event.preventDefault();

        return false;
    }
});

// inspect
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});