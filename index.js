const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());

var TokenService = require('./services/TokenService');

app.put('/avalanche/price/usdt', cors(), (req, res) => {
  try {
    TokenService.getPrice(
      req.body.targetTokenAddress,
      req.body.targetTokenSymbol,
      req.body.targetTokenAndUSDTPoolABI,
      function (response) {
        res.header('Access-Control-Allow-Origin', '*').status(200).send(response);
      }
    );
  } catch (error) {
    res.status(500).header('Access-Control-Allow-Origin', '*').send(error);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to avalanche-price-api by JamesMartin-Ta');
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Serveur à l'écoute");
});
