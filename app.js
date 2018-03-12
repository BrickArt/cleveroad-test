const express = require('express');
const app = express();
global.__root = __dirname + '/';

const mongoose = require('./src/lib/mongoose')



// Setup express
app.disable("x-powered-by");



// Add headers
const setHeaders = require(__root + 'src/middleware/setHeaders');
app.use(setHeaders);



//routes
app.get('/api', function (req, res) {
    res.status(200).send('API works.');
});

var UserController = require(__root + 'src/router/user/user.controller');
app.use('/api/user', UserController);

var AuthController = require(__root + 'src/router/auth/auth.controller');
app.use('/api', AuthController);


var ItemController = require(__root + 'src/router/item/item.controller');
app.use('/api', ItemController);


app.use(express.static(__root + 'public'));



module.exports = app;