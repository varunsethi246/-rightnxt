// var businessVideoStore = new FS.Store.S3("businessVideo");

// export const BusinessVideoUpload = new FS.Collection("businessVideo", {
//   stores: [businessVideoStore],
//   filter: {
//     allow: {
//       contentTypes: ['video/*']
//     }
//   }
// });

// BusinessVideoUpload.allow({
//   insert: function() {
//     return true;
//   },
//   update: function() {
//     return true;
//   },
//   remove: function() {
//     return true;
//   },
//   download: function(fileObj) {
//     return true;
//   }
// });


// BusinessVideoUpload.deny({
//   insert: function() {
//     return false;
//   },
//   update: function() {
//     return false;
//   },
//   remove: function() {
//     return false;
//   },
//   download: function() {
//     return false;
//   }
// });



import { FilesCollection } from 'meteor/ostrio:files';

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}