'use strict';
/*
  Where my routes/controllers will be.
  I should add my schemas in this page as well.

*/
const axios = require('axios');

const { getOrCreateStock, addLike } = require('../controllers/stockController');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get( async function (req, res){
      const stockName = req.query.stock;  // can be an array
      const like = req.query.like;
      const userIp = req.ip;

      // Verify the stock name
      if (!stockName) {
        res.json({error: "stock name should be provided."});
      } else {
       if (typeof stockName === "object" ) {
        const firstStock = stockName[0];
        const secondStock = stockName[1];

        var firstStockPrice = 0.0;
        var firstStockLikes = 0;

        var secondStockPrice = 0.0;
        var secondStockLikes = 0;

        var first_Stock_rel_likes = 0.0;
        var second_Stock_rel_likes = 0;

        // Get the first stock's information
       await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${firstStock}/quote`)
        .then(async (resp)=>{
          const data = resp.data;

          firstStockPrice = data.latestPrice;

          if ( like ) {
            firstStockLikes = await addLike(firstStock, userIp);
          } else {
            const stockData = await getOrCreateStock(firstStock);
            firstStockLikes = stockData.likes.length;
          }
        })
        .catch(err=>err);
        // Get the second stock's information
        await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${secondStock}/quote`)
        .then( async (resp)=>{
          const Data = resp.data;

          secondStockPrice = Data.latestPrice;
          if ( like ) {
            secondStockLikes = await addLike(secondStock, userIp);
          } else {
            const stockData = await getOrCreateStock(secondStock);
            secondStockLikes = stockData.likes.length;
          }
        }).catch(err=>err);
        // Get rel_likes
        first_Stock_rel_likes = await firstStockLikes - secondStockLikes;
        second_Stock_rel_likes = await secondStockLikes - firstStockLikes;
        // Return the response

        res.json({
          'stockData':[{
            stock: firstStock,
            price: firstStockPrice,
            rel_likes: first_Stock_rel_likes
          }, {
            stock: secondStock,
            price: secondStockPrice,
            rel_likes: second_Stock_rel_likes
          }]
        });
       } else {
        axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockName}/quote`)
        .then(async (resp)=>{
          const data = resp.data;
          const stockSymbol = data.symbol;
          const stockPrice = data.latestPrice;
          var stockLikes = 0;

          if ( like ) {
            stockLikes = await addLike(stockName, userIp);
          } else {
            const stockData = await getOrCreateStock(stockName);
            stockLikes = stockData.likes.length;
          }
          const obj = {
            stockData: {
              stock: stockSymbol,
              price: stockPrice,
              likes: stockLikes
            }
          }
          res.json(obj);
        }).catch(err=>err);
       }
      }
    });
    
    app.route('/api/stock-prices')
    .post( async function (request, response){
      
    });
};
