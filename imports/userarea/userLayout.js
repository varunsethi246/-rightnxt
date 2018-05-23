import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './userLayout.html';
import './userProfile/userProfile.js';
import './userSidebar/userSidebar.js';
import '../common/header.html';
import '../common/generalHeader.js';
import '../common/searchbar.js';
import '../common/vendorSignUpForm.js';

 Template.userLayout.events({

	'click .bussScrollTop' : function(event){
    	var $this = $(event.target);
		$('html, body').animate({
   		     scrollTop: $('body').offset().top
      		}, 1000,
  		);
    },
});
Template.userLayout.onRendered(function(){
	$(window).scroll(function() {
     	if ($(document).scrollTop() > 80) {
	    	$('.bussScrollTop').fadeIn("slow");
	    } else {
	    	$('.bussScrollTop').fadeOut("slow");
	    }
    });
});

// Template.userLayout.onRendered(function(){
// 	var link = FlowRouter.current().path;
// 	var checkIdExists = link.split('/');
// 	if(checkIdExists[2]){
// 		alert('checkIdExists'); 
// 		// console.log('checkIdExists');
// 		$(".addPhotoTxt").hide();
// 		$(".prfSetting").hide();
// 		$(".usersidebarUl").children().first('userMenuItem').hide();
// 		$(".usersidebarUl").children().last('userMenuItem').hide();
// 		$(".usersidebarUl").children('.userMenuItem:nth-child(3)').addClass('active');
// 	}
// });

 
