import React from "react";
import styles from "./Identity.module.scss";

const Identity = (props) => {
  const identityHeaders = props.categories.map((category, index) => (
    <span key={index} className={styles.identityHeader}>
      {category.title}
    </span>
  ));

  const identityRows = props.data.map((item, index) => (
    <div key={index} className={styles.identityDataRow}>
      {props.categories.map((category, index) => (
        <span key={index} className={styles.identityDataField}>
          {item[category.field]}
        </span>
      ))}
    </div>
  ));

  return (
    <div className={styles.identityTable}>
      <div className={styles.identityHeadersRow}>{identityHeaders}</div>
      <div className={styles.identityDataBody}>{identityRows}</div>
    </div>
  );
};

Identity.displayName = "Identity";

export default Identity;
