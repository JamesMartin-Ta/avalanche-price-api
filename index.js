const express = require('express');
var cors = require('cors');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  //doesn't send response just adjusts it
  res.header('Access-Control-Allow-Origin', '*'); //* to give access to any origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization' //to give access to all the headers provided
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
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
