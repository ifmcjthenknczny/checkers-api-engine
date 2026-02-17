import {
  range,
  sleep,
  fadeIn,
  getSquareColAndRow,
  createDiagonalIterable,
} from "./helpers.js";
import { pickAMove } from "./ai.js";
import { saveGameToJson, createJsonFile, htmlBoardToJson } from "./gameData.js";
import { generateBoard } from "./board.js";
import {
  MAX_GAMES_TO_PLAY,
  BOARD_SIZE,
  cols,
  rows,
  MOVE_ANIMATION_DURATION_MS,
} from "./config.js";
import { crownTheQueen } from "./pieces.js";

// TODO: this code should be more readable

async function computerMove() {
  // declares variables which values are about to be determined. if it is not between multiple, chained captures - pick a piece and move from all computer pieces, else randomly pick a capture of only this piece which is inbetween captures
  let pieceToMove, targetSquare;
  if (!pieceAboutToChainCapture) {
    [pieceToMove, targetSquare] = pickAMove(findAllLegalMoves(isWhiteToMove));
  } else {
    pieceToMove = pieceAboutToChainCapture;
    const legalCaptures = legalCapturesOfPiece(pieceToMove);
    targetSquare =
      legalCaptures[Math.floor(Math.random() * legalCaptures.length)];
  }
  // set queen-connected variables, remove piece if it was a capture, animate piece move and wait for animation to finish
  setQueenVariables(pieceToMove, targetSquare);
  if (isForcedCapture)
    removeCapturedPiece(
      findSquareOfAPieceToCapture(pieceToMove.parentElement, targetSquare),
    );
  movePiece(
    pieceToMove.parentElement,
    targetSquare,
    MOVE_ANIMATION_DURATION_MS,
  );
  await sleep(MOVE_ANIMATION_DURATION_MS);
  // piece can capture again then set chainedCapturePiece to this piece, so it will move again and call computerMove again, else check fro promotion and endTurn
  if (isForcedCapture && legalCapturesOfPiece(pieceToMove).length > 0) {
    pieceAboutToChainCapture = pieceToMove;
    computerMove();
  } else {
    if (promotion(pieceToMove)) {
      crownTheQueen(pieceToMove);
    }
    await endTurn();
  }
}

function setQueenVariables(pieceToMove, targetSquare) {
  // checks if clicked piece is a queen and is about to capture - and sets onlyQueenMovesWithoutCapture accordingly, as well as setting the direction in which queen can't capture in next chained move
  const isQueen = pieceToMove.classList.contains("piece--queen");
  isQueen && !isForcedCapture
    ? queenMovesWithoutCaptureCount++
    : (queenMovesWithoutCaptureCount = 0);
  forbiddenDirectionForQueenCapture =
    isQueen && isForcedCapture
      ? findQueenCaptureForbiddenDirection(
          pieceToMove.parentElement,
          targetSquare,
        )
      : [null, null];
}



function changeGameInfo() {
  // changes class of text, for white's move is whiter, for black's is blacker
  const whoToMove = document.querySelector(".game-info__who-to-move span");
  whoToMove.classList.toggle("white");
  // change text, if white are to move, change turn counter as well
  if (isWhiteToMove) {
    document.querySelector(".game-info__turn-counter span").innerText =
      ++turnNumber;
    whoToMove.innerText = "White";
  } else whoToMove.innerText = "Black";
}

function addPieceToGraveyard(isPieceWhite, isQueen) {
  // creates mini piece with given classes and adds it to appropriate graveyard zone
  const pieceMini = document.createElement("div");
  if (isQueen) pieceMini.classList.add("mini-piece--queen");
  else
    isPieceWhite
      ? pieceMini.classList.add("mini-piece--white")
      : pieceMini.classList.add("mini-piece--black");
  pieceMini.classList.add("mini-piece");
  const targetGraveyard = isPieceWhite
    ? ".captured-pieces--top"
    : ".captured-pieces--bottom";
  document.querySelector(targetGraveyard).appendChild(pieceMini);
}



function setEndOfGameAppearance(winnerWhite, forWhite) {
  // do not change if it is draw or the player for which it is set has no pieces left, set piece selector and class modifier depending and on if it is for winner
  if (winnerWhite === null) return;
  const pieceSelector = forWhite ? ".piece--white" : ".piece--black";
  const resultClassModifier =
    (forWhite && winnerWhite) || (!forWhite && !winnerWhite) ? "won" : "lost";
  const pieces = [...document.querySelectorAll(pieceSelector)];
  if (pieces.length === 0) return;
  // picks all player pieces and gives appropriate classes for them and queens and strips from hover effects
  for (let piece of pieces) {
    piece.classList.remove("piece-hover");
    piece.classList.add(`piece--${resultClassModifier}`);
  }
  const queens = pieces.filter((piece) =>
    piece.classList.contains("piece--queen"),
  );
  for (let queen of queens) {
    const crown = queen.firstChild;
    crown.classList.remove("piece--queen-decoration");
    crown.classList.add("piece--queen-decoration-won");
  }
}

function congratsToWinner() {
  // determines the winner, selects top left corner game info and changes text, set classes for pieces left depending on who won
  const hasWhiteWon = determineWinner();
  const whoToMove = document.querySelector(".game-info__who-to-move");
  switch (hasWhiteWon) {
    case true:
      whoToMove.innerHTML = '<span class="white">White</span> won!';
      break;
    case false:
      whoToMove.innerHTML = "<span>Black</span> won!";
      break;
    case null:
      whoToMove.innerHTML = "It is a <span>Draw</span>!";
  }
  for (let forWhite of [true, false]) {
    setEndOfGameAppearance(hasWhiteWon, forWhite);
  }
  return hasWhiteWon;
}

function resetGlobalVariables() {
  // resets all global variables to initial level
  isWhiteToMove = true;
  turnNumber = 1;
  isForcedCapture = false;
  queenMovesWithoutCaptureCount = 0;
  pieceAboutToChainCapture = null;
  forbiddenDirectionForQueenCapture = [null, null];
  gameBoardsHistory = [];
}

function generateGraveyards() {
  // generates two sections for captured pieces
  const graveyardTop = document.createElement("section");
  const graveyardBottom = document.createElement("section");
  for (let graveyard of [graveyardTop, graveyardBottom])
    graveyard.classList.add("captured-pieces");
  graveyardTop.classList.add("captured-pieces--top");
  graveyardBottom.classList.add("captured-pieces--bottom");
  document.body.appendChild(graveyardTop);
  document.body.appendChild(graveyardBottom);
}

function generateGameInfo() {
  // generates top bar, above the board, with current information about the game
  const gameInfo = document.createElement("section");
  gameInfo.className = "game-info";
  const whoToMove = document.createElement("section");
  whoToMove.className = "game-info__who-to-move";
  const turnCounter = document.createElement("section");
  turnCounter.className = "game-info__turn-counter";
  whoToMove.innerHTML = '<span class="white">White</span> to move';
  turnCounter.innerHTML = "Turn: <span>1</span>";
  gameInfo.appendChild(whoToMove);
  gameInfo.appendChild(turnCounter);
  document.body.prepend(gameInfo);
}

async function generateTitleWindow() {
  // generates first, title window, waits some time and preoceeds do question window
  const main = document.createElement("main");
  const container = document.createElement("div");
  container.classList.add("container");
  const gameTitle = document.createElement("section");
  gameTitle.classList.add("game-title");
  gameTitle.innerText = "Warcaby";
  const author = document.createElement("section");
  author.classList.add("author");
  author.innerText = "created by Maciej Konieczny";
  container.appendChild(gameTitle);
  container.appendChild(author);
  main.appendChild(container);
  document.body.appendChild(main);
  fadeIn(".container", 300);
  await sleep(1_000);
  container.remove();
  main.innerHTML = "";
  await createJsonFile();
  startGame();
}

async function startGame() {
  // animation, generate board, pieces and everything around it and if computer plays white - wait a second and make him move
  fadeIn("body", 200);
  generateGraveyards();
  generateBoard(BOARD_SIZE);
  generateGameInfo();
  generateStartingPosition(document.querySelector(".board"));
  computerMove();
}

// TODO: make it an object "gameState"
// globals
let turnNumber = 1;
let isForcedCapture = false;
let isWhiteToMove = true;
let queenMovesWithoutCaptureCount = 0;
let pieceAboutToChainCapture = null;
let forbiddenDirectionForQueenCapture = [null, null];
let gameBoardsHistory = [];
let gamesPlayedCount = 0;

generateTitleWindow();
