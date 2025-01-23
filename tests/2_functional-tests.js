const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

suite('Stock Checker Functional Tests', function() {
    test('?stock=GOOG', (done)=>{
        chai
        .request(server)
        .keepOpen()
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res)=>{
           assert.equal(res.status, 200);
           expect(res).to.have.status(200);
           expect(res.body.stockData).to.have.property('stock', 'GOOG');
           expect(res.body.stockData).to.have.property('price');
           expect(res.body.stockData).to.have.property('likes');
            done();
        })
    });
});
