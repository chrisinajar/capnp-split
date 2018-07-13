'use strict';

var CapnpSteam = require('./stream');
var buffUtil = require('./buffer');

module.exports = CapnpSteam;
module.exports.readSize = buffUtil.readSize;
module.exports.readMessage = buffUtil.readMessage;