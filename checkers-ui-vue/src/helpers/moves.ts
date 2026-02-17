import type { BoardPosition, SquareContentExtended, PlayerOnMove } from "../types";
import { findRelativeDiagonalCoords, getSquareIndex } from "./board";

type Capture = {
    startSquareIndex: number
    targetSquareIndex: number
    capturedPieceIndex: number
}

const legalCapturesOfPiece = (piece: SquareContentExtended, board: BoardPosition) => {
    if (piece.isEmpty) {
        return []
    }
    if (piece.isQueen) {

    }
    const captures: Capture[] = []

    const squaresToBeAfterCapture = findRelativeDiagonalCoords({row: piece.row, col: piece.col}, 2)
    const squaresWithPossiblePiecesToCapture = findRelativeDiagonalCoords({row: piece.row, col: piece.col}, 1)

    const possibleCapturesAnalyses = squaresWithPossiblePiecesToCapture.map((square, index) => ({
        victim: square,
        landing: squaresToBeAfterCapture[index]
    }));

    for (const squarePair of possibleCapturesAnalyses) {
        const captureSquareIndex = getSquareIndex(s[index].row, squaresToBeAfterCapture[index].col)
        const capturedPieceSquareIndex = getSquareIndex(squaresWithPossiblePiecesToCapture[index].row, squaresWithPossiblePiecesToCapture[index].col)

        const squareContent = board[index]
        if (squareContent.isEmpty) {
            captures.push({
                startSquareIndex: piece.index,
                targetSquareIndex: index,
                capturedPieceIndex: undefined
            })
        }
    }





    for (const coord of diagonalCoords) {
        const squareContent = board[getSquareIndex(coord.row, coord.col)]
    }
}

const findAllLegalMoves = (board: BoardPosition, piecesColor: PlayerOnMove) => {
    const legalMoves = {}
    // const piecesOfGivenColor =
    const hasCapturePossibility = isThereACapturePossibility(board, piecesColor)
}

function isThereACapturePossibility() {
    // selects all pieces that are about to move and checks if any of them can capture another piece, returns true/false
    const selector = isWhiteToMove ? ".piece--white" : ".piece--black";
    const allColorPieces = document.querySelectorAll(selector);
    for (let piece of allColorPieces) {
      if (legalCapturesOfPiece(piece).length > 0) {
        isForcedCapture = true;
        return true;
      }
    }
    isForcedCapture = false;
    return false;
  }

function findQueenCaptureForbiddenDirection(startSquare, targetSquare) {
    // returns forbidden direction for queen to capture (she can't come back very next chained capture) in form of true-false array
    // true is for increasing, false for decreasing value of rows/cols
    let [startCol, startRow] = getSquareColAndRow(startSquare);
    let [targetCol, targetRow] = getSquareColAndRow(targetSquare);
    return [targetCol < startCol, targetRow < startRow];
  }
  
  function findSquareOfAPieceToCapture(startSquare, targetSquare) {
    // loops over diagonal to find piece to remove
    let [startCol, startRow] = getSquareColAndRow(startSquare);
    let [targetCol, targetRow] = getSquareColAndRow(targetSquare);
    const rowIterable = createDiagonalIterable(
      rows.indexOf(startRow),
      rows.indexOf(targetRow),
    );
    const colIterable = createDiagonalIterable(
      cols.indexOf(startCol),
      cols.indexOf(targetCol),
    );
    const classToCapture = isWhiteToMove ? "piece--black" : "piece--white";
    let i = 0;
    // because it is diagonal, both Array.length are equal
    while (i < rowIterable.length) {
      // looks if square has a child if a given class of piece to capture - if it finds it, then returns this sqaure
      const squareName = `${cols[colIterable[i]]}${rows[rowIterable[i]]}`;
      const square = document.querySelector(`#${squareName}`);
      if (
        !!square.firstElementChild &&
        square.firstElementChild.classList.contains(classToCapture)
      )
        return square;
      i++;
    }
  }

  // move rules-related functions
function findAllLegalMoves(forWhite) {
    // selects all pieces of given color
    const selector = forWhite ? ".piece--white" : ".piece--black";
    const allColorPieces = [...document.querySelectorAll(selector)];
    const legalMoves = {};
    // if there is any capture possible, then add to legalMoves object key (square id of piece that can move) and value (its possible moves)
    if (isThereACapturePossibility()) {
      for (let piece of allColorPieces) {
        const legalMovesList = legalCapturesOfPiece(piece);
        if (legalMovesList.length > 0)
          legalMoves[piece.parentElement.id] = legalMovesList;
      }
      // if there are no captures possibles then do the same, but with ordinary moves, every case return
    } else {
      for (let piece of allColorPieces) {
        const legalMovesList = legalNormalMovesOfPiece(piece);
        if (legalMovesList.length > 0)
          legalMoves[piece.parentElement.id] = legalMovesList;
      }
    }
    return legalMoves;
  }
  
  function legalCapturesOfPiece(piece) {
    // gets id of piece's square, color, color it can capture and if it is a queen, change row in case of it is 2-digits
    let [startCol, startRow] = getSquareColAndRow(piece.parentElement);
    const startIndex = rows.indexOf(startRow);
    const isWhite = piece.classList.contains("piece--white") ? true : false;
    const classOfPiece = isWhite ? "piece--white" : "piece--black";
    const classToCapture = isWhite ? "piece--black" : "piece--white";
    const isQueen = piece.classList.contains("piece--queen") ? true : false;
    const possibleSquares = [];
    // checks possibilities in every direction
    for (let rowsIncrease of [true, false]) {
      for (let colsIncrease of [true, false]) {
        if (
          isQueen &&
          forbiddenDirectionForQueenCapture[0] === colsIncrease &&
          forbiddenDirectionForQueenCapture[1] === rowsIncrease
        )
          continue;
        // sets boundaries and increment or decrement for iterable variable
        const colBoundary = colsIncrease ? cols.length - 1 : 0;
        const rowBoundary = rowsIncrease ? rows.length - 1 : 0;
        const deltaCol = colsIncrease ? 1 : -1;
        const deltaRow = rowsIncrease ? 1 : -1;
        // starts not on the square on which given piece is, but one square in diagonal away
        let colIndex = cols.indexOf(startCol) + deltaCol;
        let rowIndex = startIndex + deltaRow;
        // initializes variable that changes to true if it founds piece of color to capture
        let thereIsPieceToCapture = false;
        while (
          rowIndex !== rowBoundary + deltaRow &&
          colIndex !== colBoundary + deltaCol
        ) {
          // loops over diagonal in specified direction by colsIncrease and rowsIncrease until board boundary
          // breaks the loop if it finds piece of the same color
          // if it finds first piece of opposite color, thereIsPieceToCapture is changed to true
          // when thereIsPieceToCapture is true, every free square is added to array which is later returned
          // breaks the loop if it finds another piece, returns after looping over all directions
          const squareName = `${cols[colIndex]}${rowIndex + 1}`;
          const square = document.querySelector(`#${squareName}`);
          const isSquareTaken =
            !!square.firstChild && square.firstChild.classList.contains("piece");
          if (isSquareTaken) {
            if (thereIsPieceToCapture) break;
            else if (square.firstChild.classList.contains(classToCapture))
              thereIsPieceToCapture = true;
            else if (square.firstChild.classList.contains(classOfPiece)) break;
          } else if (!isSquareTaken && thereIsPieceToCapture)
            possibleSquares.push(square);
          colIndex += deltaCol;
          rowIndex += deltaRow;
          // breaks the loops if it is normal piece and its capture movement range has been reached
          if (!isQueen && Math.abs(rowIndex - startIndex) > 2) break;
        }
      }
    }
    return possibleSquares;
  }
  
  function legalNormalMovesOfPiece(piece) {
    // gets id of piece's square, color and whether it is a queen
    let [startCol, startRow] = getSquareColAndRow(piece.parentElement);
    const isQueen = piece.classList.contains("piece--queen") ? true : false;
    const isWhite = piece.classList.contains("piece--white") ? true : false;
    // normal move directions depend on the color of piece and if it is queen - true is case of increasing, false is decreasing
    const rowsIncreasePossible = isQueen
      ? [true, false]
      : isWhite
        ? [true]
        : [false];
    const colsIncreasePossible = [true, false];
    const possibleSquares = [];
    for (let rowsIncrease of rowsIncreasePossible) {
      for (let colsIncrease of colsIncreasePossible) {
        // sets up consts depending on the direction, starting not on the square on which given piece is, but one square in diagonal away
        const colBoundary = colsIncrease ? cols.length - 1 : 0;
        const rowBoundary = rowsIncrease ? rows.length - 1 : 0;
        const deltaCol = colsIncrease ? 1 : -1;
        const deltaRow = rowsIncrease ? 1 : -1;
        let rowIndex = rows.indexOf(startRow) + deltaRow;
        let colIndex = cols.indexOf(startCol) + deltaCol;
        while (
          rowIndex !== rowBoundary + deltaRow &&
          colIndex !== colBoundary + deltaCol
        ) {
          // loops over diagonal in specified direction by colsIncrease and rowsIncrease until board boundary
          // breaks the loop if it finds piece, if not then add to return array
          const squareName = `${cols[colIndex]}${rowIndex + 1}`;
          const square = document.querySelector(`#${squareName}`);
          const isSquareTaken =
            !!square.firstChild && square.firstChild.classList.contains("piece");
          if (isSquareTaken) break;
          else possibleSquares.push(square);
          if (!isQueen) break; // breaks the loop if it is normal piece and can move only one square forward
          colIndex += deltaCol;
          rowIndex += deltaRow;
        }
      }
    }
    return possibleSquares;
  }
  
  // move animation
async function movePiece(startSquare, targetSquare, transitionTimeMs) {
    // block flipping the board, because everything crashes
    // selects piece, squares id and starting and target indexes
    const pieceToMove = startSquare.firstChild;
    const [startCol, startRow] = getSquareColAndRow(startSquare);
    const [targetCol, targetRow] = getSquareColAndRow(targetSquare);
    const [startColIndex, targetColIndex] = [startCol, targetCol].map((x) =>
      cols.indexOf(x),
    );
    const [startRowIndex, targetRowIndex] = [startRow, targetRow].map(
      (x) => x - 1,
    );
    // calculates current square width (with border from two sides), includes positive/negative coefficient because of position of board and calculates transiton in both axis
    const squareWidth =
      +window
        .getComputedStyle(document.querySelector(".grid__square"))
        .width.split("px")[0] +
      2 *
        +window
          .getComputedStyle(document.querySelector(".grid__square"))
          .border.split("px")[0];
    const BOARD_POSITION_COEFF = 1;
    const transX =
      (targetColIndex - startColIndex) * squareWidth * BOARD_POSITION_COEFF;
    const transY =
      (startRowIndex - targetRowIndex) * squareWidth * BOARD_POSITION_COEFF;
    // if another, chained capture will be possible, generate legal move before the actual transition
    if (isForcedCapture) {
      const dummyPiece = pieceToMove.cloneNode(true);
      targetSquare.appendChild(dummyPiece);
      dummyPiece.remove();
    }
    // sets size of piece before changing its position to fixed, set transition and transform properties
    const { width } = pieceToMove.getBoundingClientRect();
    const size =
      width - 2 * +window.getComputedStyle(pieceToMove).border.split("px")[0];
    pieceToMove.style.width = `${size}px`;
    pieceToMove.style.height = `${size}px`;
    pieceToMove.style.transition = `transform ${transitionTimeMs}ms`;
    pieceToMove.style.position = "fixed";
    // translate now fixed-position piece on calculated distance in px and wait until animation finishes
    pieceToMove.style.transform = `translate(${transX}px, ${transY}px)`;
    await sleep(transitionTimeMs);
    // then append piece to the target square, remove all given style and unblock flipping the board
    targetSquare.appendChild(pieceToMove);
    pieceToMove.style.transform = "";
    pieceToMove.style.position = "";
    pieceToMove.style.width = "";
    pieceToMove.style.height = "";
  }