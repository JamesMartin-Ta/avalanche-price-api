const express = require('express');
const app = express();

var TokenService = require('./services/TokenService');

app.get('/avalanche/price/usdt/:tokenContract', (req, res) => {
  TokenService.getPrice(req.params.tokenContract, function (response) {
    res.send(response);
  });
});

app.listen(8080, () => {
  console.log("Serveur à l'écoute");
});
