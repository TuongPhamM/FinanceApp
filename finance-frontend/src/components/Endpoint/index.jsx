import React, { useState, useContext } from "react";
import Button from "plaid-threads/Button";
import Note from "plaid-threads/Note";

import Table from "../Table";
import Error from "../Error";
import { ErrorDataItem, Data } from "../../dataUtilities";

import styles from "./index.module.scss";
import Context from "../../Context";

const Endpoint = (props) => {
  const [showTable, setShowTable] = useState(false);
  const [transformedData, setTransformedData] = useState < Data > [];
  const [pdf, setPdf] = (useState < string) | (null > null);
  const [error, setError] = (useState < ErrorDataItem) | (null > null);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useContext(Context);

  const getData = async () => {
    setIsLoading(true);
    const access_token = accessToken || localStorage.getItem("access_token");

    const response = await fetch(`/api/${props.endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Correct content type
      },
      body: JSON.stringify({
        access_token: access_token, // Send as JSON
      }),
    }); //fetch data based on product type
    const data = await response.json();
    if (data.error != null) {
      setError(data.error);
      setIsLoading(false);
      return;
    }
    setTransformedData(props.transformData(data)); // transform data into proper format for each individual product
    if (data.pdf != null) {
      setPdf(data.pdf);
    }
    setShowTable(true);
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.endpointContainer}>
        <Note info className={styles.post}>
          POST
        </Note>
        <div className={styles.endpointContents}>
          <div className={styles.endpointHeader}>
            {props.name != null && (
              <span className={styles.endpointName}>{props.name}</span>
            )}
            <span className={styles.schema}>{props.schema}</span>
          </div>
          <div className={styles.endpointDescription}>{props.description}</div>
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            small
            centered
            wide
            secondary
            className={styles.sendRequest}
            onClick={getData}
          >
            {isLoading ? "Loading..." : `Send request`}
          </Button>
          {pdf != null && (
            <Button
              small
              centered
              wide
              className={styles.pdf}
              href={`data:application/pdf;base64,${pdf}`}
              componentProps={{ download: "Asset Report.pdf" }}
            >
              Download PDF
            </Button>
          )}
        </div>
      </div>
      {showTable && (
        <Table
          categories={props.categories}
          data={transformedData}
          isIdentity={props.endpoint === "identity"}
        />
      )}
      {error != null && <Error error={error} />}
    </>
  );
};

Endpoint.displayName = "Endpoint";

export default Endpoint;
