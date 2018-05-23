import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { UserProfileStoreS3New } from './UserProfileS3.js';

SearchSource.defineSource('tagFriend', function(searchText, options) {
  var options = {};
  var userId = Meteor.userId();


    // =========================================================
    // ==================Get Image URL from Start ==============
    // =========================================================
    var userPageShowImage = (imgId)=> {
      if(imgId){
          var imgData = UserProfileStoreS3New.findOne({"_id":imgId});
          if(imgData)	{
            var data = imgData.url();
          }else{
            var data = '/users/profile/profile_image_dummy.svg';
          }
          return data;
      }
    }
    // =========================================================
    // ==================Get Image URL from End ================
    // =========================================================

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = { "profile.name":  regExp  ,
                      "profile.status":"Active",
                     "_id":{$ne: userId} , 
                     "roles":{$nin: [ 'admin', 'Vendor']} 
                   };
    var data =  Meteor.users.find(selector, options).fetch();
                  

    if(data){
      for(i=0;i<data.length;i++){
        if(data[i].profile.userProfilePic){
          data[i].userPhoto = userPageShowImage(data[i].profile.userProfilePic);
        }else{
          data[i].userPhoto = '/users/profile/profile_image_dummy.svg';
        }
      }
      return data;
    }
  }else {
    var data =  Meteor.users.find({"_id":{$ne: userId} , 
                                  "profile.status":"Active",
                                  "roles":{$nin: [ 'admin', 'Vendor']}}, options).fetch();
    if(data){
      for(i=0;i<data.length;i++){
        if(data[i].profile.userProfilePic){
          data[i].userPhoto = userPageShowImage(data[i].profile.userProfilePic);
        }else{
          data[i].userPhoto = '/users/profile/profile_image_dummy.svg';
        }
      }
      return data;
    }
  }
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}