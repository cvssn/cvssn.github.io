function updateFavicon() {
    const favicon = document.getElementById('favicon');

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // tema escuro
        favicon.href = 'assets/images/icons/icon-earth.ico'
    } else {
        // tema claro
        favicon.href = 'assets/images/icons/icon-earth.ico'
    }
}

// atualiza o ícone quando a página é recarregada
updateFavicon();

// atualiza o ícone se o tema for alterado dinamicamente
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);