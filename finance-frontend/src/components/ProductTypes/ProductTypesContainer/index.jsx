import React from "react";

import styles from "./index.module.scss";

const TypeContainer = (props) => (
  <div className={styles.container}>
    <h4 className={styles.header}>{props.productType}</h4>
    {props.children}
  </div>
);

TypeContainer.displayName = "TypeContainer";

export default TypeContainer;
