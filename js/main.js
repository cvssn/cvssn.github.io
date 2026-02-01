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
});