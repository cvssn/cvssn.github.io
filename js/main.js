//////////////////////////////////////
// 1. cursor personalizado (rastro) //
//////////////////////////////////////
const symbols = ["*", ".", ":", "｡", "✿"];

let lastTime = 0;

const delay = 60;

let cursorEnabled = true;

document.addEventListener("mousemove", (e) => {
    if (!cursorEnabled)
        return;

    const now = Date.now();

    if (now - lastTime < delay)
        return;

    lastTime = now;

    const span = document.createElement("span");

    span.classList.add("cursor-symbol");
    
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    span.style.left = e.clientX + (Math.random() - 0.5) * 12 + "px";
    span.style.top = e.clientY + (Math.random() - 0.5) * 12 + "px";

    document.body.appendChild(span);

    setTimeout(() => span.remove(), 1400);
});

/////////////////////////////////////
// 2. dom ready (lógica principal) //
/////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    // ----- a. lógica de áudio (nova) ----- //
    initAudio();

    // ----- b. filtros (works) ----- //
    const filterButtons = document.querySelectorAll(".filters button");
    const gridItems = document.querySelectorAll(".grid .item");

    if (filterButtons.length && gridItems.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                filterButtons.forEach((btn) => btn.classList.remove("active"));

                button.classList.add("active");

                const filterValue = button.getAttribute("data-filter");

                gridItems.forEach((item) => {
                    if (filterValue === "all" || item.classList.contains(filterValue)) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    // ----- c. modal de contato (corrigido) ----- //
    const openContactBtn = document.getElementById("openContact");
    const contactModal = document.getElementById("contactModal");
    const closeModalBtn = document.querySelector(".close-modal");
    const overlay = document.querySelector(".modal-overlay");

    // mudança 1: pegar o container que tem posição absoluta, no caso
    // `position: absolute;`, e não a caixa interna
    const contactContainer = document.querySelector("#contactModal .modal-container");

    function openContact(e) {
        if (e)
            e.preventDefault();

        // 1. tornar visível primeiro para o navegador ler o tamanho
        contactModal.classList.add("show");

        if (contactContainer) {
            // 2. pegar as dimensões da janela e da caixa
            const boxRect = contactContainer.getBoundingClientRect();
            const boxWidth = boxRect.width;
            const boxHeight = boxRect.height;
            
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // 3. definir os limites máximos:
            //
            // (largura da tela - tamanho da caixa - margem de segurança)
            //
            // `math.max(0, ...)` impede que dê negativo se a tela for
            // muito pequena (no mobile)
            const maxLeft = Math.max(0, windowWidth - boxWidth - 40);
            const maxTop = Math.max(0, windowHeight - boxHeight - 40);

            // 4. gerar posição aleatória dentro desses limites seguros
            const randomLeft = Math.floor(Math.random() * maxLeft) + 20; // +20 é a margem esquerda mínima
            const randomTop = Math.floor(Math.random() * maxTop) + 20;   // +20 é a margem topo mínima

            // 5. aplicar a posição no container (`position: absolute;`)
            contactContainer.style.left = randomLeft + "px";
            contactContainer.style.top = randomTop + "px";
        }
    }

    function closeContact() {
        contactModal.classList.remove("show");
    }

    if (openContactBtn)
        openContactBtn.addEventListener("click", openContact);

    if (closeModalBtn)
        closeModalBtn.addEventListener("click", closeContact);

    if (overlay)
        overlay.addEventListener("click", closeContact);

    /* ----- d. modal de projetos (works) ----- */
    const projectModal = document.getElementById("projectModal");

    if (projectModal) {
        const projectTriggers = document.querySelectorAll(".modal-trigger");
        const closeProjectBtn = document.querySelector(".close-project-modal");
        const overlayProject = document.querySelector(".project-overlay");
        
        // elementos internos do modal
        const modalTitleImg = document.getElementById("modal-title-img");
        const imgWrapper = document.querySelector(".project-img-wrapper");
        const modalDescContainer = document.querySelector(".modal-description");

        function closeProject() {
            projectModal.classList.remove("show");

            // limpar conteúdo ao fechar para não piscar no próximo
            if (imgWrapper)
                imgWrapper.innerHTML = '';

            if (modalTitleImg)
                modalTitleImg.src = '';
        }

        projectTriggers.forEach(trigger => {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();

                // 1. limpar anterior
                if (imgWrapper)
                    imgWrapper.innerHTML = '';

                // 2. título (imagem)
                const titleImageSrc = trigger.getAttribute("data-title-image");
                
                if (titleImageSrc && modalTitleImg) {
                    modalTitleImg.src = titleImageSrc;
                    modalTitleImg.style.display = "block";
                } else if (modalTitleImg) {
                    modalTitleImg.style.display = "none";
                }

                // 3. descrição
                const descText = trigger.getAttribute("data-desc") || "";
                
                if (modalDescContainer) {
                    modalDescContainer.innerHTML = `<p>${descText.replace(/\n/g, "<br>")}</p>`;
                }

                // 4. galeria de imagens
                const rawImages = trigger.getAttribute("data-images") || trigger.getAttribute("data-image") || "";
                
                if (rawImages) {
                    const sources = rawImages.split(",").map(src => src.trim()).filter(Boolean);
                    
                    sources.forEach(src => {
                        const img = document.createElement("img");

                        img.src = src;

                        img.style.width = "100%";
                        img.style.display = "block";
                        img.style.marginBottom = "10px";

                        imgWrapper.appendChild(img);
                    });
                }

                projectModal.classList.add("show");
            });
        });

        if (closeProjectBtn)
            closeProjectBtn.addEventListener("click", closeProject);

        if (overlayProject)
            overlayProject.addEventListener("click", closeProject);
    }

    /* ----- e. esc global ----- */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (contactModal)
                contactModal.classList.remove("show");

            if (projectModal)
                projectModal.classList.remove("show");
        }
    });
});

/////////////////////////////////////
// 3. função de áudio centralizada //
/////////////////////////////////////
function initAudio() {
    const bgAudio = document.getElementById('bgAudio');
    const clickAudio = document.getElementById('clickAudio');
    const audioBtn = document.getElementById('audioControl');

    // se a página não tiver os elementos de áudio, abortar para não dar erro
    if (!bgAudio || !clickAudio || !audioBtn)
        return;

    bgAudio.volume = 0.5; 
    clickAudio.volume = 0.8;

    let musicStarted = false;

    // recuperar estado anterior (opcional - se quiser que lembre se estava mudo)
    //
    // por enquanto, manter padrão
    function updateIcon() {
        if (bgAudio.paused) {
            audioBtn.classList.add('muted');
        } else {
            audioBtn.classList.remove('muted');
        }
    }

    function playClick() {
        clickAudio.currentTime = 0;

        clickAudio.play().catch(() => {});
    }

    // clicar no botão de áudio
    audioBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        playClick();

        if (bgAudio.paused) {
            bgAudio.play();

            musicStarted = true;
        } else {
            bgAudio.pause();
        }
        
        updateIcon();
    });

    // autoplay na primeira interação com a página
    document.addEventListener('click', function() {
        playClick();

        if (!musicStarted && bgAudio.paused) {
            bgAudio.play().then(() => {
                musicStarted = true;

                updateIcon();
            }).catch(e => {
                // o navegador bloqueou, esperar próximo clique
            });
        }
    });
}