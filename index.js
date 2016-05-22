var config = require('./server/config/config');
var app = require('./server/server');
var log = require('db.log');

app.listen(config.port);
log.info('listening on http://localhost:' + config.port);
