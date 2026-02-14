import { generateBoard } from "./board.js";
import { BOARD_SIZE } from "./config.js";
import { chunkArray } from "./helpers.js";
import { crownTheQueen } from "./pieces.js";

function jsonPieceToHtml(value) {
  if (value === 0) return null;

  const piece = document.createElement("div");
  piece.classList.add("piece");

  if (value > 0) {
    piece.classList.add("piece--white");
  } else {
    piece.classList.add("piece--black");
  }

  if (Math.abs(value) === 3) {
    piece.classList.add("piece--queen");
    crownTheQueen(piece);
  } else {
    piece.classList.add("piece--pawn");
  }

  return piece;
}

const filesEvenRank = ["b", "d", "f", "h"]; // rank 2,4,6,8
const filesOddRank = ["a", "c", "e", "g"]; // rank 1,3,5,7

// TODO: check if this rendering JSON to HTML is working how, especially indexToSquare function
const indexToSquare = (index) => {
  const rank = Math.floor(index / (BOARD_SIZE / 2)) + 1;
  const fileIndex = rank % 4;
  const files = rank % 2 === 1 ? filesOddRank : filesEvenRank;
  return `${files[fileIndex]}${rank}`;
};

function renderJsonToHtml(boardData) {
  const board = document.querySelector(".board");
  if (!board) {
    generateBoard(BOARD_SIZE);
  }

  const relevantSquares = [...(board?.children || [])].filter(
    (element) =>
      !element.className.includes("grid__square--name") &&
      element.className.includes("grid__square") &&
      !element.className.includes("grid__square--white"),
  );

  const chunkedSquares = chunkArray(relevantSquares, BOARD_SIZE / 2)

  const dataForDom = chunkedSquares.toReversed().flat();

  const originalInputSquares = [];

  relevantSquares.forEach((square, index) => {
    const originalIndex = boardData.length - 1 - index;
    const originalSquareName = indexToSquare(originalIndex);

    originalInputSquares.push(originalSquareName);

    // console.log({
    //   domIndex: index,
    //   originalIndex,
    //   originalSquare: originalSquareName,
    //   piece: dataForDom[index],
    // });

    square.innerHTML = "";

    const pieceValue = dataForDom[index];
    const pieceElement = jsonPieceToHtml(pieceValue);

    if (pieceElement) {
      square.appendChild(pieceElement);
    }
  });
}
// TODO: add position viewer page (with possibility to move pawns, paste input or translate current position on board to json input (with info who is to move) along with position engine)
generateBoard(BOARD_SIZE);
renderJsonToHtml([1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])