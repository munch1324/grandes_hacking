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

// let visitCount = 0

// app.get('/StockNews/:tickerSymbol', (req, res) => {
//     //Company News
    // finnhubClient.companyNews(req.params["tickerSymbol"], "2020-01-01", "2020-05-01", (error, data, response) => {
    //     if (error) {
    //         console.error(error);
    //     } else {
    //         const prettyVersion = data.map(
    //             dataMember => `<img width="25%" src="${dataMember.image}" /><a href="${dataMember.url}" >${dataMember.headline}</b><br/>`
    //             ).join('');
    //         res.send(prettyVersion);
//         }
//     });
//     visitCount++
// })


const app = express();
app.use(cors());
app.use(bodyParser.json());

var savedStocks = ['AAPL']

app.put('/saveStock', (req, res) => {
  console.log('new stock')
  
  console.log(req)
})

app.get('/posts', async (req, res, next) => {
  try {
    finnhubClient.companyNews("AAPL", "2020-01-01", "2020-05-01", (error, data, response) => {
      if (error) {
          console.error(error);
      } else {
          // console.log(data);
          y = data.map(x => ({title : x.headline }));
          res.send(y.slice(0, 10))
      }
    })
  } catch (error) {
    next(error.message);
  }
});

let port = 3001
app.listen(port, () => console.log(`Example app listening at http://localhost:3001`))