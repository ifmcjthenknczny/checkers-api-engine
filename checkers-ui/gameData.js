import { chunkArray } from "./helpers.js";

const API_BASE = 'http://localhost:3001';

function htmlElementToJsonPiece(element) {
    const elementChildren = element.children
    if (!elementChildren.length) {
        return 0
    }
    const firstChildClasslist = [...elementChildren[0].classList]
    if (firstChildClasslist.includes('piece--white')) {
        return firstChildClasslist.includes('piece--queen') ? 3 : 1
    }
    return firstChildClasslist.includes('piece--queen') ? -3 : -1
}

function htmlBoardToJson() {
    const board = document.querySelector('.board')
    const relevantSquares = [...board?.children ?? []].filter(element => !element.className.includes('grid__square--name') && element.className.includes('grid__square') && !element.className.includes('grid__square--white'))
    const mappedSquares = chunkArray(relevantSquares, 8).reverse().flat()
    return mappedSquares.map(square => htmlElementToJsonPiece(square))
}

function mapResultToJson(hasWhiteWon) {
    if (hasWhiteWon === true) {
        return 1
    }
    if (hasWhiteWon === null) {
        return 0
    }
    return -1
}

async function createJsonFile() {
    await fetch(`${API_BASE}/api/game-history/start`, { method: 'POST' });
}

function saveGameToJson(boards, hasWhiteWon, isLastGame, dropCount = 0) {
    const result = mapResultToJson(hasWhiteWon)
    const entries = boards.slice(dropCount).map((board, index) => ({ board, result, move: index + dropCount % 2 ? 1 : -1 }))
    fetch(`${API_BASE}/api/game-history/append`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries, isLastGame }),
    });
}

export { saveGameToJson, createJsonFile, htmlBoardToJson }
