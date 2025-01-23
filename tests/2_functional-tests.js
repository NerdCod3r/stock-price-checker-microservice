const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

suite('Stock Checker Functional Tests', function() {
    suite("5 Functional tests for GET request", function(){
        test('Viewing one stock: GET /api/stock-prices/',(done)=>{
            chai
            .request(server)
            .get('/api/stock-prices/')
            .set('content-type', 'application/json')
            .query({stock: 'TSLA'})
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'TSLA')
                assert.exists(res.body.stockData.price, 'Stock has a price');
                done();
            })
        });

        test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done)=>{
            chai
            .request(server)
            .get('/api/stock-prices/')
            .set('content-type', 'application/json')
            .query({stock: 'GOLD', like: true})
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'GOLD');
                assert.exists(res.body.stockData.price, "Stock has a price");
                assert.exists(res.body.stockData.likes, "Stock has likes");
                done();
            })
        });

        test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done)=>{
            chai
            .request(server)
            .get('/api/stock-prices/')
            .set('content-type', 'application/json')
            .query({stock: 'GOLD', like: true})
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.stock, 'GOLD');
                assert.exists(res.body.stockData.price, "Stock has a price");
                assert.exists(res.body.stockData.likes, "Stock has likes");
                done();
            })
        });

        test('Viewing two stocks', function(){
            chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/')
            .set('content-type', 'application/json')
            .query({stock: ['AMZN', 'T']})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.length, 2);
                assert.equal(res.body.stockData[0].stock, 'AMZN');
                assert.equal(res.body.stockData[1].stock, 'T');

                assert.exists(res.body.stockData[0].price, 'AMZN has a price!');
                assert.exists(res.body.stockData[1].price, "T has A price!");

                assert.exists(res.body.stockData[0].rel_likes, 'AMZN has rel likes difference');
                assert.exists(res.body.stockData[1].rel_likes, 'T has rel_likes');
            })
        });

        test('Viewing two stocks and liking them', function(){
            chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/')
            .set('content-type', 'application/json')
            .query({stock: ['AMZN', 'T'], like: true})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.stockData.length, 2);
                assert.equal(res.body.stockData[0].stock, 'AMZN');
                assert.equal(res.body.stockData[1].stock, 'T');

                assert.exists(res.body.stockData[0].price, 'AMZN has a price!');
                assert.exists(res.body.stockData[1].price, "T has A price!");

                assert.exists(res.body.stockData[0].rel_likes, 'AMZN has rel likes difference');
                assert.exists(res.body.stockData[1].rel_likes, 'T has rel_likes');
            })
        });
    })
});
