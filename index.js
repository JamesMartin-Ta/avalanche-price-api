const express = require('express');
const app = express();
app.use(express.json());

var TokenService = require('./services/TokenService');

app.post('/avalanche/price/usdt', (req, res) => {
  try {
    TokenService.getPrice(
      req.body.targetTokenAddress,
      req.body.targetTokenSymbol,
      req.body.targetTokenAndUSDTPoolABI,
      function (response) {
        res.send(
          callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'text/plain',
              'Access-Control-Allow-Credentials': true
            },
            body: response
          })
        );
      }
    );
  } catch (error) {
    res.send(
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Credentials': true
        },
        body: error.message
      })
    );
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to avalanche-price-api by JamesMartin-Ta');
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Serveur à l'écoute");
});
