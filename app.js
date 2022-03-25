const port = process.env.PORT || '8000';
const host = process.env.HOST || '127.0.0.1';
const express = require('express');
const app = express();

const env = process.argv[2] === 'development' ? 'development' : 'production';

// Traditional HTML file servers will respond to requests for a directory with
// the file named `index.html` within that directory, if present. The following
// route implements that behavior.
app.get('*', function (req, res, next) {
  res.sendfile(
    req.path + '/index.html',
    {root: __dirname + '/public/'},
    function(err) { if (err) { next(); } else { res.end(); } }
  );
});

app.use(express.static(__dirname + '/public'));

if (env === 'development') {
  app.use('/src', express.static(__dirname + '/src'));
  app.use('/bower_components', express.static(__dirname + '/bower_components'));
  app.use('/data', express.static(__dirname + '/data'));

  app.get('*', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
  });
}

app.listen(port, host);

console.log('Server running on, %s:%d', host, port);
