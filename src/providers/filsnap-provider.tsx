import { FilsnapAdapter, AccountInfo, SnapConfig } from "filsnap-adapter";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";

export type FilsnapState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "connected"; snap: FilsnapAdapter; account: AccountInfo };

export interface FilsnapContextType {
  state: FilsnapState;
  connect: (config?: Partial<SnapConfig>) => Promise<void>;
  setSnapConfig: React.Dispatch<React.SetStateAction<Partial<SnapConfig>>>;
}

interface UseFilsnapStateProps {
  snapId: string;
  snapVersion: string;
  config: Partial<SnapConfig>;
}

export function useFilsnapState({
  snapId,
  snapVersion,
  config,
}: UseFilsnapStateProps): FilsnapContextType {
  const [state, setState] = useState<FilsnapState>({ status: "idle" });
  const [snapConfig, setSnapConfig] = useState<Partial<SnapConfig>>(config);

  useEffect(() => {
    let mounted = true;

    async function checkSnaps() {
      if (mounted) {
        try {
          const hasSnaps = await FilsnapAdapter.hasSnaps();
          if (!hasSnaps) {
            setState({
              status: "error",
              error: new Error("Metamask not found"),
            });
          }
        } catch (error) {
          setState({
            status: "error",
            error: error instanceof Error ? error : new Error("Unknown error"),
          });
        }
      }
    }

    checkSnaps();

    return () => {
      mounted = false;
    };
  }, []);

  const connect = useCallback(
    async (_config: Partial<SnapConfig> = snapConfig) => {
      setState({ status: "loading" });
      try {
        const snap = await FilsnapAdapter.connect(_config, snapId, snapVersion);
        const accountResponse = await snap.getAccountInfo();
        if (accountResponse.error) {
          throw new Error(accountResponse.error.message, {
            cause: accountResponse.error,
          });
        }
        setState({
          status: "connected",
          snap,
          account: accountResponse.result,
        });
      } catch (error) {
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    },
    [snapConfig, snapId, snapVersion]
  );

  return { state, connect, setSnapConfig };
}

export const FilsnapContext = createContext<FilsnapContextType | null>(null);

interface FilsnapProviderProps {
  snapId: string;
  snapVersion: string;
  config: Partial<SnapConfig>;
  children: ReactNode;
}

export function FilsnapProvider({
  snapId,
  snapVersion,
  config,
  children,
}: FilsnapProviderProps): JSX.Element {
  const value = useFilsnapState({ snapId, snapVersion, config });

  return (
    <FilsnapContext.Provider value={value}>{children}</FilsnapContext.Provider>
  );
}
