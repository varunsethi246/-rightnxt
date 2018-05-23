import { Template } from 'meteor/templating' ;
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo';
import { emptyReviewTemplate } from '../../common/emptyReviewTemplate.html';
import { FollowUser } from '../../api/userFollowMaster.js';
import { Review } from '../../api/reviewMaster.js';
import { ReviewCommentLikes } from '/imports/api/reviewCommentLikesMaster.js';
import { UserProfileStoreS3New } from '/client/UserProfileS3.js';
import { Business } from '/imports/api/businessMaster.js';
import { BusinessImgUploadS3 } from '/client/businessImage.js';
import { UserReviewStoreS3New } from '/client/UserReviewS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './userTimelinePage.html';
import './userSuggestion.html';
import './userTimeline.html';
import '../../common/tagFrnd.js'

var uniqueId = [];
var allReviewsTotalCount = '';
var limitReviews=0;
var loggedinUser = '';
tagedFriends = [];

Template.userSuggestion.helpers ({
	'userSuggestionData': function(){
		var userId         = Meteor.userId();
		var userArray      = [];
		var followArray    = [];
		var currentUserObj = Meteor.users.findOne({"_id":userId});
		console.log("currentUserObj: ",currentUserObj);
		if(currentUserObj && currentUserObj.profile){
			var userCity = currentUserObj.profile.city;
			var otherUsersData  = Meteor.users.find({"profile.city":userCity, "_id":{$ne: userId}, "roles":{$nin: [ 'admin', 'Vendor']}}).fetch();
			if(otherUsersData && otherUsersData.length>0){
				for(var i=0;i<otherUsersData.length;i++){
					console.log("otherUsersData[i]: ",otherUsersData[i]);
					var name           = otherUsersData[i].profile.name;
					// var userProfilePic = otherUsersData[i].profile.userProfilePic;
					var id             = otherUsersData[i]._id;
					var pic            = UserProfileStoreS3New.findOne({"_id":otherUsersData[i].profile.userProfilePic});
					if(pic){
						otherUsersData[i].profile.userProfilePic = pic.url();	
					}
					else{
						otherUsersData[i].profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					var followUser = FollowUser.findOne({'userId':userId , 'followUserId':id});
					if(!followUser){
						var followerCount = FollowUser.find({'followUserId': id}).count();
						var reviewCount   = Review.find({'userId': id}).count();
						var redirectid 	  = generateURLid(id);
						userArray.push({
							'id'                : id,
							'SuggestionInt'     : name,
							'UsersuggestionImg' : otherUsersData[i].profile.userProfilePic,
							'userSuggestionFol' : followerCount,
							'userSuggestionRev' : reviewCount,
							'redirectid'		: redirectid,
						})
						
						
					}//!followUser
				}//i
			}//otherUsersData
		}
		return userArray;
	},
	
});

Template.userTimeline.helpers({


	'timeAgo': function(datetime) {

		console.log('datetime: ',datetime);
	  // if(datetime == ''){
	  //   return 'Never Logged In';
	  // }else{
	  //   // Session.get('time');
	    return moment(datetime).fromNow();
	  // }
	},

	'getFrndsList' : function(){
		var data =  tagFriend1.getData();
	    var data1 = [];
		if(tagedFriends.length > 0){
			for(var i = 0 ; i < data.length ; i++){
				var temp = 0 ;
				for(var j = 0 ; j < tagedFriends.length; j++){
					if(tagedFriends[j].selectedUserId == data[i]._id){
						temp = 1;
						break;
					}
				}
				if(temp == 0 ){
					data1.push(data[i]);
				}
			}
			data = data1;
			var result =  {data,tagedFriends};
		}else{
			var result =  {data,tagedFriends};
		}
	    return result;
	},
	checkCurrentUser:function(userId){
		if(userId == Meteor.userId()){
			return true;
		}else{
			return false;
		}
	},

	businessReviewsCount:function(){

		var following = [];
		var followingUserIds = FollowUser.find({"userId":Meteor.userId()},{"followUserId":1}).fetch();
		limitReviews=0;
		if (followingUserIds){
			var id = Meteor.userId();
			loggedinUser = Meteor.users.findOne({"_id":id},{"profile":1});

			// console.log(followingUserIds);			
			following.push(id);
			for(l=0;l<followingUserIds.length;l++){
				following.push(followingUserIds[l].followUserId);	
			}
		
			uniqueId = _.uniq(following);
			// console.log(uniqueId);
			if(Session.get('loadmore')){
				limitReviews = Session.get('loadmore');
			}else{
				limitReviews = 5;
			}

			allReviewsTotalCount = Review.find({"userId":{$in : uniqueId} },{sort: {reviewDate:-1}}).count();
			if(allReviewsTotalCount){
				if(allReviewsTotalCount > 0){
					return true;
				}else{
					return false;
				}
			}
    	}
	},

	businessReviews:function(){
		var id = Meteor.userId();
		var loggedinUser = Meteor.users.findOne({"_id":id});
		
		var allReviews = Review.find( {
										$or:[ 
												{ "userId":{$in  : uniqueId} } , 
												{ "tagedFriends" : { $elemMatch:{$eq:id}} }
											]
										},
										{sort: {reviewDate:-1}, limit:limitReviews}).fetch();
		if(allReviews){
			if(allReviews.length < 5 || allReviews.length == allReviewsTotalCount){
				allReviews.showLoadMore = 'hideFollowButton';
			}else{
				allReviews.showLoadMore = '';
			}


			for(i=0; i<allReviews.length; i++){		
				console.log("loggedinUser.profile: ",loggedinUser.profile);		
				if(loggedinUser.profile.userProfilePic){
					var userpic = UserProfileStoreS3New.findOne({"_id":loggedinUser.profile.userProfilePic});
					if(userpic){
						allReviews[i].loggedinUserProfilePic = userpic.url();	
					}
					else{
						allReviews[i].loggedinUserProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
				}else{
					allReviews[i].loggedinUserProfilePic = "/users/profile/profile_image_dummy.svg";
				}


				if(allReviews[i].tagedFriends.length != 0){
					allReviews[i].tagedFriendsValidate = true;
					var tagedFriendsArray = [];
					for(m=0;m<allReviews[i].tagedFriends.length;m++){
						var userTagObj = Meteor.users.findOne({"_id":allReviews[i].tagedFriends[m]});
						console.log("userTagObj: ",userTagObj);
						var dataImgUser = '';
						if(userTagObj.profile && userTagObj.profile.userProfilePic){
							var imgData = UserProfileStoreS3New.findOne({"_id":userTagObj.profile.userProfilePic});
							if(imgData)	{
								dataImgUser = imgData.url();
							}else{
								dataImgUser = '/users/profile/profile_image_dummy.svg';
							}
						}else{
							dataImgUser = '/users/profile/profile_image_dummy.svg';
						}

						var obj = {
							'tagedFriends'   : userTagObj.profile.name,
							'tagedFriendsUrl': generateURLid(allReviews[i].tagedFriends[m]),
							'userTagged':allReviews[i].tagedFriends[m],
							'imagePath':dataImgUser,
						}
						tagedFriendsArray.push(obj);
					}
					allReviews[i].tagedFriendsArray = tagedFriendsArray;
				} else{
					allReviews[i].tagedFriendsValidate = false;
				}

				allReviews[i].redirectUid = generateURLid(allReviews[i].userId);
				var userId = allReviews[i].userId;
				if(userId){
					var data = Meteor.users.findOne({"_id":userId},{"profile":1});
					if(allReviews[i].userId == Meteor.userId()){
						allReviews[i].userIDs = allReviews[i].userId;
					}
					console.log("data: ",data);
					if(data.profile && data.profile.userProfilePic){
						var pic = UserProfileStoreS3New.findOne({"_id":data.profile.userProfilePic});
						if(pic){
							allReviews[i].userProfilePic = pic.url();	
						}
						else{
							allReviews[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
						}
						// console.log('data ', data);
						// return data;
					}else{
						allReviews[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
					}
					
					allReviews[i].username = data.profile.name;
				}

				var businessLinkVar=allReviews[i].businessLink;
				var businessData=Business.findOne({'businessLink':businessLinkVar});
				if (businessData){
					allReviews[i].businessTitle = businessData.businessTitle;
					allReviews[i].businessArea = businessData.businessArea;
					allReviews[i].businessCity = businessData.businessCity;

					if(businessData.businessImages.length > 0){
						var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
						if(pic){
							allReviews[i].businessImages = pic.url();
						}else{
							allReviews[i].businessImages = '/images/rightnxt_image_nocontent.jpg';
						}

					}else{
						allReviews[i].businessImages = '/images/rightnxt_image_nocontent.jpg';
					}
				}

				allReviews[i].reviewDateAgo = moment(allReviews[i].reviewDate).fromNow();
				if(allReviews[i].userComments){					
					allReviews[i].userCommentsCount = allReviews[i].userComments.length;
					allReviews[i].userComments = allReviews[i].userComments.reverse();
					for(k=0;k<allReviews[i].userComments.length; k++){
						var userId  = allReviews[i].userComments[k].userId;
						var userObj = Meteor.users.findOne({"_id":userId});
						console.log("userObj: ",userObj);
						if(userObj){
							if(userObj._id == Meteor.userId()){
								allReviews[i].userComments[k].userID = userObj._id;
							}
							allReviews[i].userComments[k].commentUserName = userObj.profile.name;
								if(userObj.profile && userObj.profile.userProfilePic){								
									var pic = UserProfileStoreS3New.findOne({"_id":userObj.profile.userProfilePic});
									if(pic){
										allReviews[i].userComments[k].userProfileImgPath = pic.url();	
									}
									else{
										allReviews[i].userComments[k].userProfileImgPath = "/users/profile/profile_image_dummy.svg";
									}				
								}else{

									allReviews[i].userComments[k].userProfileImgPath = '/users/profile/profile_image_dummy.svg';
								}

							allReviews[i].userComments[k].userCommentDateAgo = moment(allReviews[i].userComments[k].userCommentDate).fromNow();
							allReviews[i].userComments[k].redirectCommUsrId = generateURLid(userId);
						}		


					//=========== Comment Replies =============
						var rn = 0;
					if(allReviews[i].commentReply){
						//create separate of all replies to each comment
						var commentReplyArr = [];
						for(l=0;l<allReviews[i].commentReply.length; l++){
							var replyObj = {};
							// console.log(allReviews[i].commentReply[l].userCommentId + '  |  '+allReviews[i].userComments[k].userCommentId);
							if(allReviews[i].commentReply[l].userCommentId == allReviews[i].userComments[k].userCommentId){
								replyObj.commentReplyUserId = allReviews[i].commentReply[l].userId;
								replyObj.commentReply = allReviews[i].commentReply[l].commentReply;
								replyObj.userCommentID = allReviews[i].commentReply[l].userCommentId;

								replyObj.replyId  = allReviews[i].commentReply[l].userReplyId;
								var userId1  = allReviews[i].commentReply[l].userId;
								var userObj1 = Meteor.users.findOne({"_id":userId1});
								console.log("userObj1: ",userObj1);
								if(userObj1){
									replyObj.commentReplyUserName = userObj1.profile.name;
									if(userObj1.profile && userObj1.profile.userProfilePic){								
										var pic = UserProfileStoreS3New.findOne({"_id":userObj1.profile.userProfilePic});
										if(pic){
											replyObj.replyProfileImgPath = pic.url();	
										}
										else{
											replyObj.replyProfileImgPath = "/users/profile/profile_image_dummy.svg";
										}				
									}else{
										replyObj.replyProfileImgPath = '/users/profile/profile_image_dummy.svg';
									}
									replyObj.commentReplyDateAgo = moment(allReviews[i].commentReply[l].commentReplyDate).fromNow();

									//check if current user has liked the current comment-reply
									var replySelector = {
														"reviewId" 		: allReviews[i]._id,
														"replyId"		: replyObj.replyId.toString(),
														"likedByUserId"	: Meteor.userId(),
													};
									var checkCommentReplyLike =  ReviewCommentLikes.findOne(replySelector);

									// if(checkCommentReplyLike){
									// 	replyObj.replyLikeUnlike = true;
									// }else{
									// 	replyObj.replyLikeUnlike = false;
									// }
									var commentReplyLikeCount = ReviewCommentLikes.find({
																	"reviewId" 		: allReviews[i]._id,
																	"replyId" 		: replyObj.replyId.toString(),
																}).fetch();
									if(commentReplyLikeCount){

										replyObj.commentReplyLikeCount = commentReplyLikeCount.length;
									}
								}
								commentReplyArr.push(replyObj);
								rn++;
							}//if
						}//for
						// console.log('rn ',rn);
						allReviews[i].userComments[k].commentReplyArr = commentReplyArr;
						allReviews[i].userComments[k].commentReplyCount = rn;
						
						// commentReplyArr = [];
					}
					// allReviews[i].userComments[k].commentReplyArr = commentReplyArr;
					// allReviews[i].userComments[k].commentReplyCount = rn;
						
					// commentReplyArr = [];

					//check if current user has liked the current comment
					// console.log('comment: '+JSON.stringify(allReviews[i].userComments[k], 4, null));
					var selector = {
										"reviewId" 		: allReviews[i]._id,
										"commentId" 	: allReviews[i].userComments[k].userCommentId.toString(),
										"likedByUserId"	: Meteor.userId(),
										"replyId" 		: ''
									};
					// console.log(selector);
					var checkCommentLike =  ReviewCommentLikes.findOne(selector);

					if(checkCommentLike){
						// console.log('_id: '+allReviews[i]._id+' | commentid: '+allReviews[i].userComments[k].userCommentId+' | uid: '+Meteor.userId());
						// console.log('checkCommentLike: ',checkCommentLike);
						allReviews[i].userComments[k].likeUnlike = true;
					}else{
						allReviews[i].userComments[k].likeUnlike = false;
					}
					var commentLikeCount = ReviewCommentLikes.find({
												"reviewId" 		: allReviews[i]._id,
												"commentId" 	: allReviews[i].userComments[k].userCommentId.toString(),
												"replyId" 		: ''
											}).fetch();
					if(commentLikeCount){
						allReviews[i].userComments[k].commentLikeCount = commentLikeCount.length;
					}
				}
			}else{
				allReviews[i].userCommentsCount = 0;					
			}				

				if(allReviews[i].reviewLikes){					
					allReviews[i].reviewLikeCount = allReviews[i].reviewLikes.length;
					allReviews[i].likeClass = '';
					for(l=0; l<allReviews[i].reviewLikes.length; l++){
						if(allReviews[i].reviewLikes[l].likedByUser == Meteor.userId() ){
							allReviews[i].likeClass = 'orangeHeart';
							break;
						}
					}
					
				}else{
					allReviews[i].reviewLikeCount = 0;
					allReviews[i].likeClass = '';
				} 

				if(allReviews[i].reviewImages){
					for(j=0;j<allReviews[i].reviewImages.length;j++){
						var reviewPhoto = UserReviewStoreS3New.findOne({"_id":allReviews[i].reviewImages[j].img});
						if(reviewPhoto){
							allReviews[i].reviewImages[j].imagePath = reviewPhoto.url();
						}//reviewphoto
					}//j
				}//allReviews i
			}//i
			
		// console.log("allReviews",allReviews);
			return allReviews;
		}//all review
		
	},

});

Template.userSuggestion.events({
	
	'click .followU':function(event){
		var id = '';
		var link = FlowRouter.current().path;
		var checkIdExists = link.split('/');
		if(checkIdExists[2] != ''&& checkIdExists[2]){
			id = checkIdExists[2];
		}else{
			var value  = this;
			id     = value.id;
		}
		// console.log('follow id ',id);
		Meteor.call('insertUserFollow',id,function(error,result){
			if(error){
				console.log(error.reason);
			}else{
				var getResult = result;
				var followData = FollowUser.findOne({"_id":getResult});
              	if(followData){
                	var usermailId = followData.followUserId;
                	var userVar    = Meteor.users.findOne({'_id':usermailId});
                	if(userVar){
                		var notifConfig = userVar.notificationConfiguration.follow;
                        if(notifConfig == "true"){
		                	var inputObj = {
		                        roles       : 'user',
		                        to          : usermailId,
		                        templateName: 'Follow',
		                        OrderId     : getResult,
		                	}
		                	sendMailnNotif(inputObj);
	                    }
                	}//userVar
              	}//followData 
			}
		});
	},
});

Template.userTimeline.events({
	"keydown #searchFrndsEdit":function(e){
		//For Up and Down arrow selection in dropdown
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
		if(e.keyCode == 9) {
			e.preventDefault();
		}

		var current_index = $('.selectedSearch').index();
		console.log("current_index: ",current_index);
		
		var $number_list = $('.tagFrndUlFrieldList');
		console.log("$number_list: ",$number_list);
		
		var $options = $number_list.find('.tagFrndLiFrieldList');
		// console.log("$options: ",$options);
		
		var items_total = $options.length;
		console.log("items_total: ",items_total);
		if (e.keyCode == 40) {
	        if (current_index + 1 < items_total) {
	            current_index++;
	            change_selection();
	        }
	    } else if (e.keyCode == 38) {
	        if (current_index > 0) {
	            current_index--;
	            change_selection();
	        }
	    }
	    var selectedUser = $('.selectedSearch').attr('data-username');
		var frndId = $('.selectedSearch').attr('id');
		var userImage = $('.selectedSearch').attr('data-photo');


	    if(e.keyCode===9 &&selectedUser.length>0){
	    	selectedUser = selectedUser.trim();
	    	tagedFriends.push({'selectedUser':selectedUser, 'selectedUserId':frndId, 'userImage':userImage});
			$('#searchFrndsEdit').val('');
			
	    }

	    function change_selection() {
			$options.removeClass('selectedSearch');
			$options.eq(current_index).addClass('selectedSearch');
			// To scroll the selection
			var $s = $('.tagFrndUlFrieldList');
			var optionTop = $('.selectedSearch').offset().top;
			var selectTop = $s.offset().top;
			$s.scrollTop($s.scrollTop() + (optionTop - selectTop)-4);
		}
	},
	"keyup #searchFrndsEdit": _.throttle(function(e) {
		if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 37 && e.keyCode != 39){
			$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
			var text = $(e.currentTarget).val();
			tagFriend1.search(text);
		}
	}, 200),
	'click #searchFrndsEdit': function(e){
		e.stopPropagation();
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
	},
	"click .tagFrndLiFrieldList" : function(e){
		var selectedUser = $(e.currentTarget).attr('data-userName');
		var frndId = $(e.currentTarget).attr('id');
		var userImage = $(e.currentTarget).attr('data-photo');
    	selectedUser = selectedUser.trim();
		tagedFriends.push({'selectedUser':selectedUser, 'selectedUserId':frndId, 'userImage':userImage});
		$('#searchFrndsEdit').trigger('keyup');
		$('#searchFrndsEdit').val('');
		
		$('.tagFrndUlFrieldList').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
	},

	"click .bunchTagFrndCross":function(e){
		var userId = $(e.currentTarget).attr('data-userId');
		var tagfrnd = [];
		for(var i = 0 ; i < tagedFriends.length; i++ ){
			if(tagedFriends[i].selectedUserId != userId){
				tagfrnd.push(tagedFriends[i])
			}
		}
		$('#searchFrndsEdit').trigger('keyup');
		tagedFriends = tagfrnd;
	},
	// ============================================================
	// ============================================================
	// ============================================================
	'click .shareBusReview': function(event){
		var currentUserMail = $('#toVEmail').val();
		var currentUserNote = $('#toVAddNote').val();
		var currentPathTwo = Meteor.absoluteUrl();
		var businessLink = $(event.currentTarget).attr('data-busLink');
		var currentPath = currentPathTwo + businessLink;
		var businessData = Business.findOne({"businessLink":businessLink});
		var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		if (currentUserMail==null||currentUserMail==""||!currentUserMail.match(nameRegex)) {
			Bert.alert('Please enter correct Email','danger','growl-top-right');
		} else {
			if(currentUserMail&&currentPath&&businessData){
				//============================================================
				// 			Notification Email / SMS / InApp
				//============================================================
				var currentUserId = Meteor.userId();
				var currentUser = Meteor.users.findOne({'_id':currentUserId});
	
				var admin = Meteor.users.findOne({'roles':'admin'});
				if(admin){
					var adminId = admin._id;
				}
	
				if(currentUser&&currentUser.profile&&admin){
					var username = currentUser.profile.name;
	
					//Send Mail to Shared User Email
					var date 		= new Date();
					var currentDate = moment(date).format('DD/MM/YYYY');
					var msgvariable = {
						'[username]' 		: username,
						'[currentDate]'		: currentDate,
						'[businessName]'	: businessData.businessTitle,
						'[currentPath]' 	: currentPath,
						'[note]'			: currentUserNote,
					   };
	
					var inputObj = {
						from         : adminId,
						to           : currentUserMail,
						templateName : 'Business Page Review Share',
						variables    : msgvariable,
					}
					sendPageShareMail(inputObj);
					$('#Timelineshare').modal('hide');
					
				}
				
				//============================================================
				// 			End Notification Email / SMS / InApp
				//============================================================
			}
	
			$('#toVEmail').val('');
			$('#toVAddNote').val('');
		}
		
	},

	'click .loadmore': function(event){
		if(Session.get('loadmore')){			
			var currentLimit = Session.get('loadmore');
			// console.log("currentLimit",currentLimit);
			var newLimit = currentLimit + 5;
		}else{
			var newLimit = 10;
		}

		Session.set('loadmore',newLimit);

	},

	'keypress .commenTxt': function(event){
		var userComment = $(event.currentTarget).val();
		var reviewedUserId = $(event.currentTarget).attr('data-addedReviewUser');

		if(userComment){
			userComment=userComment.replace(/\s+$/, '');
		}
		if(event.which === 13 && userComment ){
			var id = event.currentTarget.id;
			Meteor.call('insertUserComment', id, userComment, function(error, result){
				if(error){
					// Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
					// Bert.alert('Your comment posted successfully!', 'success', 'growl-top-right');
					$(event.currentTarget).val('');

					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
				    var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }
                    var reviewData = Review.findOne({"_id":id});

                    if(reviewData){
                      	var businessLink = reviewData.businessLink;
                      	var businessData = Business.findOne({"businessLink":businessLink});
				    	
                      	if(businessData){

				    		//Send Notification, Mail and SMS to Vendor
                        	var vendormailId = businessData.businessOwnerId;
                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
                        	if(userDetail && userDetail.profile){
                        		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[currentDate]'	: currentDate,
				   					'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
								    to           : vendormailId,
								    templateName : 'Vendor Review and Rating Comment',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : vendormailId,
								    templateName : 'Vendor Review and Rating Comment',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj); 
		                    }

		                    //Send Notification, Mail and SMS to User
		                    if(reviewData.userComments){
	                      	  	var length = reviewData.userComments.length;
	                      	  	var userId = Meteor.userId();
		                      	var userVar    		= Meteor.users.findOne({'_id':userId});
		                      	var otherUserVar    = Meteor.users.findOne({'_id':reviewedUserId});
		                	  	if(userVar&&otherUserVar &&otherUserVar.profile){
		                	  		
		                	  		// Send mail, SMS, Notification to user that added review 
		                	  		if(reviewedUserId!=userId){
		                	  			var otherUsername 	= otherUserVar.profile.name;
				                		var otherDate 		= new Date();
				                		var othreCurrentDate = moment(otherDate).format('DD/MM/YYYY');
				                		var otherMsgvariable = {
											'[username]' 	: otherUsername,
						   					'[currentDate]'	: othreCurrentDate,
					   						'[businessName]': businessData.businessTitle
						               	};

										var inputObj = {
											notifPath	 : businessLink,
										    to           : reviewedUserId,
										    templateName : 'Other User Review and Rating Comment',
										    variables    : otherMsgvariable,
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : businessLink,
											from         : adminId,
										    to           : reviewedUserId,
										    templateName : 'Other User Review and Rating Comment',
										    variables    : otherMsgvariable,
										}
										sendMailNotification(inputObj);
		                	  		}
		                	  		
									// Only send mail, SMS to current user
									var username 	= userVar.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
				   						'[businessName]': businessData.businessTitle
					               	};
									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : userId,
									    templateName : 'Current User Review and Rating Comment',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
	                      		}                    
		                    }
		                }
                	}
                	//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================

				}
			});
		}
	},

	
	'click .heart' : function(event){

		var likeid = event.currentTarget.id.split('-');
		var id = likeid[1];
		Meteor.call('insertReviewLike',id, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... Your like is not registered.', 'danger', 'growl-top-right');
			}else{
				// Bert.alert('Thanks for liking the comment!', 'success', 'growl-top-right');
				//send mail to the vendor//
                    var admin = Meteor.users.findOne({'roles':'admin'});
				     if(admin){
				     	var adminId = admin._id;
				     }//admin

                    var reviewData = Review.findOne({"_id":id});
                    if(reviewData){
						var businessUrl = reviewData.businessLink;
						var heartColor = $(event.currentTarget).hasClass('orangeHeart');
						
						if(heartColor){

							//============================================================
							// 			Notification Email / SMS / InApp
							//============================================================
							var admin = Meteor.users.findOne({'roles':'admin'});
			                var businessData = Business.findOne({"businessLink":businessUrl});

						    if(admin){
						    	var adminId = admin._id;
						    }
			                var reviewData = Review.findOne({"_id":id});
			                if(reviewData){
			                  	if(businessData){
				                    var vendormailId = businessData.businessOwnerId;
				                    var userDetail = Meteor.users.findOne({'_id':vendormailId});
				                    if(userDetail){
										var userId 	= Meteor.userId();
										var userVar = Meteor.users.findOne({'_id':userId});

			                  			var reviewUserId 	= reviewData.userId;
										var reviewUserVar   = Meteor.users.findOne({'_id':reviewUserId});

										// Send Notification, Mail and SMS to Vendor
										if(userVar&&reviewUserVar){
				                	  		var username 	= userDetail.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
							   					'[LikeDate]'	: currentDate,
								   				'[businessName]': businessData.businessTitle

							               	};

											var inputObj = {
												notifPath	 : businessUrl,
											    to           : vendormailId,
											    templateName : 'Vendor Review and Rating Like',
											    variables    : msgvariable,
											}
											sendInAppNotification(inputObj);

											var inputObj = {
												notifPath	 : businessUrl,
												from         : adminId,
											    to           : vendormailId,
											    templateName : 'Vendor Review and Rating Like',
											    variables    : msgvariable,
											}
											sendMailNotification(inputObj);

											// Send Notification, Mail and SMS to Other User
											var username 	= reviewUserVar.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
							   					'[LikeDate]'	: currentDate,
								   				'[businessName]': businessData.businessTitle

							               	};

							               	if(userId!=reviewUserId){
												var inputObj = {
													notifPath	 : businessUrl,
												    to           : reviewUserId,
												    templateName : 'Other User Review and Rating Like',
												    variables    : msgvariable,
												}
												sendInAppNotification(inputObj);
											

												var inputObj = {
													notifPath	 : businessUrl,
													from         : adminId,
												    to           : reviewUserId,
												    templateName : 'Other User Review and Rating Like',
												    variables    : msgvariable,
												}
												sendMailNotification(inputObj);
											}


											// Send Notification, Mail and SMS to Current User
											var username 	= userVar.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
							   					'[LikeDate]'	: currentDate,
								   				'[businessName]': businessData.businessTitle

							               	};

											var inputObj = {
												notifPath	 : businessUrl,
												from         : adminId,
											    to           : userId,
											    templateName : 'Current User Review and Rating Like',
											    variables    : msgvariable,
											}
											sendMailNotification(inputObj);

					                    }
					                }
			                  	}
			                }
							
			                //============================================================
							// 			End Notification Email / SMS / InApp
							//============================================================
						}

					
                    }//reviewData
				
                $(this).removeClass('heart');

			}
		});
	},

	'click .orangeHeart' : function(event){
		var likeid = event.currentTarget.id.split('-');
		var id = likeid[1];
		Meteor.call('removeReviewLike',id, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... Your like is not registered.', 'danger', 'growl-top-right');
			}else{
				// Bert.alert('Sorry to see you unliked the comment!', 'success', 'growl-top-right');
                $('.userHeart').addClass('heart');

			}
		});
	},


	'click .vModalContentfb':function(event){
		event.preventDefault();
		var id = $('.vModalContentfb').attr('id');
		var url = window.location.href;
		var reviewData = Review.findOne({'_id':id});
		if(reviewData){
			var title       = reviewData.businessLink;
			var description = reviewData.reviewComment;

			var businessData = Business.findOne({'businessLink':title});
			if(businessData){
				if(businessData.businessImages.length > 0){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;

				fbShare(url,title,description,image,id);
			}//businessData
		}//reviewData
		
	},

	'click .vModalContentgp ':function(event){
		event.preventDefault();

		var url = window.location.href;
		// googleplusshare(url);

		var id = $('.vModalContentgp').attr('id');
		var reviewData = Review.findOne({'_id':id});
		if(reviewData){
			var title       = reviewData.businessLink;
			var description = reviewData.reviewComment;

			var businessData = Business.findOne({'businessLink':title});
			if(businessData){
				if(businessData.businessImages.length > 0){
					var pic = BusinessImgUploadS3.findOne({"_id":businessData.businessImages[0].img});
					if(pic){
						businessData.businessImages = pic.copies.businessImgS3.key;
					}else{
						businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
					}

				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

				var img = businessData.businessImages;
				var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;

				
				shareToGooglePlus(url,title,description,image);
			}//businessData
		}//reviewData
	},


	'click .commentLike' : function(event){
		var businessLink 		= $(event.currentTarget).parent().parent().parent().parent().attr('data-businesslink');
		var reviewPostedByUser 	= $(event.currentTarget).parent().parent().parent().parent().attr('data-reviewpostedby');
		var reviewId 			= $(event.currentTarget).parent().parent().parent().parent().attr('data-reviewid');
		var commentId 			= $(event.currentTarget).parent().parent().parent().parent().attr('data-commentid');	

		var currenCommtUser = $(event.currentTarget).attr('data-userCommentId');
		var userId 	= Meteor.userId();
		var checkReviewCommentLike = ReviewCommentLikes.findOne({
			"businessLink"		: businessLink,
			"reviewPostedBy"	: reviewPostedByUser,
			"reviewId"			: reviewId,
			"commentId"			: commentId,
			"replyId"			: '',			
			"likedByUserId"		: Meteor.userId(),  
		});

		// console.log('commentId',commentId);
		Meteor.call('insertReviewTimelineCommentLike',reviewPostedByUser,reviewId,commentId, function(err,rslt){
			if(err){
				console.log('Error: ', err);
			}else{
				// Bert.alert('Thanks for liking the comment!', 'success', 'growl-top-right');
				if(!checkReviewCommentLike){
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessLink});
				    if(admin){
				    	var adminId = admin._id;
				    }


	              	if(businessData){
	                    var vendorId = businessData.businessOwnerId;
	                    var userDetail = Meteor.users.findOne({'_id':vendorId});
	                    if(userDetail){


							var userVar = Meteor.users.findOne({'_id':userId});
							var reviewUserVar   = Meteor.users.findOne({'_id':reviewPostedByUser});
							var reviewCmntRplyUsr   = Meteor.users.findOne({'_id':currenCommtUser});
							
							// Send Notification, Mail and SMS to Vendor
							if(userVar&&reviewUserVar&&reviewCmntRplyUsr){
	                	  		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Like',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Current User
								var username 	= userVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : userId,
								    templateName : 'Current User Review Comment Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Only User that added Review
								var username 	= reviewUserVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=reviewPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : reviewPostedByUser,
									    templateName : 'User Comment Review and Rating Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : reviewPostedByUser,
									    templateName : 'User Comment Review and Rating Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}


								// Send Notification, Mail and SMS to Only User that added Review Comment
								var username 	= reviewCmntRplyUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=currenCommtUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								

		                    }
		                }
	              	}
					
	                //============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			}
		});
	},

	'click .commentReplyLike':function(event){
		var businessLink 		= $(event.currentTarget).parent().parent().parent().find('.commentReplyInput').attr('data-businesslink');
		var reviewPostedByUser 	= $(event.currentTarget).parent().parent().parent().find('.commentReplyInput').attr('data-reviewPostedBy');
		var reviewId 			= $(event.currentTarget).parent().parent().parent().find('.commentReplyInput').attr('data-reviewId');
		var commentId 			= $(event.currentTarget).parent().parent().parent().find('.commentReplyInput').attr('data-commentId');		
		var replyId 			= $(event.currentTarget).attr('data-replyid');
		
		// console.log('businessLink: '+businessLink+' | reviewPostedByUser: '+reviewPostedByUser+' | reviewId: '+reviewId+'| replyId: '+replyId);
		var commentPostedByUser = $(event.currentTarget).attr('data-commentPostedUser');
		var commentReplyPostedUser = $(event.currentTarget).attr('data-commentReplyPostedUser');
		var userId 	= Meteor.userId();

		var notofData =  ReviewCommentLikes.findOne({
										"businessLink":businessLink,
										"reviewPostedBy":reviewPostedByUser,
										"reviewId":reviewId,
										"likedByUserId":userId,
										"commentId":commentId,
										"replyId":replyId
									});


		Meteor.call('insertReviewCommentReplyLike',businessLink,reviewPostedByUser,reviewId,replyId,commentId, function(err,rslt){
			if(err){
				console.log('Error: ', err);
			}else{
				// Bert.alert('Thanks for liking the comment!', 'success', 'growl-top-right');
				if(!notofData){
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businessLink});
				    if(admin){
				    	var adminId = admin._id;
				    }

	              	if(businessData){
	                    var vendorId = businessData.businessOwnerId;
	                    var userDetail = Meteor.users.findOne({'_id':vendorId});

	                    if(userDetail){
							var reviewUserVar   = Meteor.users.findOne({'_id':reviewPostedByUser});
							var reviewCmntUsr   = Meteor.users.findOne({'_id':commentPostedByUser});
							var reviewCmntRplyUsr   = Meteor.users.findOne({'_id':commentReplyPostedUser});
							var userVar = Meteor.users.findOne({'_id':userId});
							
							// Send Notification, Mail and SMS to Vendor
							if(userVar&&reviewUserVar&&reviewCmntRplyUsr&&reviewCmntUsr){
	                	  		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment SubReply Like',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment SubReply Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Current User
								var username 	= userVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businessLink,
									from         : adminId,
								    to           : userId,
								    templateName : 'Current User Review Comment Reply Like',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Only User that added Review
								var username 	= reviewUserVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=reviewPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : reviewPostedByUser,
									    templateName : 'User Added Review and Rating SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : reviewPostedByUser,
									    templateName : 'User Added Review and Rating SubReply Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}


								// Send Notification, Mail and SMS to Only User that added Review Comment
								var username 	= reviewCmntUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=commentPostedByUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : commentPostedByUser,
									    templateName : 'User Review Comment SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : commentPostedByUser,
									    templateName : 'User Review Comment SubReply Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								// Send Notification, Mail and SMS to Only User that added Review Comment Reply
								var username 	= reviewCmntRplyUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=commentReplyPostedUser){
									var inputObj = {
										notifPath	 : businessLink,
									    to           : commentReplyPostedUser,
									    templateName : 'User Added Review Reply SubReply Like',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businessLink,
										from         : adminId,
									    to           : commentReplyPostedUser,
									    templateName : 'User Added Review Reply SubReply Like',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								

		                    }
		                }
	              	}
					
	                //============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			}
		});
	},

	'click .commentReply': function(event){
		event.preventDefault();
		var commentID = this.userCommentId;
		$(event.currentTarget).parent().parent().parent().parent().siblings('.commentReplyInputBox-'+commentID).toggle();
	},

	'click .usrCommentReply': function(event){
		event.preventDefault();
		var commentID = this.userCommentID;
		$(event.currentTarget).parent().parent().siblings('.commentReplyInputBox-'+commentID).toggle();
	},

	'keypress .commentReplyInput': function(event){
		// event.preventDefault();
		var commentReply = $(event.currentTarget).val().trim();

		if(event.which == 13 && commentReply){
			var reviewId 		= $(event.currentTarget).attr("data-reviewId");
			var reviewUser  	= $(event.currentTarget).attr("data-reviewPostedBy");
			var commentId 		= $(event.currentTarget).attr("data-commentId");
			var businesslink 	= $(event.currentTarget).attr("data-businesslink");
			var currenCommtUser = $(event.currentTarget).attr('data-userCommentId');
			

			Meteor.call('insertCommentReply', commentReply, reviewId, reviewUser, commentId, businesslink, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
					// Bert.alert('Your comment posted successfully!', 'success', 'growl-top-right');
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
	                var businessData = Business.findOne({"businessLink":businesslink});
	                
				    if(admin){
				    	var adminId = admin._id;
				    }
	                // var reviewData = Review.findOne({"_id":reviewId});
	                // if(reviewData){
                  	if(businessData){
	                    var vendorId = businessData.businessOwnerId;
	                    var userDetail = Meteor.users.findOne({'_id':vendorId});
	                    if(userDetail){

							var userId 	= Meteor.userId();

							var userVar = Meteor.users.findOne({'_id':userId});
							var reviewUserVar   = Meteor.users.findOne({'_id':reviewUser});
							var reviewCmntRplyUsr   = Meteor.users.findOne({'_id':currenCommtUser});

							// Send Notification, Mail and SMS to Vendor
							if(userVar&&reviewUserVar&&reviewCmntRplyUsr){
	                	  		var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businesslink,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Reply',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businesslink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Review Comment Reply',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								// Send Notification, Mail and SMS to Only User that added Review
								var username 	= reviewUserVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=reviewUser){
									var inputObj = {
										notifPath	 : businesslink,
									    to           : reviewUser,
									    templateName : 'User Added Review and Rating',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businesslink,
										from         : adminId,
									    to           : reviewUser,
									    templateName : 'User Added Review and Rating',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}


								// Send Notification, Mail and SMS to Only User that added Review Comment
								var username 	= reviewCmntRplyUsr.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

				               	if(userId!=currenCommtUser){
									var inputObj = {
										notifPath	 : businesslink,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment',
									    variables    : msgvariable,
									}
									sendInAppNotification(inputObj);
								

									var inputObj = {
										notifPath	 : businesslink,
										from         : adminId,
									    to           : currenCommtUser,
									    templateName : 'User Review Comment',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);
								}

								// Send Notification, Mail and SMS to Current User
								var username 	= userVar.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[LikeDate]'	: currentDate,
					   				'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : businesslink,
									from         : adminId,
								    to           : userId,
								    templateName : 'Current User Review Comment Reply',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

		                    }
		                }
                  	}
	                // }
					
	                //============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================

					$(event.currentTarget).val('');
				}
			});
		}
	},


	'click .userRevCommentDel' : function(event){
		event.preventDefault();
		
		var id = event.target.id;
		var commentId = parseInt($(event.target).attr('data-commentId'));
		var reviewID = $(event.target).parent().parent().parent().parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-reviewId');
		var postedByID = $(event.target).parent().parent().parent().parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-reviewPostedBy');
		var businesLink = $(event.target).parent().parent().parent().parent().parent().parent().parent().parent().siblings('.commentReplyInputBox').find('.commentReplyInput').attr('data-businesslink');
		// var replyId = $(event.target).parent().parent().parent().parent().parent().siblings('.commReplyArray').find('.commentReplyLike').attr('data-replyid');

		// console.log("likeID: ",replyId);
		// console.log("commentId: ",commentId);


		Meteor.call('deletecomment',id,commentId,reviewID,postedByID,businesLink, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... You couldn\'t delete this review.', 'danger', 'growl-top-right');
			}else{
				// Bert.alert('Your review was deleted successfully!', 'success', 'growl-top-right');
				$('.modaldelete').modal('hide');
				$('.modal-backdrop').hide();
			}
		});
	},

	'keypress .commentReplyEditInput': function(event){
		var replyComment = $(event.currentTarget).val();
		if(event.which === 13 && replyComment){

			var id = $(event.target).attr('id');
			var commentId = parseInt($(event.target).attr('data-replyId'));

			// console.log("id: ",id);
			// console.log("commentId: ",commentId);
			// console.log("userComment :"+ replyComment);

			Meteor.call('updateReplyEdit', id, replyComment,commentId, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
			
					// Bert.alert('Your comment posted successfully!', 'success', 'growl-top-right');
					// $(event.currentTarget).val('');
					$('.userReplyText-'+commentId).css('display','block');
					$('.reviewReplyInputBox-'+commentId).css('display','none');
					$('.reviewReplyCancel-'+commentId).css('display','none');
				}
			
			});
		}
	},

	'click .userRevRepEdit':function(event){
		event.preventDefault();
		var id = event.target.id;
		// console.log('id: ',id);
		$('.userReplyText-'+id).css('display','none');
		$('.reviewReplyInputBox-'+id).css('display','block');
		$('.reviewReplyCancel-'+id).css('display','block');
	},

	'click .reviewReplyCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userReplyText-'+id).css('display','block');
		$('.reviewReplyInputBox-'+id).css('display','none');
		$('.reviewReplyCancel-'+id).css('display','none');
	},

	'click .userRevCommentEditPen':function(event){
		event.preventDefault();
		var id = event.target.id;
		$('.userCommentText_'+id).css('display','none');
		$('.editCommentBox_'+id).css('display','block');
		$('.reviewCommCancel-'+id).css('display','block');
	},

	'click .reviewCommCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userCommentText_'+id).css('display','block');
		$('.editCommentBox_'+id).css('display','none');
		$('.reviewCommCancel-'+id).css('display','none');
	},

	'click .userRevComEdit':function(event){
		var id = $(event.target).attr('id');
		$('.userReviewTempcommTxt-'+id).css('display','none');
		$('.editBoxCommentRev-'+id).css('display','block');
		$('.reviewCancel-'+id).css('display','block');
		$('.reviewBusSave-'+id).css('display','block');
		$('.bus-page-edit-outer1-'+id).css('display','inline');
		$('.bus-page-edit-outerFrnd1-'+id).css('display','inline-block');
		$('.tagedFrndDivPre-'+id).css('display','none');
		$('.tagFrnd-'+id).css('display','block');
		
		

		var userData = Review.findOne({"_id": id});
		for(i=0;i<userData.tagedFriends.length;i++){
			var userVar = Meteor.users.findOne({"_id":userData.tagedFriends[i]});
			var userImg = "";
			if(userVar.profile.userProfilePic){
				var imgData = UserProfileStoreS3New.findOne({"_id":userVar.profile.userProfilePic});
				if(imgData)	{
				var userImg = imgData.url();
				}else{
				var userImg = '/users/profile/profile_image_dummy.svg';
				}
			} else{
				var userImg = '/users/profile/profile_image_dummy.svg';
			}
			var obj = 	{
							'selectedUser':userVar.profile.name,
							'selectedUserId':userData.tagedFriends[i], 
							'userImage':userImg,
						}
			tagedFriends.push(obj);
		}
		tagFriend1.search('');
		
	},

	'click .bus-page-edit-outer1': function(event){
		var currentImage = $(event.currentTarget).attr('data-imgId');
		var currentId = $(event.currentTarget).attr('data-reviewId');
		if(currentImage && currentId){
			Meteor.call('removePublishedReviewImage', currentId, currentImage);
		}
	},
	'click .bus-page-edit-outerFrnd1': function(event){
		var taggeduser = $(event.currentTarget).attr('data-tagedId');
		var currentId = $(event.currentTarget).attr('data-reviewId');
		if(taggeduser && currentId){
			Meteor.call('removePublishedReviewUser', currentId, taggeduser);
		}
	},

	'click .reviewCancel':function(event){
		event.preventDefault();
		var id = $(event.target).attr('id');
		$('.userReviewTempcommTxt-'+id).css('display','block');
		$('.editBoxCommentRev-'+id).css('display','none');
		$('.reviewCancel-'+id).css('display','none');
		$('.reviewBusSave-'+id).css('display','none');

		$('.bus-page-edit-outer1-'+id).css('display','none');
		$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
		$('.tagFrnd-'+id).css('display','none');
		$('.tagedFrndDivPre-'+id).css('display','block');
		tagedFriends = [];
		
	},

	'click .userReviewReplyDel' : function(event){
		event.preventDefault();
		// console.log('event: ',$(event.target));
		
		var id = event.currentTarget.id;
		var commentId = parseInt($(event.target).attr('data-commentid'));
		var postedByID = $(event.target).attr('data-reviewPostedBy');
		var businesLink = $(event.target).attr('data-businesslink');
		var cId =  $(event.target).attr('data-cId');

		// console.log("id: ",id);
		// console.log("commentId: ",commentId);
		// console.log("postedByID: ",postedByID);
		// console.log("businesLink: ",businesLink);


		Meteor.call('deleteReply',id,commentId,cId,postedByID,businesLink, function(error, result){
			if(error){
				Bert.alert('Some technical issue happened... You couldn\'t delete this review.', 'danger', 'growl-top-right');
			}else{
				// Bert.alert('Your review was deleted successfully!', 'success', 'growl-top-right');
				$('.modaldelete').modal('hide');
				$('.modal-backdrop').hide();
			}
		});
	},

	'keypress .editReviewTextArea': function(event){

		var revComment = $(event.currentTarget).val();

		if(event.which === 13 && revComment){

			var id = event.currentTarget.id;
			var taggedPpl = tagedFriends;
			
			// var finalId = id.split('-');
			// var commentId = parseInt($(event.target).attr('data-commentId'));

			// console.log("id: ",id);
			// // console.log("commentId: ",commentId);
			// // console.log("userComment :"+ userComment);

			Meteor.call('updateRevCommentEdit', id, revComment, taggedPpl, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your review is not posted.', 'danger', 'growl-top-right');
				}else{
			
					// Bert.alert('Your comment posted successfully!', 'success', 'growl-top-right');
					// $(event.currentTarget).val('');
					$('.userReviewTempcommTxt-'+id).css('display','block');
					$('.editBoxCommentRev-'+id).css('display','none');
					$('.reviewCancel-'+id).css('display','none');
					$('.reviewBusSave-'+id).css('display','none');
					$('.bus-page-edit-outer1-'+id).css('display','none');
					$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
					$('.tagFrnd-'+id).css('display','none');
					$('.tagedFrndDivPre-'+id).css('display','block');
					tagedFriends = [];
					
				}
			
			});
		}
	},


	'click .reviewBusSave': function(event){
		var revComment = $(event.currentTarget).parent().siblings('.editBoxComment').children('.editReviewTextArea').val();
		if(revComment){
			var id = event.currentTarget.id;
			var taggedPpl = tagedFriends;
			
			Meteor.call('updateRevCommentEdit', id, revComment, taggedPpl, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your review is not posted.', 'danger', 'growl-top-right');
				}else{
					$('.userReviewTempcommTxt-'+id).css('display','block');
					$('.editBoxCommentRev-'+id).css('display','none');
					$('.reviewCancel-'+id).css('display','none');
					$('.reviewBusSave-'+id).css('display','none');
					$('.bus-page-edit-outer1-'+id).css('display','none');
					$('.bus-page-edit-outerFrnd1-'+id).css('display','none');
					$('.tagFrnd-'+id).css('display','none');
					$('.tagedFrndDivPre-'+id).css('display','block');
					tagedFriends = [];
				}
			});
		}
	},

	'keypress .editCommentInput': function(event){

		var userComment = $(event.currentTarget).val();

		if(event.which === 13 && userComment){

			var id = event.currentTarget.id;
			var finalId = id.split('-');
			var commentId = parseInt($(event.target).attr('data-commentId'));

			// console.log("id: ",id);
			// console.log("commentId: ",commentId);
			// console.log("userComment :"+ userComment);

			Meteor.call('updateCommentEdit', finalId[1], userComment,commentId, function(error, result){
				if(error){
					Bert.alert('Some technical issue happened... Your comment is not posted.', 'danger', 'growl-top-right');
				}else{
			
					// Bert.alert('Your comment posted successfully!', 'success', 'growl-top-right');
					// $(event.currentTarget).val('');
					$('.userCommentText_'+commentId).css('display','block');
					$('.editCommentBox_'+commentId).css('display','none');
					$('.reviewCommCancel-'+commentId).css('display','none');
					
				}
			
			});
		}
	},
	
});

fbShare = function(URL,title,description,image,id){

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1441873185871088',
      xfbml      : true,
      version    : 'v2.10'
    });

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url'        : URL, 
               'og:title'      : title,
               'og:description': description,
               'og:image'      : image 
            }
        })
        },
      function(response) {});


  };
}

 googleplusshare = function(url) {
  sharelink = "https://plus.google.com/share?url="+url;
  newwindow=window.open(sharelink,'name','height=400,width=600');
  if (window.focus) {newwindow.focus()}                                                                                                                                
  return false;
}  

// GPshare = function(){
// 	(function() {
//            var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
//            po.src = 'http://apis.google.com/js/client:platform.js';
//            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
//          })();
//      var options = {
//                 contenturl: 'http://www.google.com',
//                 contentdeeplinkid: '/pages',
//                 clientid: '918832832305-k5s36thpeu1p0oa5j2valpbcr3qupmce.apps.googleusercontent.com',
//                 cookiepolicy: 'single_host_origin',
//                 prefilltext: 'Hai happy friday'+ Math.random(),
//                 calltoactionlabel: 'INVITE',
//                 calltoactionurl: 'http://www.google.com'
//               };
//               // Call the render method when appropriate within your app to display
//               // the button.
//               gapi.interactivepost.render('vModalContentgp', options);

// } 

 shareToGooglePlus =function(destination,title,description,imageurl){
    var go = "https://plus.google.com/share?";
    var url = "url="+encodeURIComponent(destination);
    var title = "title="+encodeURIComponent(title);
    var description = "content="+encodeURIComponent(description);
    var images = "image="+encodeURIComponent(imageurl);
    // newwindow=window.open(go+url+"&"+title+"&"+description+"&"+images,'name','height=400,width=600');
		sharelink = "https://plus.google.com/share?url="+url;
  	newwindow=window.open(sharelink,'name','height=400,width=600');
  	if (window.focus) {newwindow.focus()}                                                                                                                                
  	return false;
}

googleShare = function(){
	var options = {
    contenturl: 'https://plus.google.com/pages/',
    contentdeeplinkid: '/pages',
    clientid: 'xxxx.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    prefilltext: 'Create your Google+ Page too!',
    calltoactionlabel: 'CREATE',
    calltoactionurl: 'http://plus.google.com/pages/create',
    calltoactiondeeplinkid: '/pages/create'
  };
  // Call the render method when appropriate within your app to display
  // the button.
  gapi.interactivepost.render('sharePost', options);
}


userTimelinePageForm = function () {  
  BlazeLayout.render("userLayout",{main: 'userTimelinePage'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userTimelinePageForm }