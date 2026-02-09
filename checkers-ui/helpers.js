function range(size, startAt = 0) {
    if (typeof startAt === "string" && startAt.length === 1) return String.fromCharCode(...range(size, startAt.charCodeAt(0))).split(
        ""
    );
    else if (typeof startAt === "number") return [...Array(size).keys()].map((i) => i + startAt);
    else return;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fadeIn(elementSelector, time) {
    let opacity = 0;
    const element = document.querySelector(elementSelector);
    element.style.opacity = opacity;
    const deltaOpacity = 0.04;
    while (opacity <= 1) {
        await sleep(time * deltaOpacity);
        opacity = opacity + deltaOpacity;
        element.style.opacity = opacity;
    }
}

function getSquareColAndRow(square) {
    let [col, ...row] = square.id;
    row = +row.join("");
    return [col, row];
}

function createDiagonalIterable(startIndex, targetIndex) {
    return startIndex < targetIndex ?
        range(targetIndex - startIndex, startIndex + 1) :
        range(startIndex - targetIndex, targetIndex).reverse();
}

const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

export {range, sleep, fadeIn, getSquareColAndRow, createDiagonalIterable, chunkArray}

