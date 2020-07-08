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
const finnhubClient = new finnhub.DefaultApi()

const app = express();
app.use(cors());
app.use(bodyParser.json());

var savedStocks = ['AAPL']

app.put('/saveStock', (req, res) => {
  console.log('new stock')
  savedStocks.push(req.body.title)
  res.send('')
})

app.get('/savedStocks', (req, res) => {
  res.send(savedStocks)
})

app.get('/posts', async (req, res, next) => {

  var combinedNews = []
  savedStocks.forEach(stockSymbol => {
    finnhubClient.companyNews(stockSymbol, "2020-01-01", "2020-05-01", (error, data, response) => {
      if (error) {
          console.error(error);
      } else {
          y = data.map(x => ({title : x.headline, ticker: stockSymbol }));
          var slimmed = y.slice(0,4);
          combinedNews = combinedNews.concat(slimmed)
      }
    })
  })
  
  // TODO: use promises instead
  setTimeout(function() {
    res.send(combinedNews)
  }, 2000);
  
});

let port = 3001
app.listen(port, () => console.log(`Example app listening at http://localhost:3001`))