const Tag = require('../../app/models/tag');

describe('Tag', function () {

  before(function() {
    return dbSetup(true);
  });

  it('should find tag', function () {
    return Tag.byId(DATA.tags[0].id).then(function(result) {
      var serializedResult = result.toJSON();
      var expectedResult = DATA.tags[0];

      expect(serializedResult.id).to.equal(expectedResult.id);
      expect(serializedResult.tag).to.equal(expectedResult.tag);
    });
  });

  it('should find all submissions for a tag', function () {
    return Tag.byId(DATA.tags[0].id).then(function(result) {
      return result.submissions().fetch().then(function(result) {
        // tag 11 is used on both submissions.
        expect(result.models).to.have.length(2);
      });
    });
  });

  it('should find tag by name', function() {
    return Tag.byName('Bar Chart').then(function(tag) {
      expect(tag.attributes.name === 'Bar Chart');
    });
  });
});