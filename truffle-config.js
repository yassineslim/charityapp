const path = require("path");

module.exports = {
  
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", 
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
