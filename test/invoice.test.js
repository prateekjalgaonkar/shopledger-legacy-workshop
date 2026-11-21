var test = require('node:test');
var assert = require('node:assert/strict');
var pricing = require('../lib/pricing');
var invoice = require('../lib/invoice');

test('invoice GST breakdown matches checkout HSN slab calculation', function () {
  var items = [
    { id: 1, sku: 'RICE-1', name: 'Rice', hsn: '1006', price: 100, qty: 2 }
  ];
  var checkout = pricing.computeTotals(items, '');
  var billedOrder = {
    id: 1,
    items: items,
    coupon: '',
    subtotal: checkout.subtotal,
    discount: checkout.discount,
    tax: checkout.tax,
    total: checkout.total
  };
  var invoiceFigures = invoice.computeInvoiceFigures(billedOrder);

  assert.equal(checkout.tax, 10);
  assert.equal(checkout.total, 210);
  assert.equal(invoiceFigures.rows[0].gstPercent, 5);
  assert.equal(invoiceFigures.tax, checkout.tax);
  assert.equal(invoiceFigures.total, checkout.total);
});

test('invoice total and GST match checkout percent coupon and discount cap', function () {
  var items = [
    { id: 2, sku: 'MIX-1', name: 'Packaged item', hsn: '0902', price: 2000, qty: 1 }
  ];
  var checkout = pricing.computeTotals(items, 'SAVE10');
  var billedOrder = {
    id: 2,
    items: items,
    coupon: 'SAVE10',
    subtotal: checkout.subtotal,
    discount: checkout.discount,
    tax: checkout.tax,
    total: checkout.total
  };
  var invoiceFigures = invoice.computeInvoiceFigures(billedOrder);

  assert.equal(checkout.discount, 150);
  assert.equal(checkout.tax, 333);
  assert.equal(checkout.total, 2183);
  assert.equal(invoiceFigures.discount, checkout.discount);
  assert.equal(invoiceFigures.tax, checkout.tax);
  assert.equal(invoiceFigures.total, checkout.total);
});
