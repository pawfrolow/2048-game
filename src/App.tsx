/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    cellsEqual,
    getDefaultCell,
    getNewCellNumber,
    randomIntFromArray,
    checkOpenWay,
    getMerged,
    checkPossibleMoves,
    detectMobile,
    throttle,
    nextTargetIndex,
    checkFinalIndex,
} from "./utils";
import { Cell, Controls, GameField, GithubLink, Header } from "./components";
import { useEvent, useSwipe } from "./hooks";
import { CellStateType, DirectionsType } from "./types";
import config from "./config";
import "./styles/app.scss";

const App = () => {
    const appRef = useRef<HTMLDivElement | null>(null);
    const [cells, setCells] = useState<CellStateType[]>(
        [...Array(16)].map(getDefaultCell)
    );
    const [score, setScore] = useState(0);
    const [isGameOver, setGameOver] = useState(false);

    const keyHandler = (e: KeyboardEvent) => {
        config.directions.forEach((direction) => {
            if (e.key.toLowerCase() === `arrow${direction}`) {
                move(direction as DirectionsType);
            }
        });
    };

    const swipeHandler = (direction: DirectionsType) => {
        if (!detectMobile()) return;
        move(direction);
    };

    useEvent("keydown", keyHandler);

    useSwipe(swipeHandler);

    useEvent(
        "resize",
        throttle(() => {
            const isClassMobile =
                document.body.classList.contains("mobile-device");
            if (detectMobile() && !isClassMobile) {
                document.body.classList.add("mobile-device");
            }

            if (!detectMobile() && isClassMobile) {
                document.body.classList.remove("mobile-device");
            }
        }, 50)
    );

    useEffect(() => {
        initBoard();
        if (detectMobile()) {
            document.body.classList.add("mobile-device");
        }
    }, []);

    const initBoard = () => {
        const indexOne = randomIntFromArray(cells.map((cell) => cell.value));
        const indexTwo = randomIntFromArray(
            cells.map((cell, index) => (index === indexOne ? 1 : cell.value))
        );

        let result: CellStateType[] = JSON.parse(JSON.stringify(cells));
        result[indexOne].value = getNewCellNumber();
        result[indexTwo].value = getNewCellNumber();

        setCells(result);
    };

    const clearBoard = () => {
        setCells(cells.map((cell) => ({ id: cell.id, value: 0 })));
    };

    const handleNewGame = useCallback(() => {
        setScore(0);
        setGameOver(false);

        setTimeout(() => {
            clearBoard();
            initBoard();
        }, 100);
    }, []);

    const updateCells = (result: CellStateType[], scoreChange: number) => {
        if (cellsEqual(result, cells)) {
            if (
                result.every((cell) => cell.value > 0) &&
                !checkPossibleMoves(result)
            ) {
                setGameOver(true);
            }
            return;
        }

        result.forEach((elem) => {
            delete elem.merged;
        });
        if (scoreChange > 0) {
            setScore(score + scoreChange);
        }
        setCells(result);
        setTimeout(() => {
            let newCells: CellStateType[] = JSON.parse(JSON.stringify(result));
            newCells[
                randomIntFromArray(newCells.map((cell) => cell.value))
            ].value = getNewCellNumber();
            setCells(newCells);
        }, 100);
    };

    const move = (direction: DirectionsType) => {
        const targetChunk = config.targetChunks[direction];
        let result: CellStateType[] = JSON.parse(JSON.stringify(cells));
        let scoreChange = 0;

        const transferCells = (targetIndex: number) => {
            for (
                let i = nextTargetIndex(direction, targetIndex);
                checkFinalIndex(direction, i, targetIndex);
                i = nextTargetIndex(direction, i)
            ) {
                if (
                    !result[i] ||
                    !checkOpenWay(targetIndex, i, result, direction)
                )
                    return;

                if (result[i].value === 0) continue;

                const isEqual = result[i].value === result[targetIndex].value;
                const isMerged = result[targetIndex].merged || result[i].merged;
                const isNeedMerge = isEqual && !isMerged;

                if (isNeedMerge) {
                    result[targetIndex] = getMerged(result[i]);
                    result[i] = getDefaultCell();
                    scoreChange += result[targetIndex].value;
                    continue;
                }

                const isTargetEmpty = result[targetIndex].value === 0;

                if (isTargetEmpty) {
                    [result[targetIndex], result[i]] = [
                        result[i],
                        result[targetIndex],
                    ];
                    continue;
                }

                if (!isTargetEmpty) {
                    transferCells(nextTargetIndex(direction, targetIndex));
                }
            }
        };

        targetChunk.forEach(transferCells);

        updateCells(result, scoreChange);
    };

    return (
        <div className="app" ref={appRef}>
            <Header />
            <Controls handleNewGame={handleNewGame} score={score} />
            <GameField isGameOver={isGameOver}>
                {cells.map((cell, index) => {
                    return (
                        <Cell key={cell.id} value={cell.value} index={index} />
                    );
                })}
            </GameField>
            <GithubLink />
        </div>
    );
};

export default App;
