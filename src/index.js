const CapnpSteam = require('./stream');
const buffUtil = require('./buffer');

module.exports = CapnpSteam;
module.exports.readSize = buffUtil.readSize;
module.exports.readMessage = buffUtil.readMessage;
