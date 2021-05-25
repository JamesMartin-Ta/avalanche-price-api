var Web3 = require('web3');
/* var w3 = new Web3(
  'https://avalanche--mainnet--rpc.datahub.figment.io/apikey/7b5e1b3b8dbfec30ea0b7af5e3548899/ext/bc/C/rpc'
); */
var w3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
var avaxABI = require('../assets/avaxABI.json');
var erc20ABI = require('../assets/ERC20.json');

module.exports = {
  getPrice: function (adress = '', callback) {
    /* get pool liquidty address */
    liquidityContract = new w3.eth.Contract(
      avaxABI,
      w3.utils.toChecksumAddress('0x9ee0a4e21bd333a6bb2ab298194320b8daa26516')
    );

    /* get reserve of each token of given pool */
    liquidityContract.methods
      .getReserves()
      .call()
      .then((response) => {
        const token0reserve = response[0],
          token1reserve = response[1],
          lastUpdateDate = new Date(response[2] * 1000);

        /* Check token address */
        Promise.all([
          liquidityContract.methods.token0().call(),
          liquidityContract.methods.token1().call()
        ])
          .then(function (responses) {
            return Promise.all(
              responses.map(function (response) {
                return response;
              })
            );
          })
          .then((addresses) => {
            const token0Address = addresses[0],
              token1Address = addresses[1];

            /* Create contract instances */
            let token0 = new w3.eth.Contract(
              erc20ABI,
              w3.utils.toChecksumAddress(token0Address)
            );
            let token1 = new w3.eth.Contract(
              erc20ABI,
              w3.utils.toChecksumAddress(token1Address)
            );

            /* Get each token symbol */
            Promise.all([
              token0.methods.symbol().call(),
              token0.methods.decimals().call(),
              token1.methods.symbol().call(),
              token1.methods.decimals().call()
            ])
              .then(function (responses) {
                return Promise.all(
                  responses.map(function (response) {
                    return response;
                  })
                );
              })
              .then((data) => {
                let token0symb = data[0],
                  token0decimals = data[1],
                  token1symb = data[2],
                  token1decimals = data[3];

                /* Return price */
                let price =
                  token0symb === 'WAVAX'
                    ? token1reserve /
                      10 ** token1decimals /
                      (token0reserve / 10 ** token0decimals)
                    : token0reserve /
                      10 ** token0decimals /
                      (token1reserve / 10 ** token1decimals);

                let symb = token0symb === 'WAVAX' ? token1symb : token0symb;

                return callback({
                  price: price,
                  symbole: symb,
                  date: `${lastUpdateDate}`
                });
              });
          });
      });
  }
};
