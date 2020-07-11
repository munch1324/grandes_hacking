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

// mongo db
const mongo = require('mongodb').MongoClient
const db_url = 'mongodb://localhost:27017';



const app = express();
app.use(cors());
app.use(bodyParser.json());

app.put('/saveStock', (req, res) => {
  console.log('new stock')
  
  mongo.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db('GrandeHackingDB');
    collection = db.collection('stockTickers');
    // check if the ticker already exists
    collection.findOne({tickerSymbol: req.body.tickerSymbol}, (err, item) => {
      if (err) {
        console.error(err)
      }
      if (item) {
        console.log("Ticker already found. No ticker added");
      } else {
        collection.insertOne({tickerSymbol: req.body.tickerSymbol}, (err, result) => {
          if (err) {
              console.error(err);
          } else {
              console.log(result)
          }
        });
      }
    });
  });
  res.send('')
})

app.delete('/removeStock', (req, res) => {
  console.log('remove stock')
  
  mongo.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db('GrandeHackingDB');
    collection = db.collection('stockTickers');
    
    collection.deleteMany({tickerSymbol: req.body.tickerSymbol}, (err, item) => {
      if (err) {
        console.error(err)
      }
      console.log("Deletion successful.")
    });
  });
  res.send('')
})

app.get('/savedStocks', (req, res) => {
  res.send(savedStocks)
})

app.get('/posts', async (req, res, next) => {

  var combinedNews = []
  mongo.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db('GrandeHackingDB');
    collection = db.collection('stockTickers');
    // check if the ticker already exists
    collection.find({}).toArray((err, items) => {
      if (err) {
        console.error(err)
        return
      }
      items.forEach(item => {
        finnhubClient.companyNews(item.tickerSymbol, "2020-01-01", "2020-05-01", (error, data, response) => {
          if (error) {
              console.error(error);
          } else {
              y = data.map(x => ({title : x.headline, ticker: item.tickerSymbol, url: x.url }));
              var slimmed = y.slice(0,2);
              combinedNews = combinedNews.concat(slimmed)
          }
        })
      })
    });
  });
  // TODO: use promises instead
  setTimeout(function() {
    res.send(combinedNews)
  }, 2000);
  
});

let port = 3001;
app.listen(port, () => console.log(`Example app listening at http://localhost:3001`));
