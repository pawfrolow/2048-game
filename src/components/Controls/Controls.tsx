import React from "react";
import Score from "../Score/Score";
import styles from "./style.module.scss";

type ControlsType = {
    handleNewGame: () => void;
    score: number;
};

const Controls: React.FC<ControlsType> = ({ handleNewGame, score }) => {
    return (
        <div className={styles.row}>
            <button className={styles["new-game"]} onClick={handleNewGame}>
                New game
            </button>
            <Score score={score} />
        </div>
    );
};

export default Controls;
