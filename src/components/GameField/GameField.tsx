import React, { FC, ReactNode } from "react";
import CellTemplate from "../CellTemplate/CellTemplate";
import GameOver from "../GameOver/GameOver";
import styles from "./style.module.scss";

type GameFieldType = {
    isGameOver: boolean;
    children: ReactNode;
};

const cells = [...Array(16)];

const GameField: FC<GameFieldType> = ({ isGameOver, children }) => {
    return (
        <div className={styles["game-field"]}>
            {isGameOver && <GameOver />}
            {cells.map((_, index) => (
                <CellTemplate key={`template-cell-${index}`} />
            ))}
            {children}
        </div>
    );
};

export default GameField;
