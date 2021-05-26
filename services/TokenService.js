var Web3 = require('web3');
var w3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
var erc20ABI = require('../assets/ERC20.json');

module.exports = {
  getPrice: function (targetTokenAddress, targetTokenSymbol, targetTokenAndUSDTPoolABI, callback) {
    /* get pool liquidty address */
    let liquidityContract = new w3.eth.Contract(
      targetTokenAndUSDTPoolABI,
      w3.utils.toChecksumAddress(targetTokenAddress)
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
                  token0symb === targetTokenSymbol
                    ? token1reserve /
                      10 ** token1decimals /
                      (token0reserve / 10 ** token0decimals)
                    : token0reserve /
                      10 ** token0decimals /
                      (token1reserve / 10 ** token1decimals);


                return callback({
                  price: price,
                  symbole: targetTokenSymbol,
                  date: `${lastUpdateDate}`
                });
              });
          });
      });
  }
};
