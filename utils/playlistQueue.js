const queue = [];
let position = -1;

// First In First Out.
export default {
    current: () => {
        return queue[position];
    },
    next: () => {
        if (position < queue.length) {
            position++;
            return queue[position];
        }
        return null;
    },
    add: (element) => {
        queue.push(element);
    },
    isEmpty: () => {
        return queue.length === 0;
    }
}

/*
playlistQueue.add({
    combo: [],
    gapTime: INTRO_TIME
});
playlistQueue.add({
    combo: shuffle(moveSoundList, COMBO_MAX, COMBO_MIN),
    gapTime: COMBO_GAP_TIME
});
console.log('my queue works', playlistQueue.next());
*/
