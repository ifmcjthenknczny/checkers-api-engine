import {BOARD_SIZE, cols, rows} from './config.js'

function generateBoard(size) {
    // start from creating black square, creates sections for DOM, adds appropriate class
    let whiteSquare = false;
    const main = document.querySelector("main");
    const grid = document.createElement("section");
    grid.classList.add("board");
    // divides grid for given board size
    grid.style.gridTemplateColumns = `0.2fr repeat(${size}, 1fr`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr) 0.2fr`;
    // sets order of rows and cols depending on board orientation
    const rowOrder = [...rows].reverse();
    const colOrder = [...cols];
    // for every new row, change color of first sqaure, create square with name and append it as first
    for (let rowName of rowOrder) {
        whiteSquare = !whiteSquare;
        const squareWithName = document.createElement("div");
        squareWithName.classList.add(
            "grid__square--name-row",
            "grid__square--name"
        );
        squareWithName.innerText = rowName;
        grid.append(squareWithName);
        // loop over cols and create board squares with id, classname and classname if its white or black and approprriate event
        for (let colName of colOrder) {
            const square = document.createElement("div");
            const nameOfSquare = `${colName + rowName}`;
            square.classList.add("grid__square");
            square.setAttribute("id", nameOfSquare);
            if (whiteSquare) {
                square.classList.add("grid__square--white");
            } else {
                square.classList.add("grid__square--black");
            }
            // append square and change color of squares between cols
            grid.appendChild(square);
            whiteSquare = !whiteSquare;
        }
    }
    // create empty element at the corner and all column name squares under the board
    grid.append(document.createElement("div"));
    for (let colName of colOrder) {
        const squareWithName = document.createElement("div");
        squareWithName.classList.add(
            "grid__square--name-col",
            "grid__square--name"
        );
        squareWithName.innerText = colName;
        grid.append(squareWithName);
    }
    // append grid to main and main to DOM
    main.appendChild(grid);
    document.body.insertBefore(
        main,
        document.querySelector(".captured-pieces--bottom")
    );
    return grid;
}

function jsonPieceToHtml(value) {
    if (value === 0) return null;

    const piece = document.createElement('div');
    piece.classList.add('piece');

    if (value > 0) {
        piece.classList.add('piece--white');
    } else {
        piece.classList.add('piece--black');
    }

    if (Math.abs(value) === 3) {
        piece.classList.add('piece--queen');
    } else {
        piece.classList.add('piece--pawn');
    }

    return piece;
}

function renderJsonToHtml(boardData) {
    const board = document.querySelector('.board');
    if (!board) {
        generateBoard(BOARD_SIZE)
    }

    const relevantSquares = [...board.children].filter(element => 
        !element.className.includes('grid__square--name') && 
        element.className.includes('grid__square') && 
        !element.className.includes('grid__square--white')
    );

    const chunks = [];
    for (let i = 0; i < boardData.length; i += 8) {
        chunks.push(boardData.slice(i, i + 8));
    }
    
    const dataForDom = chunks.reverse().flat();

    relevantSquares.forEach((square, index) => {
        square.innerHTML = '';
        
        const pieceValue = dataForDom[index];
        const pieceElement = jsonPieceToHtml(pieceValue);
        
        if (pieceElement) {
            square.appendChild(pieceElement);
        }
    });
}

export {generateBoard}