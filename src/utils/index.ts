import config from "../config";
import { CellStateType, DirectionsType } from "../types";
import { Directions } from "../types/enums";

export function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export const getNewCellNumber = () => {
    const percent = Math.floor(Math.random() * 100);
    return percent < 11 ? 4 : 2;
};

export const randomIntFromArray = (array: number[]) => {
    const indexNullArray = array
        .map((item, index) => (item === 0 ? index : undefined))
        .filter((item) => item !== undefined) as number[];
    const randomIndex = getRandomArbitrary(0, indexNullArray.length);
    return indexNullArray[randomIndex];
};

export function chunk<T>(arr: T[], len: number) {
    let chunks = [],
        i = 0,
        n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
    }
    return chunks;
}

export const generateId = (mask = "xxxxxxxxxx", map = "0123456789abcdef") => {
    const length = map.length;
    return mask.replace(/x/g, () => map[Math.floor(Math.random() * length)]);
};

export function cellsEqual(a1: CellStateType[], a2: CellStateType[]) {
    for (let i = 0; i < a1.length; i++) {
        if (a1[i].value !== a2[i].value) return false;
        if (a1[i].id !== a2[i].id) return false;
    }

    return true;
}

export const checkOpenWay = (
    target: number,
    current: number,
    array: CellStateType[],
    direction: DirectionsType
) => {
    switch (direction) {
        case Directions.up: {
            for (let i = current - 4; i > target; i -= 4) {
                if (array[i]?.value > 0) return false;
            }
            break;
        }
        case Directions.right: {
            for (let i = current + 1; i < target; i++) {
                if (array[i]?.value > 0) return false;
            }
            break;
        }
        case Directions.down: {
            for (let i = current + 4; i < target; i += 4) {
                if (array[i]?.value > 0) return false;
            }
            break;
        }
        case Directions.left: {
            for (let i = current - 1; i > target; i--) {
                if (array[i]?.value > 0) return false;
            }
            break;
        }
    }

    return true;
};

export const getDefaultCell = () => ({
    id: generateId(),
    value: 0,
});

export const getMerged = (cell: CellStateType) => ({
    ...cell,
    value: cell.value * 2,
    merged: true,
});

export const checkPossibleMoves = (cells: CellStateType[]) => {
    let check = false;
    for (let i = 0; i < cells.length; i++) {
        if (
            (cells[i].value === cells[i + 1]?.value &&
                ![3, 7, 11].includes(i)) ||
            (cells[i].value === cells[i - 1]?.value &&
                ![4, 8, 12].includes(i)) ||
            cells[i].value === cells[i + 4]?.value ||
            cells[i].value === cells[i - 4]?.value
        ) {
            check = true;
        }
    }
    return check;
};

export function detectMobile() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];

    return (
        toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        }) || window.innerWidth < 516
    );
}

export function throttle(callback: any, limit: number) {
    var waiting = false; // Initially, we're not waiting
    return function (this: void) {
        // We return a throttled function
        if (!waiting) {
            // If we're not waiting
            callback.apply(this, arguments); // Execute users function
            waiting = true; // Prevent future invocations
            setTimeout(function () {
                // After a period of time
                waiting = false; // And allow future invocations
            }, limit);
        }
    };
}

export const nextTargetIndex = (
    direction: DirectionsType,
    targetIndex: number
) => {
    switch (direction) {
        case Directions.up: {
            return targetIndex + 4;
        }
        case Directions.right: {
            return targetIndex - 1;
        }
        case Directions.down: {
            return targetIndex - 4;
        }
        case Directions.left: {
            return targetIndex + 1;
        }
    }
    return targetIndex;
};

export const checkFinalIndex = (
    direction: DirectionsType,
    currentIndex: number,
    targetIndex: number
) => {
    switch (direction) {
        case Directions.up: {
            return currentIndex <= targetIndex + 12;
        }
        case Directions.right: {
            const targetChunk = config.targetChunks[direction];
            const callback = (elem: number) => targetIndex <= elem;
            return currentIndex >= targetChunk.filter(callback)[0] - 3;
        }
        case Directions.down: {
            return currentIndex >= targetIndex - 12;
        }
        case Directions.left: {
            const targetChunk = config.targetChunks[direction];
            const callback = (elem: number) => targetIndex >= elem;
            return (
                currentIndex <= targetChunk.filter(callback).reverse()[0] + 3
            );
        }
    }
    return targetIndex;
};
