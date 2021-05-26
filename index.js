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
        res.send(response);
      }
    );
  } catch (e) {
    res.send(e);
  }
});

app.listen(8080, () => {
  console.log("Serveur à l'écoute");
});
