import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './homepage.html';
import './homepageSearch';
import './homepageBanner';
import './homepageHowItWorks';
import './homepageProductCarousel.html';
import './homepageProductCarousel.js';
import './homepageServicesCarousel.html';
import './homepageServicesCarousel.js';
import './homepageBanner.js';
// import '../../vendor/businessList/businessSearchList.js';

// import '/common/anonymousUserLayout.html'
import { City } from '../../api/masterData/cityMaster.js';
// import { City } from './imports/api/masterData/cityMaster.js';

// import '/imports/common/anonymousUserLayout.js';
import '/imports/common/common.js';
import '../mainBusinessSearch/mainBusinessSearch.js';

Template.homepage.helpers({
   	isReady: function(){
   		console.log(FlowRouter.subsReady());
       return true;
       // return FlowRouter.subsReady();
   },
});

Template.homepageBanner.onRendered(function(){
	$(window).scroll(function(){$(document).scrollTop()>25?$(".visible-lg").addClass("homepageBannerlg"):$(".visible-lg").removeClass("homepageBannerlg"),$(document).scrollTop()>80?$(".homeScrollTop").fadeIn("slow"):$(".homeScrollTop").fadeOut("slow"),$(document).scrollTop()>120&&($(".howWork").addClass("fadeInUp"),$(".howWork").css("animation-duration","0.9s"),$(".howWork1").addClass("fadeInUp"),$(".howWork1").css("animation-delay","0.2s"),$(".howWork1").css("animation-duration","1.2s"),$(".howWork2").addClass("fadeInUp"),$(".howWork2").css("animation-delay","0.4s"),$(".howWork2").css("animation-duration","1.5s"),$(".howWork3").addClass("fadeInUp"),$(".howWork3").css("animation-delay","0.6s"),$(".howWork3").css("animation-duration","1.8s"))}),$("body").scrollTop(0);
});

Template.homepage.events({
    'click .homeScrollTop' : function(event){
    	var $this = $(event.target);
		$('html, body').animate({
   		     scrollTop: $('body').offset().top
      		}, 1000,
  		);
    },
    'focusin .getBusiness1' : function(event){
    	$(".str-tag-input1").css({outline:"none",border:"1px solid #f89b1c"});
    },
    'focusout .getBusiness1' : function(event){
    	$(".str-tag-input1").css({outline:"none",border:"1px solid #ccc"});
    }
});
 
Template.anonymousUserLayout.events({
	'click #how-a' : function(event){
        var $this=$(event.target.hash);if(""!==$this){event.preventDefault();var hash=$this;$("html, body").animate({scrollTop:$(hash).offset().top},800,function(){window.location.hash="howitworks"})}
    },
});

Homepage = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'homepage'});
}

export { Homepage };