const config = require('./config.json');
const port = process.env.PORT || config.port;
const host = process.env.HOST || config.host;
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(require(__dirname + '/api'));

app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);