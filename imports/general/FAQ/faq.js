import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactiveVar } from 'meteor/reactive-var';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../../admin/commonAdmin/commonAdmin.js';

import '../generalLayout/generalLayout.js';
import './faq.html';
import './introduction.html';
import './yourAccount.html';
import './review.html';
import './privacy.html';
import './businessOwners.html';
import './FaqForm.html';




Template.introduction.helpers({
	introductionData(){
		console.log('Testing'); 
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.find({"url": actualURL , "tabName": "Introduction"}).fetch();
		if(introduction){
			return introduction;
		}
	},

	inData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.findOne({"url": actualURL , "tabName": "Introduction"});
		if(introduction._id == this._id){
			return true;
		}	
	}
});

Template.yourAccount.helpers({
	yourAccountData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var yourAccount = GeneralContent.find({"url": actualURL , "tabName": "Your Account"}).fetch();
		if(yourAccount){
			return yourAccount;
		}
	},
	inData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.findOne({"url": actualURL , "tabName": "Your Account"});
		if(introduction._id == this._id){
			return true;
		}	
	}
});

Template.review.helpers({
	reviewData(){
		var currentURL = FlowRouter.current().path;	
		var actualURL = currentURL.substring(1);
		var review = GeneralContent.find({"url": actualURL , "tabName": "Reviews"}).fetch();
		if(review){
			return review;
		}
	},
	inData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.findOne({"url": actualURL , "tabName": "Reviews"});
		if(introduction._id == this._id){
			return true;
		}	
	}
});

Template.privacy.helpers({
	privacyData(){
		var currentURL = FlowRouter.current().path;	
		var actualURL = currentURL.substring(1);
		var privacy = GeneralContent.find({"url": actualURL , "tabName": "Privacy"}).fetch();
		if(privacy){
			return privacy;
		}
	},
	inData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.findOne({"url": actualURL , "tabName": "Privacy"});
		if(introduction._id == this._id){
			return true;
		}	
	}
});

Template.businessOwners.helpers({
	businessOwnersData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var businessOwners = GeneralContent.find({"url": actualURL , "tabName": "Business Owners"}).fetch();
		if(businessOwners){
			return businessOwners;
		}
	},
	inData(){
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1);
		var introduction = GeneralContent.findOne({"url": actualURL , "tabName": "Business Owners"});
		if(introduction._id == this._id){
			return true;
		}	
	}
});

Template.faqForm.events({
	'submit #faqadminForm': function(event){
		event.preventDefault();
		if(event.target.faqAns.value){
			$('#cke_select').css('border','1px solid #ccc');
			$('#faqAns').find('p').css('display','none');
			var faqFormValues = {
				"contentType" 		: 'Faq',
				"title" 			: 'Faqs',
				"tabName" 			: event.target.whereToAdd.value,
				"sectionHeading" 	: event.target.faqQue.value,
				"contentBody" 		: event.target.faqAns.value,
			};

			var currentURL = FlowRouter.current().path;
			// if editpage = call update query
			if(currentURL == "/editPages") {
				faqFormValues.id = Session.get('id');
				Meteor.call('updateGeneralContent',faqFormValues,
				function(error, result){
					if(error){
						Bert.alert("Form values not updated.","danger","growl-top-right");
					}else{
						Bert.alert("Data updated sucessfully.","success","growl-top-right");
						$(".faqForm").hide();
						$("html,body").scrollTop(0);						
					}
				});
			}

			// if aboutus-form = call insert query
			if(currentURL == "/admin-FAQ-form"){			
			Meteor.call('insertGeneralContent', faqFormValues,
				function(error,result){
					if(error){
						Bert.alert("Form values not inserted.","danger","growl-top-right");
						return;
					}else{
						Bert.alert("Data inserted sucessfully.","success","growl-top-right");
						event.target.faqQue.value			= '';
						event.target.faqAns.value 			= CKEDITOR.instances['select'].setData('');
						return;
					}
				});
			}	
		}
		else{
			// Bert.alert("Please enter data in the field !!!","danger","growl-top-right");
			$('#cke_select').css('border','1px solid red');
			var editor = CKEDITOR.instances['select'];
			if(editor) 
			{
				editor.focus();
			}
			$('#cke_select').focus();
			$('#faqAns').html('<p>This field is required</p>');
			$('#faqAns').find('p').css({
				'color': 'red',
				'font-family' : 'PROXIMANOVA-REGULAR',
			    'font-size' : '15px',
			});
		}
	}
});

Template.introduction.events({
	'click .intro': function(event){
    	var $this = $(event.target);
    	var acc = $($this).parent().parent().parent();
    	if($this.hasClass('panel-heading')){
    		$this.toggleClass('panel-color');
    		if($this.hasClass('panel-color')){
	    		$this.find('i').removeClass("fa-angle-down");
	    		$this.find('i').addClass("fa-angle-up");
	    	}
	    	else{
	    		$this.find('i').removeClass("fa-angle-up");
	    		$this.find('i').addClass("fa-angle-down");
	    	}
    	}
    	$('.intro').not($this).removeClass('panel-color');
    	$('.intro').not($this).find('i').removeClass('fa-angle-up');
    	$('.intro').not($this).find('i').addClass('fa-angle-down');
	},
});

Template.yourAccount.events({
	'click .yourAccount': function(event){
    	var $this = $(event.target);
    	var acc = $($this).parent().parent().parent();
    	if($this.hasClass('panel-heading')){
    		$this.toggleClass('panel-color');
    		if($this.hasClass('panel-color')){
	    		$this.find('i').removeClass("fa-angle-down");
	    		$this.find('i').addClass("fa-angle-up");
	    	}
	    	else{
	    		$this.find('i').removeClass("fa-angle-up");
	    		$this.find('i').addClass("fa-angle-down");
	    	}
    	}
    	$('.yourAccount').not($this).removeClass('panel-color');
    	$('.yourAccount').not($this).find('i').removeClass('fa-angle-up');
    	$('.yourAccount').not($this).find('i').addClass('fa-angle-down');
	},
});

Template.review.events({
	'click .review': function(event){
    	var $this = $(event.target);
    	var acc = $($this).parent().parent().parent();
    	if($this.hasClass('panel-heading')){
    		$this.toggleClass('panel-color');
    		if($this.hasClass('panel-color')){
	    		$this.find('i').removeClass("fa-angle-down");
	    		$this.find('i').addClass("fa-angle-up");
	    	}
	    	else{
	    		$this.find('i').removeClass("fa-angle-up");
	    		$this.find('i').addClass("fa-angle-down");
	    	}
    	}
    	$('.review').not($this).removeClass('panel-color');
    	$('.review').not($this).find('i').removeClass('fa-angle-up');
    	$('.review').not($this).find('i').addClass('fa-angle-down');
	},
});

Template.privacy.events({
	'click .privacy': function(event){
    	var $this = $(event.target);
    	var acc = $($this).parent().parent().parent();
    	if($this.hasClass('panel-heading')){
    		$this.toggleClass('panel-color');
    		if($this.hasClass('panel-color')){
	    		$this.find('i').removeClass("fa-angle-down");
	    		$this.find('i').addClass("fa-angle-up");
	    	}
	    	else{
	    		$this.find('i').removeClass("fa-angle-up");
	    		$this.find('i').addClass("fa-angle-down");
	    	}
    	}
    	$('.privacy').not($this).removeClass('panel-color');
    	$('.privacy').not($this).find('i').removeClass('fa-angle-up');
    	$('.privacy').not($this).find('i').addClass('fa-angle-down');
	},
});

Template.businessOwners.events({
	'click .owner': function(event){
    	var $this = $(event.target);
    	var acc = $($this).parent().parent().parent();
    	if($this.hasClass('panel-heading')){
    		$this.toggleClass('panel-color');
    		if($this.hasClass('panel-color')){
	    		$this.find('i').removeClass("fa-angle-down");
	    		$this.find('i').addClass("fa-angle-up");
	    	}
	    	else{
	    		$this.find('i').removeClass("fa-angle-up");
	    		$this.find('i').addClass("fa-angle-down");
	    	}
    	}
    	$('.owner').not($this).removeClass('panel-color');
    	$('.owner').not($this).find('i').removeClass('fa-angle-up');
    	$('.owner').not($this).find('i').addClass('fa-angle-down');
	},
});

Template.faq.onRendered(function(event, instance){
	$('html, body').scrollTop(0);
});

Template.faqForm.onRendered(function(event, instance){
	$('html, body').scrollTop(0);

	$("#faqadminForm").validate({
	 	rules: {
	        faqQue: {
	            required: true,
	        },
    	},
    	"invalidHandler": function(form, validator) {
			if (!validator.numberOfInvalids())
	      	return;
        	jQuery('html, body').animate({
	      		scrollTop: jQuery(validator.errorList[0].element).offset().top-100
			});
	    },
    });
});

faqForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'faq'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { faqForm };

faqFormThree = function () {  
  BlazeLayout.render("adminLayout",{main: 'faqForm'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { faqFormThree };

