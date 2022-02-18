const port = process.env.PORT || '8000';
const host = process.env.HOST || '127.0.0.1';
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use('/data', express.static(__dirname + '/data'));

app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);
