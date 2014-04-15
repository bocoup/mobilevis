const Submission = require('../../app/models/submission');

describe('Submission', function () {

  before(function() {
    return dbSetup(true);
  });

  it('should find submission', function () {
    console.log("PLEASE OUTPUT SOMETHING 1 ");
    Submission.byId(DATA.submissions[0].id).then(function(result) {
      console.log("PLEASE OUTPUT SOMETHING 2 ");
      expect(result.toJSON()).to.deep.equal(DATA.submissions[0]);
    }, function(err) {
      console.log(err);
    });
  });

  // it('should find all tags', function () {
  //   Submission.byId(DATA.submissions[0].id).then(function(result) {
  //     result.related('tags').fetch().then(function (result) {
  //       console.log(result.models);
  //       expect(result.models).to.have.length(3);
  //     });
  //   });
  // });

  // it('should find all comments', function () {

  // });

});