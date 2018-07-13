const test = require('tape');
const fs = require('fs');
const through2 = require('through2');
const bufferUtil = require('./src/buffer');
const CapnpStream = require('./src/stream');

var data = Buffer.from([
  0x00, 0x00, 0x00, 0x00, // segments = 1
  1, 0x00, 0x00, 0x00, // size = 1
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // "data"
  0x01, 0x00, 0x00, 0x00, // segments = 2
  2, 0x00, 0x00, 0x00, // size = 2
  3, 0x00, 0x00, 0x00, // size = 3
  0x00, 0x00, 0x00, 0x00, // word padding
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // segmnt 1 "data"
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // segmnt 1 "data"
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // segmnt 2 "data"
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // segmnt 2 "data"
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // segmnt 2 "data"
]);

test('can read basic message', function (t) {
  var message = bufferUtil.readMessage(data);
  var nextOffset = message.byteLength;
  t.equals(nextOffset, 16, 'reads message');

  message = bufferUtil.readMessage(data, nextOffset);
  nextOffset = message.byteLength;
  t.equals(nextOffset, 56, 'reads message');
  t.end();
});

test('stream', function (t) {
  t.plan(2);
  var splitter = new CapnpStream();

  splitter.on('message', function (message) {
    t.ok(message, 'gets a message');
  });

  fs.writeFileSync('./test.data', data);
  fs.createReadStream('./test.data').pipe(splitter);
});

test('slow stream', function (t) {
  t.plan(12);
  var splitter = new CapnpStream();

  splitter.on('message', function (message) {
    t.ok(message, 'gets a message');
  });

  var twelveMsgs = Buffer.concat([data, data, data, data, data, data]);

  fs.writeFileSync('./test.data', twelveMsgs);
  fs.createReadStream('./test.data', {
    bufferSize: 32,
    highWaterMark: 32
  }).pipe(through2(transform)).pipe(splitter);

  function transform (chunk, encoding, cb) {
    setTimeout(function () {
      cb(null, chunk);
    }, 10);
  }
  // function flush (chunk, encoding, cb) {
  // }
});
