# capnp-split
Split up a capnp stream into its individual messages.

## Installation
```npm i -g capnp-split```
or
```yarn add capnp-split```

## Usage
```js
const CapnpStream = require('capnp-split');

var msgStream = new CapnpStream();
msgStream.on('message', function (data) {
  // data is a buffer containing exactly 1 capnp message
  // this message can still contain any number of segments
});

fs.createReadStream('/path/to/capnp/log').pipe(msgStream);
```

# API
#### `new CapnpStream()` => `WritableStream`
Creates a new writable stream that takes in buffers and emits a `message` event whenever a whole capnp message is readable. Buffers the rest for the next chunk of data.

#### `CapnpStream.readSize(buff, offset)` => `int`
Read the total size of the message starting at `offset`. This method does not esure that the buffer is long enough to contain the message.

 * `buff`: (`Buffer`) The buffer to look at for the size information
 * `offset`: (*optional* `Number`) Defaults to 0. An offset position in bytes to read the size data from.

#### `CapnpStream.readMessage(buff, offset)` => `Buffer`
Read the actual message starting at `offset`. The result buffer will be a `.slice` of the original, meaning the data will not be copied and modifications made to the result will affect the original buffer.

 * `buff`: (`Buffer`) The buffer containing the message data
 * `offset`: (*optional* `Number`) Defaults to 0. An offset position in bytes to read the data from.

# License
MIT
