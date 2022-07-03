import { createContext, FC, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { IAccount } from "../Types";

export const AccountContext = createContext<{
  accountInfo: IAccount | null;
}>({
  accountInfo: null
});

const AccountProvider: FC = ({ children }) => {

  const { getAccount } = useApi();

  const [accountInfo, setAccountInfo] = useState<IAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getAccount().then((data) => {
      if (isMounted) {
        setAccountInfo(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getAccount]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Account Information...</h3>
      </div>
    )
  }

  if (accountInfo === null) {
    return (
      <Navigate to="/init/account" />
    )
  }

  if (accountInfo.twiml_app_sid === null) {
    return (
      <Navigate to="/init/twiml" />
    )
  }

  return (
    <AccountContext.Provider value={{
      accountInfo: accountInfo
    }}>
      {children}
    </AccountContext.Provider>
  );

}

export default AccountProvider;