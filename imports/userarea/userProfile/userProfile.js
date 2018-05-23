import './userProfile.html';
import { UserProfileStoreS3New } from '/client/UserProfileS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';




Template.userProfile.helpers({
	'userDetails' : function(){
		if(Session.get("updateUserTimeline")==true){
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
			// console.log('userprofile|'+id+'|');
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = UserProfileStoreS3New.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						data.profile.userProfilePic = pic.url();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}
					return data;
				}			
			}
		}else{
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				// console.log("checkIdExists: ",checkIdExists);
	
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
			// console.log('userprofile|'+id+'|');
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = UserProfileStoreS3New.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						data.profile.userProfilePic = pic.url();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}
					return data;
				}			
			}
		}
		
	},

	'displayUserProfile' : function(id){
		if(id){
			return true;
		}
		else{
			return false;
		}
	},
});



Template.userProfile.events({

	'click .showAddPhotoTxt' : function(event){
		
		// console.log('showAddPhotoTxt');
		$("input[id='uploadImg']").click();
	},
	
	'change .userProfileImg': function(event,Template){
	     event.preventDefault();
	     FS.Utility.eachFile(event, function(file) {
	       UserProfileStoreS3New.insert(file, function (err, fileObj) {
	         if (err){
	            // handle error
	         } else {
	            // handle success
	     		var filePath = fileObj._id;
		        Meteor.call("updateUserProfileImage", filePath,
		          function(error, result) { 
		              if(error) {
		                  console.log ('Error Message: ' +error ); 
		              }else{
		                  // Bert.alert( 'Image Updated successfully!!!!', 'success', 'growl-top-right' );
		                     // $('.editBlogImage').hide();
		              }
		        });
	     
	          }
	       });
	     });
	},

});

