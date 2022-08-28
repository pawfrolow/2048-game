import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { usePrevious } from "../../hooks";
import styles from "./style.module.scss";

type CellType = {
    value: number;
    index: number;
};

const Cell: React.FC<CellType> = ({ value, index }) => {
    const [bounce, setBounce] = useState(false);
    const [zoom, setZoom] = useState(false);
    const prevValue = usePrevious(value);

    useEffect(() => {
        if (prevValue === 0) {
            setZoom(true);
        }

        if (prevValue !== 0 && prevValue !== value) {
            setBounce(true);
        }
    }, [value]);

    useEffect(() => {
        setTimeout(() => {
            setZoom(false);
        }, 200);
    }, [zoom]);

    useEffect(() => {
        setTimeout(() => {
            setBounce(false);
        }, 200);
    }, [bounce]);

    if (value === 0) return null;

    return (
        <div
            className={classNames(
                value === 0 && styles.empty,
                styles.container,
                styles[`cell-${value}`],
                `cell-index-${index}`
            )}
        >
            <div className={classNames(bounce && "bounceIn", zoom && "zoomIn")}>
                {value}
            </div>
        </div>
    );
};

export default Cell;
