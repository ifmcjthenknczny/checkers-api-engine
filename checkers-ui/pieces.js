function crownTheQueen(piece) {
    // adds class piece--queen for piece parameter and div child with class of piece--queen-decoration
    piece.classList.add("piece--queen");
    const queenDecoration = document.createElement("div");
    queenDecoration.classList.add("piece--queen-decoration");
    piece.appendChild(queenDecoration);
}

export {crownTheQueen}