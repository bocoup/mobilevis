const Image = require('../../app/models/image');

describe('Image', function () {

  before(function() {
    return dbSetup(true);
  });

  it('should find image', function () {
    return Image.byId(DATA.images[0].id).then(function(result) {
      var serializedResult = result.toJSON();
      var expectedResult = DATA.images[0];

      expect(serializedResult.id).to.equal(expectedResult.id);
      expect(serializedResult.image).to.equal(expectedResult.image);
    });
  });

  it('should find submission for an image', function () {
    return Image.byId(DATA.images[0].id).then(function(result) {
      return result.submission().fetch().then(function(result) {
        expect(result.attributes.id).to.equal(1000);
      });
    });
  });

});