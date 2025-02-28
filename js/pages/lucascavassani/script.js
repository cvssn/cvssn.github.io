// armazenar os diversos blocos de conteúdos em um array
const contentBlocks = [
    // bloco 1
    `
    this isn't about understanding. understanding is too slow. you navigate instead through fragments, through gestures, through echoes of what was, knowing that what was is already gone. you aren't outside it, nor are you entirely inside it. you exist in relation to it, shaped as much by what you don't see as by what you do.<br><br>
    
    there is no static ground, no fixed perspective. the system bends around you, accommodating your presence while erasing its edges. it makes room, but not for you, only for the continuation of itself. its logic is recursive, self-sustaining, indifferent to the meaning you try to extract from it.<br><br>

    it isn't an escape, and it isn't a tool. it's an extension of everything we are, amplified and abstracted, mirrored and distorted. it's a system that changes as you move through it, adapting faster than you can process. it doesn't stop, and neither do you.
    `,

    // bloco 2
    `
    <div class="image-text-container">
        <img src="https://cvssn.github.io/img/archive/00007.jpg" alt="lucas cavassani">

        <div class="text">
            based in brazil <br>
            you can reach me on instagram, my username is cavassxni
        </div>
    </div>
    `,

    // bloco 3
    `
    <div class="image-text-container">
        <img src="https://cvssn.github.io/img/archive/00007.jpg" alt="lucas cavassani">

        <div class="text"></div>
    </div>
    `
];

// acompanha o índice atual
let currentIndex = 0;

function toggleContent() {
    // seleciona o container de conteúdo
    const contentDiv = document.querySelector('.content');

    // atualiza o próximo bloco de conteúdo
    currentIndex = (currentIndex + 1) % contentBlocks.length;

    // determina o conteúdo novo
    contentDiv.innerHTML = contentBlocks[currentIndex];
}