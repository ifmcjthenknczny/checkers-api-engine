function promotion(piece) {
    // checks if piece is already a queen (if yes, return false) and its color and grabs its square row
    if (piece.classList.contains("piece--queen")) return false;
    const isWhite = piece.classList.contains("piece--white") ? true : false;
    let [, clickedPieceRow] = getSquareColAndRow(piece.parentElement);
    // checks if row number of piece's square is last for white or first for black - if yes, returns true, else returns false
    if (
      (isWhite && clickedPieceRow === rows[rows.length - 1]) ||
      (!isWhite && clickedPieceRow === rows[0])
    )
      return true;
    return false;
  }


//   TODO: make isGameOver and determineWinner into a single function
  function isGameOver() {
    // checks if requirements for game ending occured - is player about to move have any pieces, if has any possible moves or there were 30 moves of queens without any capture in a row, if nothing of these, return false
    const selector = isWhiteToMove ? ".piece--white" : ".piece--black";
    const stillPieces = document.querySelectorAll(selector).length;
    if (stillPieces === 0) return true;
    if (Object.keys(findAllLegalMoves(isWhiteToMove)).length === 0) return true;
    if (queenMovesWithoutCaptureCount >= 30) return true;
    return false;
  }

  function determineWinner() {
    // determines who wins by if it has any moves or any pieces left, else it is draw - null
    let winnerWhite = null;
    if (
      !document.querySelector(".piece--black") ||
      (!!document.querySelector(".piece--black") &&
        Object.keys(findAllLegalMoves(false)).length === 0 &&
        !isWhiteToMove)
    )
      winnerWhite = true;
    else if (
      !document.querySelector(".piece--white") ||
      (!!document.querySelector(".piece--white") &&
        Object.keys(findAllLegalMoves(true)).length === 0 &&
        isWhiteToMove)
    )
      winnerWhite = false;
    return winnerWhite;
  }

  function removeCapturedPiece(square) {
    // checks the color of piece on given square parameter and if it is queen, then removes it, then adds to the appropriate graveyard
    const isQueen = square.firstChild.classList.contains("piece--queen");
    const isPieceWhite = square.firstChild.classList.contains("piece--white");
    square.firstChild.remove();
    addPieceToGraveyard(isPieceWhite, isQueen);
  }

  async function endTurn() {
    // change the move turn to other piece color, reset move-connected variables
    isWhiteToMove = !isWhiteToMove;
    pieceAboutToChainCapture = null;
    forbiddenDirectionForQueenCapture = [null, null];
    // if it is end of game, do what you gotta do when game ends
    if (isGameOver()) {
      gamesPlayedCount++;
      const willPlayAgain = gamesPlayedCount < MAX_GAMES_TO_PLAY;
      const hasWhiteWon = congratsToWinner();
      saveGameToJson(gameBoardsHistory, hasWhiteWon, !willPlayAgain);
      if (willPlayAgain) {
        resetGame();
      } else {
        alert("ALL GAMES PLAYED");
      }
    }
    // if not, change top bar and if it computer's turn, make a move
    else {
      changeGameInfo();
      gameBoardsHistory.push(htmlBoardToJson());
      computerMove();
    }
  }