import React, { use, useEffect } from "react";
import { useFilsnap } from "@/hooks/use-filsnap";
import { ClipLoader } from "react-spinners";

interface ConnectMetamaskProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function ConnectMetamask() {
  const { state, connect } = useFilsnap();

  // useEffect(() => {
  //   (async () => {
  //     const isConnected = sessionStorage.getItem("metamask-snap");
  //     if (isConnected) {
  //       const installResult = await initiateFilecoinSnap();
  //       if (installResult.isSnapInstalled) {
  //         dispatch({
  //           type: MetamaskActions.SET_INSTALLED_STATUS,
  //           payload: { isInstalled: true, snap: installResult.snap },
  //         });
  //       }
  //     }
  //   })();
  // }, [dispatch]);

  switch (state.status) {
    case "idle":
      return <button onClick={() => connect()}>Connect to Metamask</button>;
    case "loading":
      return <ClipLoader />;
    case "error":
      return <div>Error: {state.error.message}</div>;
    case "connected":
      return <div>Connected: {state.account.address}</div>;
  }
}
