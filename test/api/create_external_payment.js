var gatewayd = require(__dirname+'/../../');
var assert   = require('assert');

describe('api.createExternalPayment', function() {

  describe('outgoing external payment', function() {

    it('should create a record and associated external accounts', function(done) {

      var options = {
        state                : 'invoice',
        direction            : 'outgoing',
        destination_address  : 'acct:me@stevenzeiler.com',
        source_address       : 'acct:gateway',
        destination_amount   : 10,
        destination_currency : 'BTC',
        source_amount        : 15,
        source_currency      : 'XAU'
      };

      gatewayd.api.createExternalPayment(options)
        .then(function(externalPayment) {

          assert.strictEqual(externalPayment.destination_amount, options.destination_amount);
          assert.strictEqual(externalPayment.destination_currency, options.destination_currency);
          assert.strictEqual(externalPayment.source_amount, options.source_amount);
          assert.strictEqual(externalPayment.source_currency, options.source_currency);
          assert.strictEqual(externalPayment.deposit, false);
          assert.strictEqual(externalPayment.status, 'invoice');

          externalPayment.getToAccount().then(function(account) {
            assert.strictEqual(account.address, 'me@stevenzeiler.com');
            assert.strictEqual(account.type, 'acct')

            externalPayment.getFromAccount().then(function(fromAccount) {
              assert.strictEqual(fromAccount.address, 'gateway');
              assert.strictEqual(fromAccount.type, 'acct');
              done();
            });
          });
        })
        .error(function(error) {
          console.log('ERROR', error);
        });
    });
  });

  describe('incoming external payment', function() {

    it('should create a record and associated external accounts', function(done) {

      var options = {
        state                : 'invoice',
        direction            : 'incoming',
        source_address       : 'acct:me@stevenzeiler.com',
        destination_address  : 'acct:gateway',
        destination_amount   : 10,
        destination_currency : 'BTC',
        source_amount        : 15,
        source_currency      : 'XAU'
      };

      gatewayd.api.createExternalPayment(options)
        .then(function(externalPayment) {

          assert.strictEqual(externalPayment.destination_amount, options.destination_amount);
          assert.strictEqual(externalPayment.destination_currency, options.destination_currency);
          assert.strictEqual(externalPayment.source_amount, options.source_amount);
          assert.strictEqual(externalPayment.source_currency, options.source_currency);
          assert.strictEqual(externalPayment.deposit, true);
          assert.strictEqual(externalPayment.status, 'invoice');

          externalPayment.getToAccount().then(function(account) {
            assert.strictEqual(account.address, 'gateway');
            assert.strictEqual(account.type, 'acct')

            externalPayment.getFromAccount().then(function(fromAccount) {
              assert.strictEqual(fromAccount.address, 'me@stevenzeiler.com');
              assert.strictEqual(fromAccount.type, 'acct');
              done();
            });
          });
        })
        .error(function(error) {
          console.log('ERROR', error);
        });
    });
  });
});

