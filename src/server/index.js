require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const epilogue = require('epilogue');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "brqma3frh5rce3ls8mk0" // Replace this
const finnhubClient = new finnhub.DefaultApi();

// Local imports
const grandeDB = require('./database.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.put('/saveStock', (req, res) => {
  console.log('new stock')
  
  grandeDB.addStockTicker(req.body.tickerSymbol)
  res.send('')
})

app.delete('/removeStock', (req, res) => {
  console.log('remove stock')
  grandeDB.removeStockTicker(req.body.tickerSymbol)
  res.send('')
})

app.get('/savedStocks', (req, res) => {
  res.send(savedStocks)
})

app.get('/posts', async (req, res, next) => {

  var combinedNews = await grandeDB.savedStockTickers()
  var promises = []
  combinedNews.forEach(item => {
    var networkPromise = new Promise(resolve => 
    finnhubClient.companyNews(item.tickerSymbol, "2020-01-01", "2020-05-01", (error, data, response) => {
      if (error) {
          console.error(error);
      } else {
          y = data.map(x => ({title : x.headline, ticker: item.tickerSymbol, url: x.url }));
          var slimmed = y.slice(0,2);
          combinedNews = combinedNews.concat(slimmed)
      }
      resolve()
    })
    )
    promises.push(networkPromise)
  });
  
  Promise.all(promises).then((values) => {
    res.send(combinedNews)
  })
  
});

let port = 3001;
app.listen(port, () => console.log(`Example app listening at http://localhost:3001`));
