const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());

function supportCrossOriginScript(req, res, next) {
  res.status(200);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // res.header("Access-Control-Allow-Headers", "Origin");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // res.header("Access-Control-Allow-Methods","POST, OPTIONS");
  // res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS, DELETE, PUT, HEAD");
  // res.header("Access-Control-Max-Age","1728000");
  next();
}

// Support CORS
app.options('/avalanche/price/usdt', supportCrossOriginScript);

var TokenService = require('./services/TokenService');

app.put('/avalanche/price/usdt', supportCrossOriginScript, (req, res) => {
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
