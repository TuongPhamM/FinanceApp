import React, { useContext } from "react";
import Callout from "plaid-threads/Callout";
import Button from "plaid-threads/Button";
import InlineLink from "plaid-threads/InlineLink";

import Link from "../Link";
import Context from "../../Context";

import styles from "./index.module.scss";

const Header = () => {
  const {
    itemId,
    accessToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
    isPaymentInitiation,
  } = useContext(Context);

  return (
    <div className={styles.grid}>
      <h3 className={styles.title}>Tuong Pham Finance App</h3>
      <h4 className={styles.subtitle}>I N S I G H T F U L</h4>

      {!linkSuccess ? (
        <>
          <p className={styles.introPar}>
            Click 'launch' to connect your bank.
          </p>
          {/* message if backend is not running and there is no link token */}
          {!backend ? (
            <Callout warning>
              Unable to fetch link_token: please make sure your backend server
              is running and that your .env file has been configured with your
              <code>PLAID_CLIENT_ID</code> and <code>PLAID_SECRET</code>.
            </Callout>
          ) : /* message if backend is running and there is no link token */
          linkToken == null && backend ? (
            <Callout warning>
              <div>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured
                correctly.
              </div>
              <div>
                If you are on a Windows machine, please ensure that you have
                cloned the repo with{" "}
                <InlineLink
                  href="https://github.com/plaid/quickstart#special-instructions-for-windows"
                  target="_blank"
                >
                  symlinks turned on.
                </InlineLink>{" "}
                You can also try checking your{" "}
                <InlineLink
                  href="https://dashboard.plaid.com/activity/logs"
                  target="_blank"
                >
                  activity log
                </InlineLink>{" "}
                on your Plaid dashboard.
              </div>
              <div>
                Error Code: <code>{linkTokenError.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokenError.error_type}</code>{" "}
              </div>
              <div>Error Message: {linkTokenError.error_message}</div>
            </Callout>
          ) : linkToken === "" ? (
            <div className={styles.linkButton}>
              <Button large disabled>
                Loading...
              </Button>
            </div>
          ) : (
            <div className={styles.linkButton}>
              <Link />
            </div>
          )}
        </>
      ) : (
        <>
          {isPaymentInitiation ? (
            <>
              <h4 className={styles.subtitle}>
                Congrats! Your payment is now confirmed.
                <p />
                <Callout>
                  You can see information of all your payments in the{" "}
                  <InlineLink
                    href="https://dashboard.plaid.com/activity/payments"
                    target="_blank"
                  >
                    Payments Dashboard
                  </InlineLink>
                  .
                </Callout>
              </h4>
              <p className={styles.requests}>
                Now that the 'payment_id' stored in your server, you can use it
                to access the payment information:
              </p>
            </>
          ) : (
            /* If not using the payment_initiation product, show the item_id and access_token information */ <>
              {isItemAccess ? (
                <div className={styles.subtitle}>
                  Your account has been linked.
                </div>
              ) : (
                <h4 className={styles.subtitle}>
                  <Callout warning>
                    Unable to create an item. Please check your backend server
                  </Callout>
                </h4>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

Header.displayName = "Header";

export default Header;
