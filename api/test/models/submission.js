const Submission = require('../../app/models/submission');

describe('Submission', function () {

  before(function() {
    return dbSetup(true);
  });

  // it('should find all tags', function () {

  // });

  it('should find image', function () {
    Submission.byId(DATA.submissions[0].id).then(function(result) {
      console.log(result);
      expect(result.toJSON()).to.deep.equal(DATA.submissions[0]);
    });
  });

  // it('should find all comments', function () {

  // });

});