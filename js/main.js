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