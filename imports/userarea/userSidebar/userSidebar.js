import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { Bookmark } from '/imports/api/bookmarkMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { FollowUser } from '../../api/userFollowMaster.js';
import { UserReviewStoreS3New } from '/client/UserReviewS3.js';
import { SavedOffer } from '/imports/api/savedOffersMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './userSidebar.html'

Template.userSidebar.events({
	'click .userMenuItem':function(event){        
        $('.userMenuItem').removeClass('active');
        $(event.currentTarget).addClass('active');
	},
});

Template.userSidebar.helpers({
	'hideShowMenu':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			return data;
		}else {
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			return data;
		}			
		
	},

	'siderbarLikesCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var likesData = Likes.find({"userid":id}).fetch();	
			if(likesData){
				var likedDataReturn = {
					noofLikes		: likesData.length,
				}
				return likedDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var likesData = Likes.find({"userid":id}).fetch();	
			if(likesData){
				var likedDataReturn = {
					noofLikes		: likesData.length,
				}
				return likedDataReturn;
			}
		}
		
	},

	'siderbarBookmarkCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var bookmarkData = Bookmark.find({"userId":id}).fetch();
			if(bookmarkData){	
				var bookmarkDataReturn = {
					noofBookmark		: bookmarkData.length,
				}
				return bookmarkDataReturn;
			}else{
				var bookmarkDataReturn = 0;
				return bookmarkDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var bookmarkData = Bookmark.find({"userId":id}).fetch();
			if(bookmarkData){	
				var bookmarkDataReturn = {
					noofBookmark		: bookmarkData.length,
				}
				return bookmarkDataReturn;
			}else{
				var bookmarkDataReturn = 0;
				return bookmarkDataReturn;
			}
		}
	
	},

	'siderbarBeenThereCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var beenThereData = BeenThere.find({"userId":id}).fetch();	
			if(beenThereData){
				var beenThereDataReturn = {
					noofBeenThere		: beenThereData.length,
				}
				return beenThereDataReturn;
			}else{
				var beenThereDataReturn = 0;
				return beenThereDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var beenThereData = BeenThere.find({"userId":id}).fetch();	
			if(beenThereData){
				var beenThereDataReturn = {
					noofBeenThere		: beenThereData.length,
				}
				return beenThereDataReturn;
			}else{
				var beenThereDataReturn = 0;
				return beenThereDataReturn;
			}
		}
		
	},

	'siderbarOffersCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var offersData = SavedOffer.find({"userId":id}).fetch();
			if(offersData){
				var noofoffers	=  offersData.length;
				return noofoffers;
			}else{
				var noofoffers = 0;
				return noofoffers;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var offersData = SavedOffer.find({"userId":id}).fetch();
			if(offersData){
				var noofoffers	=  offersData.length;
				return noofoffers;
			}else{
				var noofoffers = 0;
				return noofoffers;
			}
		}
	
	},

	'siderbarPhotosCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var photoData = Review.find({"userId":id}).fetch();
			var	noofPics = 0;
			if(photoData){
				for (var i = 0; i < photoData.length; i++) {
					if(photoData[i].reviewImages){
						var imgListCount = photoData[i].reviewImages.length;
						for(j = 0 ; j < imgListCount ; j++)
						{
							var imgId =  photoData[i].reviewImages[j];
							var imgData = UserReviewStoreS3New.findOne({"_id":imgId.img});
							if(imgData){
								noofPics++;
							}
						}
					}
				}
				return noofPics;
			}else{
				return noofPics;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var photoData = Review.find({"userId":id}).fetch();
			var	noofPics = 0;
			if(photoData){
				for (var i = 0; i < photoData.length; i++) {
					if(photoData[i].reviewImages){
						var imgListCount = photoData[i].reviewImages.length;
						for(j = 0 ; j < imgListCount ; j++)
						{
							var imgId =  photoData[i].reviewImages[j];
							var imgData = UserReviewStoreS3New.findOne({"_id":imgId.img});
							if(imgData){
								noofPics++;
							}
						}
					}
				}
				return noofPics;
			}else{
				return noofPics;
			}
		}
		
	},

	'followers':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			return FollowUser.find({'followUserId':id}).count();
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			return FollowUser.find({'followUserId':id}).count();
		}
		
	},

	'siderbarReviewCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var ReviewData = Review.find({"userId":id}).count();
			return ReviewData;
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var ReviewData = Review.find({"userId":id}).count();
			return ReviewData;
		}
	
	},

	'ratingsCount':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var RatingData = Review.find({"userId":id}).fetch();	
			if(RatingData){
				var	noofRatingData   = RatingData.length;
				return noofRatingData;
			}else{
				var noofRatingData = 0;
				return noofRatingData;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var RatingData = Review.find({"userId":id}).fetch();	
			if(RatingData){
				var	noofRatingData   = RatingData.length;
				return noofRatingData;
			}else{
				var noofRatingData = 0;
				return noofRatingData;
			}
		}
		

	},

	'enquiryCountUser':function(){
		$("html,body").scrollTop(0);
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var enqCount = Enquiry.find({"enquirySentBy":id}).count();
			if(enqCount){
				var	noofEnquiryData   = enqCount;
				return noofEnquiryData;
			}else{
				var noofEnquiryData = 0;
				return noofEnquiryData;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var enqCount = Enquiry.find({"enquirySentBy":id}).count();
			if(enqCount){
				var	noofEnquiryData   = enqCount;
				return noofEnquiryData;
			}else{
				var noofEnquiryData = 0;
				return noofEnquiryData;
			}
		}
		

	},
});




// q=rightnxt+url&oq=user+data&aqs=chrome..69i57j0j69i60l2j0l2.4907j0j7|{{changeHref}}|&sourceid=chrome&ie=UTF-8 
