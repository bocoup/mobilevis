const port = process.env.PORT || '8000';
const host = process.env.HOST || '127.0.0.1';
const express = require('express');
const app = express();

const env = process.argv[2] === 'development' ? 'development' : 'production';

if (env === 'development') {
  app.use(express.static(__dirname + '/src'));
  app.use('/bower_components', express.static(__dirname + '/bower_components'));
  app.use('/data', express.static(__dirname + '/data'));
}

app.use(express.static(__dirname + '/public'));

app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);
