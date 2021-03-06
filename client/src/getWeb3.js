import Web3 from "web3";

/**
 * @description Script fourni par la boîte à truffes react pour obtenir un objet web3
 * @returns {Object}
 */
const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Demander l'accès au compte si nécessaire
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    // Les anciens navigateurs de dapps...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log("Injected web3 detected.");
      resolve(web3);
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:8545"
      );
      const web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
      resolve(web3);
    }
  });

export default getWeb3;
