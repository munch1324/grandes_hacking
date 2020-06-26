const http = require('http')
const express = require('express')
const app = express()
const port = 3000
const finnhub = require('finnhub');
var util = require('util');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "brqma3frh5rce3ls8mk0" // Replace this
const finnhubClient = new finnhub.DefaultApi()

let visitCount = 0

app.get('/StockNews/:tickerSymbol', (req, res) => {
    //Company News
    finnhubClient.companyNews(req.params["tickerSymbol"], "2020-01-01", "2020-05-01", (error, data, response) => {
        if (error) {
            console.error(error);
        } else {
            const prettyVersion = data.map(dataMember => `<img width="25%" src="${dataMember.image}" /><a href="${dataMember.url}" >${dataMember.headline}</b><br/>`).join('');
            res.send(prettyVersion);
        }
    });
    visitCount++
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

console.log('Node server running on port 3000');
