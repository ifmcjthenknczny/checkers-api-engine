function pickRandomMove(legalMoves) {
    const piecesThatCanMove = Object.keys(legalMoves);
    const nameOfSquareOfPieceToMove = piecesThatCanMove[Math.floor(Math.random() * piecesThatCanMove.length)];
    const pieceToMove = document.querySelector(`#${nameOfSquareOfPieceToMove}`)?.firstElementChild;
    const possibleMoves = legalMoves[nameOfSquareOfPieceToMove];
    const targetSquare =
        possibleMoves.length === 1 ?
        possibleMoves[0] :
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    return [pieceToMove, targetSquare];
}

export {pickRandomMove as pickAMove}