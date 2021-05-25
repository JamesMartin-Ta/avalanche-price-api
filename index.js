const express = require('express');
const app = express();

var TokenService = require('./services/TokenService');

app.get('/avalanche/price/:tokenContract', (req, res) => {
  TokenService.getPrice('', function (response) {
    res.send(response);
  });
});

app.listen(8080, () => {
  console.log("Serveur à l'écoute");
});
