import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';

import './notificationConfig.html';
import '../userarea/profileSetting/profileSettingSidebar.js';
import '../userarea/profileSetting/profileSettingLayout.html';
import '../userarea/profileSetting/editProfile.js';
import '../userarea/profileSetting/editProfile.html';

Template.notificationConfig.events({
	'click .submitConfig':function(){
		event.preventDefault();
		var Enquiry = $('input[name=Enquiry]:checked').val();
		// var Invoice = $('input[name=Invoice]:checked').val();
		var Rating  = $('input[name=Rating]:checked').val();
		// var Payment = $('input[name=Payment]:checked').val();
		var Follow  = $('input[name=Follow]:checked').val();
		// var UnFollow= $('input[name=UnFollow]:checked').val();
		var Like    = $('input[name=Like]:checked').val();
		// var UnLike  = $('input[name=UnLike]:checked').val();
		var Comment = $('input[name=Comment]:checked').val();
		Meteor.call('insertUserNotifConfig',Enquiry,Rating,Follow,Like,Comment,function(error,result){
			if(error){
				Bert.alert('Something went wrong :',error);
			}else{
				Bert.alert('Updated Successfully!','success','growl-top-right')
			}
		})
	},

});

Template.notificationConfig.helpers({

	scaleProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var enquiryConfig = {
            		'enquiry'   : userData.notificationConfiguration.enquiry,
            	}
			}//notificationConfiguration
		}//userData
		return enquiryConfig;
	},

	ratingProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var ratingConfig = {
            		'rating'   : userData.notificationConfiguration.rating,
            	}
			}//notificationConfiguration
		}//userData
		return ratingConfig;
	},

	followProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var followConfig = {
            		'follow'   : userData.notificationConfiguration.follow,
            	}
			}//notificationConfiguration
		}//userData
		return followConfig;
	},

	// unfollowProcess:function(){
	// 	var userId = Meteor.userId();
	// 	var userData = Meteor.users.findOne({'_id':userId});
	// 	if(userData){
	// 		if(userData.notificationConfiguration){
	// 			var unfollowConfig = {
 //            		'unfollow'   : userData.notificationConfiguration.unfollow,
 //            	}
	// 		}//notificationConfiguration
	// 	}//userData
	// 	return unfollowConfig;
	// },

	likeProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var likeConfig = {
            		'like'   : userData.notificationConfiguration.like,
            	}
			}//notificationConfiguration
		}//userData
		return likeConfig;
	},

	// unlikeProcess:function(){
	// 	var userId = Meteor.userId();
	// 	var userData = Meteor.users.findOne({'_id':userId});
	// 	if(userData){
	// 		if(userData.notificationConfiguration){
	// 			var unlikeConfig = {
 //            		'unlike'   : userData.notificationConfiguration.unlike,
 //            	}
	// 		}//notificationConfiguration
	// 	}//userData
	// 	return unlikeConfig;
	// },

	commentProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var commentConfig = {
            		'comment'   : userData.notificationConfiguration.comment,
            	}
			}//notificationConfiguration
		}//userData
		return commentConfig;
	},

	isCheckedenquiry: function(scaleProcess) {
      return (this.enquiry === scaleProcess) ? "checked" : "";
    },

    isCheckedrating:function(ratingProcess){
    	return (this.rating === ratingProcess) ? "checked" : "";
    },

    isCheckedfollow:function(followProcess){
    	return (this.follow === followProcess) ? "checked" : "";
    },

    // isCheckedunfollow:function(unfollowProcess){
    // 	return (this.unfollow === unfollowProcess) ? "checked" : "";
    // },

    isCheckedlike:function(likeProcess){
    	return (this.like === likeProcess) ? "checked" : "";
    },

    // isCheckedunlike:function(unlikeProcess){
    // 	return (this.unlike === unlikeProcess) ? "checked" : "";
    // },

    isCheckedcomment:function(commentProcess){
    	return (this.comment === commentProcess) ? "checked" : "";
    },
});

notificationConfigForm = function () {  
  BlazeLayout.render("profileSettingLayout",{profileSettings: 'notificationConfig'});
  // Blaze.render(Template.userLayout,document.body);
}
export { notificationConfigForm }