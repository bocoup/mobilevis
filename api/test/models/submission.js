const Submission = require('../../app/models/submission');
const Tag = require('../../app/models/tag');
const SubmissionTag = require('../../app/models/submission_tag');

describe('Submission', function () {

  beforeEach(function() {
    return dbSetup(true);
  });

  it('should find submission', function () {
    return Submission.byId(DATA.submissions[0].id).then(function(result) {
      var serializedResult = result.toJSON();
      var expectedResult = DATA.submissions[0];

      expect(serializedResult.id).to.equal(expectedResult.id);
      expect(serializedResult.name).to.equal(expectedResult.name);
      expect(serializedResult.creator).to.equal(expectedResult.creator);
    });
  });

  it('should find all tags', function () {
    var expectedTagIds = [11,22,33];
    return Submission.byId(DATA.submissions[0].id).then(function(result) {
      return result.tags().fetch().then(function(result) {
        expect(result.models).to.have.length(3);
        result.models.forEach(function(model) {
          expect(expectedTagIds.indexOf(model.attributes.id) !== -1);
        });
      });
    });
  });

  it('should find all comments', function () {
    return Submission.byId(DATA.submissions[0].id).then(function(result) {
      return result.comments().fetch().then(function(result) {
        expect(result.models).to.have.length(1);
        expect(result.models[0].attributes.id).to.equal(1);
      });
    });
  });

  it('should find all images', function() {
    return Submission.byId(DATA.submissions[0].id).then(function(result) {
      return result.images().fetch().then(function(result) {
        expect(result.models).to.have.length(3);
        expect(result.models[0].attributes.url).to.equal('A1');
        expect(result.models[1].attributes.url).to.equal('B1');
        expect(result.models[2].attributes.url).to.equal('C1');
      });
    });
  });

  it('should tag with a new tag', function() {
    var getSubmission = Submission.byId(DATA.submissions[0].id);
    return getSubmission.then(function(submission) {
      return submission.tagAs('NEWTAG').then(function(submission) {

        // make sure there's a new tag in the collection
        return Tag.collection().fetch().then(function(c) {
          expect(c.models.length).to.equal(7);
          // make sure tag exists
          return Tag.byName('NEWTAG').then(function(tag) {

            expect(tag.attributes.tag).to.be.equal('NEWTAG');

            // make sure submission has extra tag
            return submission.tags().fetch().then(function(result) {
              expect(result.models).to.have.length(4);
            });
          });
        });

      });
    });
  });

  it('should tag with an existing tag', function() {
    var getSubmission = Submission.byId(DATA.submissions[0].id);
    return getSubmission.then(function(submission) {
      return submission.tagAs('Narrative').then(function(submission) {

        // make sure tag exists
        return Tag.byName('Narrative').then(function(tag) {
          expect(tag.attributes.tag).to.be.equal('Narrative');

          // make sure submission has extra tag
          return submission.tags().fetch().then(function(result) {
            expect(result.models).to.have.length(4);
          });
        });
      });
    });
  });

});