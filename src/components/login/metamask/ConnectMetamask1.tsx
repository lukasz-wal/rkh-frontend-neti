import { AccountInfo, FilsnapAdapter, SnapConfig } from "filsnap-adapter";
import { useCallback, useEffect, useState } from "react";

const SNAP_ID = "npm:filsnap";
const SNAP_VERSION = ">=0.5.0";

export function ConnectMetamask1() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const [hasMetamask, setHasMetamask] = useState(false);
  const [filSnap, setFilSnap] = useState<FilsnapAdapter>();
  const [account, setAccount] = useState<AccountInfo>();

  useEffect(() => {
    setIsConnected(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function setup() {
      if (mounted) {
        setError(undefined);
        try {
          const hasSnaps = await FilsnapAdapter.hasSnaps();
          setHasMetamask(hasSnaps);
        } catch (err: any) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }
    }
    setIsLoading(true);
    setup();
  }, []);

  const connect = useCallback(
    async (_config: Partial<SnapConfig> | undefined) => {
      setIsLoading(true);
      setError(undefined);
      try {
        const snap = await FilsnapAdapter.connect({}, SNAP_ID, SNAP_VERSION);
        const account = await snap.getAccountInfo();
        if (account.error) {
          setError(new Error(account.error.message, { cause: account.error }));
        }

        setFilSnap(snap);
        setAccount(account.result);
        setIsConnected(true);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      /*snapConfig, snapId, snapVersion, setSnap, setError*/
    ]
  );

  if (isConnected && account) {
    return (
      <>
        <h3>Native Account</h3>
        <div title={`${account.balance} attoFIL`}>
          <b>{account ? account.balance : "unknown"} FIL</b>
        </div>
        <span data-testid="account-info">{account.address}</span>
      </>
    );
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading && !error && (
        <div>
          {hasMetamask && (
            <button
              onClick={async () => {
                connect({});
                setIsConnected(true);
              }}
            >
              Connect Metamask
            </button>
          )}
        </div>
      )}
    </>
  );
}
