// Criteria:
// 1. Between min and max.
// 2. Only one strong move.
export function shuffle(list, max, min = 1) {
    const shuffledList = [];
    let randomMove;
    for (let i = 0; i < randomIntBetween(min, max); i++) {
        randomMove = list[randomIntBetween(0, list.length - 1)];
        shuffledList.push(randomMove);
    }
    return shuffledList;
}

function randomIntBetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
