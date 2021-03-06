import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';

export const FollowUser = new Mongo.Collection('followUser');

 
if (Meteor.isServer) {
  // This code only runs on the server
  

}

Meteor.methods({
	'insertUserFollow':function(followUserId){
		var followUserCount = FollowUser.findOne({'userId':Meteor.userId(),'followUserId':followUserId});
		if(!followUserCount){
			var id = FollowUser.insert({  
				"userId"  				: Meteor.userId(),  
				"followUserId"			: followUserId,
				"followingDate"		    : new Date(),
			}, 
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			});	
			return id;
	    }
	},
	'insertOtherUserFollow':function(followUserId,id){
		var followUserCount = FollowUser.findOne({'userId':Meteor.userId(),'followUserId':followUserId});
		if(!followUserCount){
			var id = FollowUser.insert({  
				"userId"  				: id,  
				"followUserId"			: followUserId,
				"followingDate"		    : new Date(),
			}, 
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			});	
			return id;
	    }
	},

	'removeUserFollow':function(id){
		var data= FollowUser.remove(
			{"_id" : id},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
		return data;
	},



	
});
