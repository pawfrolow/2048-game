const targetChunks = {
    up: [0, 1, 2, 3],
    right: [3, 7, 11, 15],
    down: [12, 13, 14, 15],
    left: [0, 4, 8, 12],
};

const directions = ["up", "right", "down", "left"];

const config = {
    targetChunks,
    directions,
};

export default Object.freeze(config);
