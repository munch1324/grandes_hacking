// mongo db
const mongo = require('mongodb').MongoClient
const db_url = 'mongodb://localhost:27017';
const db_name = 'GrandeHackingDB'
const db_collection = 'stockTickers'
module.exports = {
    addStockTicker: function (tickerSymbol) {
        mongo.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, client) => {
            if (err) {
                console.error(err)
                return
            }
            db = client.db(db_name);
            collection = db.collection(db_collection);
            // check if the ticker already exists
            collection.findOne({ tickerSymbol: tickerSymbol }, (err, item) => {
                if (err) {
                    console.error(err)
                }
                if (item) {
                    console.log("Ticker already found. No ticker added");
                    return null
                } else {
                    collection.insertOne({ tickerSymbol: tickerSymbol }, (err, result) => {
                        if (err) {
                            return err;
                        } else {
                            return result;
                        }
                    });
                }
            });
        });
    },

    removeStockTicker: function (tickerSymbol) {
        mongo.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, client) => {
            if (err) {
                console.error(err)
                return
            }
            db = client.db(db_name);
            collection = db.collectiond(db_collection);

            collection.deleteMany({ tickerSymbol: tickerSymbol }, (err, item) => {
                if (err) {
                    console.error(err)
                }
                console.log("Deletion successful.")
            });
        });
    },

    savedStockTickers: async function () {
        return new Promise(resolve => {
            mongo.connect(db_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err, client) => {
                if (err) {
                    console.error(err)
                    return
                }
                db = client.db(db_name);
                collection = db.collection(db_collection);
                // check if the ticker already exists

                collection.find({}).toArray((err, items) => {
                    if (err) {
                        return resolve(err)
                    }
                    return resolve(items)
                });
            });
        });
    }
}