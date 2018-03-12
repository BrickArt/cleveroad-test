const http = require('http');

var app = require('./app');
const config = require('./src/config/index.config');


var server = (app.server = http.createServer(app));
server.listen(process.env.PORT || config.PORT, function () {
    console.log("App listening on port - " + config.PORT + "!");
});