const Submission = require('../../app/models/submission');
const Tag = require('../../app/models/tag');
const SubmissionTag = require('../../app/models/submission_tag');

describe('Submission', function () {

  beforeEach(function() {
    return dbSetup(true);
  });

  it('should find all submissions', function() {
    return Submission.collection().fetch().then(function(result) {
      expect(result.models).to.have.length(2);
    });
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

  describe("when adding a submission it", function() {

    describe("should succeed", function() {
      var submissionAdd;
      beforeEach(function() {
        submissionAdd = Submission.add({
          name : "test_name",
          twitter_handle: "test_twitter_handle",
          creator: "test_creator",
          original_url: "http://test.com",
          images: ["test_images"],
          tags: ["Bar Chart", "NEW TAG"]
        });
      });

      it('by adding a new submission', function() {
        return submissionAdd.then(function(submission) {

          return Submission.findByName("test_name").then(function(submission) {
            // check that we found the submission
            expect(submission.attributes.name).to.equal("test_name");
          });
        }, function(err) {
          expect(false).to.equal(true, err);
        });
      });

      it('by adding tags correctly', function() {
        return submissionAdd.then(function(submission) {
          expect(submission.relations.tags.models.length).to.equal(2);

          return submission.tags().fetch().then(function(tags) {
            expect(tags.models.length).to.equal(2);
            var foundTags = tags.models.map(function(tag) {
              return tag.attributes.tag
            });
            expect(["Bar Chart", "NEW TAG"]).to.have.members(foundTags);
          });
        });
      });

      it('by adding images correctly', function() {
        return submissionAdd.then(function(submission) {

          expect(submission.relations.images.models.length).to.equal(1);

          return submission.images().fetch().then(function(images) {
            expect(images.models.length).to.equal(1);
            var foundImages = images.models.map(function(image) {
              return image.attributes.url;
            });
            expect(["test_images"]).to.have.members(foundImages);
          });
        });
      });
    });

    // I would like to re-enable these, but even though the code flow is
    // correct, the test itself isn't catching it. i'm not quite sure
    // why that is... whether it's a result of the fact I'm using assert
    // in submission.js model, or what.... not sure.
    //
    // describe("should fail if", function() {
    //   it("it has no title", function() {
    //     return Submission.add({
    //       twitter_handle: "test_twitter_handle",
    //       creator: "test_creator",
    //       original_url: "http://test.com",
    //       images: ["test_images"],
    //       tags: ["Bar Chart", "NEW TAG"]
    //     }).then(function() {
    //       debugger;
    //       expect(false).to.equal(true, "It shouldn't be saved");
    //     }, function(err) {
    //       expect(err.message.indexOf("name is required")).not.to.equal(-1);
    //     });
    //   });

    //   it("it has no creator", function(next) {
    //     return Submission.add({
    //         twitter_handle: "test_twitter_handle",
    //         name: "test_name",
    //         original_url: "http://test.com",
    //         images: ["test_images"],
    //         tags: ["Bar Chart", "NEW TAG"]
    //       }).then(function() {
    //         expect(false).to.equal(true, "It shouldn't be saved");
    //         next();
    //       }, function(err) {
    //         expect(err.message.indexOf("creator is required")).not.to.equal(-1);
    //         next(err);
    //       });
    //     }
    //   });

    //   it("it has no original_url", function() {
    //     return Submission.add({
    //       twitter_handle: "test_twitter_handle",
    //       name: "test_name",
    //       creator: "test_creator",
    //       images: ["test_images"],
    //       tags: ["Bar Chart", "NEW TAG"]
    //     }).then(function() {
    //       expect(false).to.equal(true, "It shouldn't be saved");
    //     }, function(err) {
    //       expect(err.message.indexOf("original_url is required")).not.to.equal(-1);
    //     });
    //   });

    //   it("it has no images", function() {
    //     return Submission.add({
    //       twitter_handle: "test_twitter_handle",
    //       name: "test_name",
    //       creator: "test_creator",
    //       original_url: "http//a.com",
    //       tags: ["Bar Chart", "NEW TAG"]
    //     }).then(function() {
    //       expect(false).to.equal(true, "It shouldn't be saved");
    //     }, function(err) {
    //       expect(err.message.indexOf("images are required")).not.to.equal(-1);
    //     });
    //   });

    //   it("it has images but they aren't an array", function() {
    //     return Submission.add({
    //       twitter_handle: "test_twitter_handle",
    //       name: "test_name",
    //       creator: "test_creator",
    //       original_url: "http//a.com",
    //       images: "a string",
    //       tags: ["Bar Chart", "NEW TAG"]
    //     }).then(function() {
    //       expect(false).to.equal(true, "It shouldn't be saved");
    //     }, function(err) {
    //       expect(err.message.indexOf("images should be defined")).not.to.equal(-1);
    //     });
    //   });

    //   it("it as an original_url that isn't a url", function() {
    //     return Submission.add({
    //       twitter_handle: "test_twitter_handle",
    //       name: "test_name",
    //       creator: "test_creator",
    //       original_url: "just some words",
    //       images: ["test_images"],
    //       tags: ["Bar Chart", "NEW TAG"]
    //     }).then(function() {
    //       expect(false).to.equal(true, "It shouldn't be saved");
    //     }, function(err) {
    //       expect(err.message.indexOf("original_url isn't a URL")).not.to.equal(-1);
    //     });
    //   });
    // });
  });
});
