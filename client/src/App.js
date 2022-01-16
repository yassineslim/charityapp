import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Button } from 'react-bootstrap';
import { HomeWrapper as Home } from './pages/home/Home';
import { FundRaiseWrapper } from './pages/fund-raise/FundRaise';
import AppContext from './app-context'
import FundRaise from './contracts/FundRaise.json';
import getWeb3 from './getWeb3';

export default function App() {
  const [dependencies, setDependencies] = useState({ web3: null, account: null, fundRaise: null, loaded: false });

  /**
   * @description Utiliser l'effet pour charger les dépendances nécessaires aux routes pour interagir avec la blockchain.
   */
  useEffect(() => {
    (async function() {
      const web3 = await getWeb3();

      const networkId = await web3.eth.net.getId();
      const networkData = FundRaise.networks[networkId];
      const fundRaise = new web3.eth.Contract(FundRaise.abi, networkData.address);

      const [account] = await web3.eth.getAccounts();

      setDependencies(previousState => ({ ...previousState, web3, account, fundRaise, loaded: true }));
    })();
  }, []);

  /**
   * @description pour connecter l'utilisateur à l'application ;
   * Ceci est montré à l'utilisateur s'il n'est pas initialement connecté.
   * chargement
   */
  async function connect() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const { web3 } = dependencies;
    const [account] = await web3.eth.getAccounts();
    setDependencies(previousState => ({...previousState, account}));
  }

  return (
    <Router>
      <AppContext.Provider value={{ dependencies }}>
        {
          dependencies.loaded ?
          (
            dependencies.account ?
              <Switch>
                <Route path="/fund-raise/:id">
                  <FundRaiseWrapper/>
                </Route>
                <Route path="/">
                  <Home/>
                </Route>
                <Route path="*">
                  <NoMatch/>
                </Route>
              </Switch> :
              <Button onClick={connect}>Connect</Button>
          ) : 
          <div>loading....</div>
        }
      </AppContext.Provider>
    </Router>
  );
}

function NoMatch() {
  return (
    <div>Page not found (404).</div>
  )
}