const Comment = require('../../app/models/comment');

describe('Comment', function () {

  before(function() {
    return dbSetup(true);
  });

  it('should find comment', function () {
    return Comment.byId(DATA.comments[0].id).then(function(result) {
      var serializedResult = result.toJSON();
      var expectedResult = DATA.comments[0];

      expect(serializedResult.id).to.equal(expectedResult.id);
      expect(serializedResult.comment).to.equal(expectedResult.comment);
    });
  });

  it('should find submission for an comment', function () {
    return Comment.byId(DATA.comments[1].id).then(function(result) {
      return result.submission().fetch().then(function(result) {
        expect(result.attributes.id).to.equal(2000);
      });
    });
  });

});
