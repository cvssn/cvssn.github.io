document.getElementById("ua").value = navigator.userAgent;
document.getElementById("page").value = location.href;

const form = document.querySelector("form");
const btn = document.getElementById("btnSubmit");
const note = document.getElementById("formNote");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const horario = document.getElementById("horario").value;

    if (!nome || !email || !horario) {
        note.textContent = "complete todos os campos";

        return;
    }

    btn.disabled = true;

    note.textContent = "procesando…";

    try {
        const res = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        const data = await res.json();
    } catch {
        note.textContent = "erro de red";
    }

    btn.disabled = false;
});

/* lightbox */
const portada = document.getElementById("portada");
const lb = document.getElementById("cvssn-lightbox");
const lbImg = document.getElementById("lb-img");

portada.addEventListener("click", () => {
    lb.classList.add("open");

    lbImg.src = portada.src;
});

lb.addEventListener("click", () => {
    lb.classList.remove("open");
});