const config = require('./config.json');
const port = process.env.PORT || config.port;
const host = process.env.HOST || config.host;
const express = require('express');
const app = express();

// app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/src', express.static('src'));
app.use('/bower_components', express.static('bower_components'));

app.use(require('./api'));
app.get('*', function (req, res) {
  res.sendfile('./public/index.html');
});



app.listen(port, host);

console.log('Server running on, %s:%d', host, port);
