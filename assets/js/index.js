const SVG_NS = "http://www.w3.org/2000/svg";

const STAR_VIEWBOX = {
    width: 595.28,
    height: 841.89
};

const STAR_LINES = [
    [[85.76, 138.22], [537.94, 566.09]],
    [[85.76, 138.22], [380.41, 684.49]],
    [[178.51, 310.18], [537.94, 566.09]],
    [[485.87, 140.17], [33.65, 567.77]],
    [[485.87, 140.17], [194.31, 683.52]],
    [[394.45, 310.55], [33.65, 567.77]],
    [[286.77, 328.43], [194.31, 683.52]],
    [[286.77, 328.43], [380.41, 684.49]]
];

const STAR_NODES = {
    top: [285.815, 139.195],
    upperRight: [537.94, 566.09],
    lowerRight: [380.41, 684.49],
    lowerLeft: [194.31, 683.52],
    upperLeft: [33.65, 567.77],
    topRight: [485.87, 140.17],
    topLeft: [85.76, 138.22],
    center: [285.795, 411.355]
};

const linesContainer = document.querySelector("svg.lines");
const logo = document.getElementById("logo");
const overlay = document.getElementById("overlay");
const langButtons = document.querySelectorAll(".language-selector button");
const links = [...document.querySelectorAll(".link")];
const descriptions = document.querySelectorAll(".description .lang");

const linkMap = [
    { el: document.querySelector('a[href="12.e.html"]'), point: STAR_NODES.upperRight },
    { el: document.querySelector('a[href="atlas.html"]'), point: STAR_NODES.upperLeft },
    { el: document.querySelector('a[href="sistemas.html"]'), point: STAR_NODES.topRight },
    { el: document.querySelector('a[href="marco_teorico.index.html"]'), point: STAR_NODES.lowerLeft },
    { el: document.querySelector('a[href="a.e.i.index.html"]'), point: STAR_NODES.lowerRight },
    { el: document.querySelector('a[href="ep.2.html"]'), point: STAR_NODES.topLeft }
].filter(item => item.el);

function computeFit() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const padX = Math.max(28, vw * 0.08);
    const padY = Math.max(28, vh * 0.08);

    const availW = vw - padX * 2;
    const availH = vh - padY * 2;

    const scale = Math.min(availW / STAR_VIEWBOX.width, availH / STAR_VIEWBOX.height);

    const drawW = STAR_VIEWBOX.width * scale;
    const drawH = STAR_VIEWBOX.height * scale;

    const offsetX = (vw - drawW) / 2;
    const offsetY = (vh - drawH) / 2;

    return {
        scale,

        offsetX,
        offsetY
    };
}

function toViewport(point, fit) {
    return {
        x: fit.offsetX + point[0] * fit.scale,
        y: fit.offsetY + point[1] * fit.scale
    };
}

function placeGeometry() {
    const fit = computeFit();
    const center = toViewport(STAR_NODES.center, fit);

    logo.style.left = `${center.x}px`;
    logo.style.top = `${center.y}px`;

    linkMap.forEach(({ el, point }) => {
        const p = toViewport(point, fit);

        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
    });

    drawLines(fit, center);

    document.documentElement.style.visibility = "visible";
}

function drawLines(fit, center) {
    if (!linesContainer)
        return;

    linesContainer.innerHTML = "";

    STAR_LINES.forEach(([a, b]) => {
        const p1 = toViewport(a, fit);
        const p2 = toViewport(b, fit);

        const ln = document.createElementNS(SVG_NS, "line");

        ln.setAttribute("x1", p1.x);
        ln.setAttribute("y1", p1.y);
        ln.setAttribute("x2", p1.x);
        ln.setAttribute("y2", p1.y);

        linesContainer.appendChild(ln);
    });

    linkMap.forEach(({ point }) => {
        const p = toViewport(point, fit);

        const spoke = document.createElementNS(SVG_NS, "line");

        spoke.setAttribute("x1", center.x);
        spoke.setAttribute("y1", center.y);

        spoke.setAttribute("x2", p.x);
        spoke.setAttribute("y2", p.y);

        spoke.setAttribute("class", "spoke");

        linesContainer.appendChild(spoke);
    });
}

function setLanguage(lang) {
    langButtons.forEach(btn => {
        const active = btn.dataset.lang === lang;

        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    descriptions.forEach(desc => {
        desc.classList.toggle("active", desc.classList.contains(`lang-${lang}`));
    });
}

window.addEventListener("load", () => {
    placeGeometry();
});

window.addEventListener("resize", () => requestAnimationFrame(placeGeometry));

logo.addEventListener("click", e => {
    e.stopPropagation();

    overlay.classList.toggle("active");
});

overlay.addEventListener("click", e => {
    if (!e.target.closest(".description") && !e.target.closest(".language-selector")) {
        overlay.classList.remove("active");
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape")
        overlay.classList.remove("active");
});

langButtons.forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));