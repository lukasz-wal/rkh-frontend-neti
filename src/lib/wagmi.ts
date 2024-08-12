import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask({
    extensionOnly: true,
    dappMetadata: {
      name: "Fil+ Dashboard",
    }
  })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
