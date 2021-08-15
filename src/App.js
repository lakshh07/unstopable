import "./App.css";
import {
  ChakraProvider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from "ethers";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import { EPERM } from "constants";
import ClubService from "./utils/ClubService";
import GraphService from "./utils/GraphService";
import TextileService from "./utils/TextileService";

const getMetamaskProvider = async () => {
  if (window.ethereum) {
    await window.ethereum.enable();
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    return null;
  }
};
const gService = new GraphService();

function App() {
  const [currentAccount, setCurrentAccount] = useState("0x0000");
  const [chainId, setChainId] = useState();
  const [walletService, setWalletService] = useState();
  const [buckets, setBuckets] = useState();
  const [mProvider, setProvider] = useState();
  const [mSigner, setSigner] = useState();
  const [clService, setClubService] = useState();
  // const [gService, setgService] = useState();
  const [textileService, setTextileService] = useState();
  const [ownedClub, setOwnedClub] = useState({});

  const getCurrentAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    let ca = ethers.utils.getAddress(accounts[0]);
    setCurrentAccount(ca);
    const mprovider = await getMetamaskProvider();
    setProvider(mprovider);
    setSigner(mprovider.getSigner());
    let cService = new ClubService();
    await cService.init(mprovider);
    setClubService(cService);
    let tService = new TextileService();
    await tService.init();
    setTextileService(tService);
    const club = await gService.fetchOwnedClub(ca);
    setOwnedClub(club);
  };

  useEffect(() => {
    if (window.ethereum && currentAccount) {
      setChainId(window.ethereum.networkVersion);

      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(ethers.utils.getAddress(accounts[0]));
        // window.location.reload();
      });

      window.ethereum.on("chainChanged", (newChainId) => {
        setChainId(newChainId);
        window.location.reload();
      });
    }
  }, [currentAccount]);

  useEffect(async () => {
    await getCurrentAccount();
  }, []);

  const config = {
    unlockAddress: "0xedAd98625A255183B68A34c6363F6470BfD2812A",
    provider: "http://127.0.0.1:7545",
    threadID: "bafkzubtwkd4qhlodrzjwvsw6wbfhpugtxbkr33txn7fcqsii233tshi",
    bucketKey: "bafzbeibbklbg5ab4j7kwzk3jvc7h5k644hkdc6f6f26o73qh4g7plqudsm",
    bucketAuth: {
      key: "b3xj7rjlhffdpc42lzz7slden4a",
      secret: "bvyxyvavrpsili77jufjyyffxqba6nc2mhv5gv6y",
    },
  };

  return (
    <ChakraProvider>
      <Router>
        {currentAccount === undefined ? (
          window.location.reload()
        ) : window.ethereum === undefined ? (
          <Alert status="warning" justifyContent="center" position="absolute">
            <AlertIcon />
            <AlertTitle mr={2}>Metamask Not Installed!</AlertTitle>
            <AlertDescription>Please Install Metamask.</AlertDescription>
          </Alert>
        ) : (
          <>
            {currentAccount === "0x0000" ? (
              <Alert
                status="warning"
                justifyContent="center"
                position="absolute"
                variant="subtle"
              >
                <AlertIcon />
                <AlertTitle mr={2}>Wallet Not Connected!</AlertTitle>
                <AlertDescription>
                  <Tag
                    background="rgba(230, 1, 1,0.08)"
                    onClick={() => {
                      getCurrentAccount();
                    }}
                    cursor="pointer"
                  >
                    Connect Wallet
                  </Tag>
                </AlertDescription>
              </Alert>
            ) : chainId === "137" ||
              chainId === "80001" ||
              chainId === "1337" ||
              chainId === "5777" ? null : (
              <Alert status="warning" justifyContent="center">
                <AlertIcon />
                <AlertTitle mr={2}>Network Not Supported!</AlertTitle>
                <AlertDescription>
                  Please Switch to Polygon Testnet or Mainnet.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        <Route exact path="/">
          <Hero
            provider={mProvider}
            signer={mSigner}
            currentAccount={currentAccount}
            graphService={gService}
            clubService={clService}
          />
        </Route>
        <Route exact path={["/dashboard", "/:user/posts", "/clubs", "/allclubs"]}>
          <Dashboard
            provider={mProvider}
            signer={mSigner}
            clubAddress={ownedClub ? ownedClub.address: null}
            clubName={ownedClub? ownedClub.name: null}
            currentAccount={currentAccount}
            clubService={clService}
            graphService={gService}
            textileService={textileService}
          />
        </Route>
      </Router>
    </ChakraProvider>
  );
}

export default App;
