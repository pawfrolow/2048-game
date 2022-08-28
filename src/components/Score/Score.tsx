import React from "react";
import styles from "./style.module.scss";

type ScoreType = {
    score: number;
    title?: string;
};

const Score: React.FC<ScoreType> = ({ score, title = "Score" }) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>{title}</div>
            <div className={styles.score}>{score}</div>
        </div>
    );
};

export default Score;
