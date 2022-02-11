const s3 = require('../classes/s3');
const Busboy = require('busboy');

module.exports = function (req, res, next) {

  // start streaming request parser
  var busboy = new Busboy({headers: req.headers});

  // hold fields from the form (populated as they stream in)
  req.body = {};

  // array of objects representing files that got uploaded to S3
  req.files = [];

  // the number of files currently being streamed to s3
  var streaming = 0;

  // flag to see if anything at all has been uploaded
  var anything = false;

  // a flag indicating if busboy is done parsing the request
  var done = false;

  // store fields on req.body as they arrive. we will use them
  // later, when the the request is complete
  busboy.on('field', function (name, value) {
    req.body[name] = value;
  });

  // detect each file as it arrives
  busboy.on('file', function (field, stream, filename) {

    // if there is no filename, there is no file.
    if (!filename) {
      // read the stream or busboy will never end
      stream.read();
      return;
    }
    streaming++;
    anything = true;
    // stream it to S3
    s3.writeStream(stream, filename).then(function (uuid) {
      streaming--;
      // push file details to a stack for later
      req.files.push({
        uuid: uuid,
        field: field,
        filename: filename
      });
      // yay, all files are finshed uploading!
      if(done && streaming === 0) {
        // now that the request is complete, we can join the
        // descriptions with each uploaded file
        // this is pretty brittle, but it works for now.
        req.files = req.files.map(function (file) {
          file.description = req.body[file.field+'_description'];
          return file;
        });
        next();
      }
    }).catch(function (e) {
      console.log(e);
      res.send(500);
    });
  });

  //flag that no more data will arrive
  busboy.on('end', function() {
    done = true;
    // if nothing was uploaded, continue
    if (!anything) {
      next();
    }
  });

  busboy.on('finish', function() {
    done = true;
    // if nothing was uploaded, continue
    if (!anything) {
      next();
    }
  });

  req.pipe(busboy);

};
