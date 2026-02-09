import { generateBoard } from "./board.js";
import { BOARD_SIZE } from "./config.js";
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

const filesOddRank = ["b", "d", "f", "h"]; // rank 1,3,5,7
const filesEvenRank = ["a", "c", "e", "g"]; // rank 2,4,6,8

const indexToSquare = (index) => {
  const rank = Math.floor(index / 4) + 1;
  const fileIndex = index % 4;
  const files = rank % 2 === 1 ? filesEvenRank : filesOddRank;
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

  const chunks = [];
  for (let i = 0; i < boardData.length; i += 8) {
    chunks.push(boardData.slice(i, i + 8));
  }

  const dataForDom = chunks.reverse().flat();

  const originalInputSquares = [];

  relevantSquares.forEach((square, index) => {
    const originalIndex = boardData.length - 1 - index;
    const originalSquareName = indexToSquare(originalIndex);

    originalInputSquares.push(originalSquareName);

    console.log({
      domIndex: index,
      originalIndex,
      originalSquare: originalSquareName,
      piece: dataForDom[index],
    });

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
// renderJsonToHtml([0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,1,0,0,-3,-1,0,0,0,1,0,0,0,0,-1,-1,0,0])
renderJsonToHtml([
  -1, -1, -1, -1, -1, -1, 0, 0, -1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, -3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 1,
]);

// najpierw 2, potem 1, potem 4, potem 3... wtf?!?
