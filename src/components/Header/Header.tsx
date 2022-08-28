import React, { FC } from "react";
import styles from "./style.module.scss";

const Header: FC = () => {
    return <h1 className={styles.title}>2048</h1>;
};

export default Header;
