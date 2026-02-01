document.addEventListener('keydown', function(e) {
    // ctrl + shift + i (windows/linux) ou command + option + i (macos)
    if ((e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12') {
        e.preventDefault();
    }

    // ctrl + u
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
});

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});