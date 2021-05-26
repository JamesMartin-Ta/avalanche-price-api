const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());

app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).send('OK');
});

var TokenService = require('./services/TokenService');

app.put('/avalanche/price/usdt', cors(), (req, res) => {
  try {
    TokenService.getPrice(
      req.body.targetTokenAddress,
      req.body.targetTokenSymbol,
      req.body.targetTokenAndUSDTPoolABI,
      function (response) {
        res.status(200).send(response);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to avalanche-price-api by JamesMartin-Ta');
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Serveur à l'écoute");
});
