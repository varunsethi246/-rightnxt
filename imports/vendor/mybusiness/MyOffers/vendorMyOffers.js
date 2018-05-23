import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../../api/businessMaster.js';
import { Offers } from '../../../api/offersMaster.js';
import { Payment } from '../../../api/paymentMaster.js';
import { CompanySettings } from '../../../api/companysettingsAPI.js';
import { OfferImagesS3 } from '/client/offersImagesS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../vendor.js';
import './VendorMyoffers.html';
import './vendorOffer1.html';
import './vendorOffer2.html';
import './offerAccordian.html';
import './offerPayment.html';
import './paymentInvoice.html';
import './receipt.html';
import './editOffer.html';
import './paymentSuccess.html';
import './paymentFailed.html';


var files = [];

function printDiv() 
{
  var divToPrint=document.getElementById('DivIdToPrint');

  var newWin=window.open('', 'PRINT', 'height=400,width=600');

  newWin.document.open();

  //For potrait view
  newWin.document.write('<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
  
  //For landscape view
  // newWin.document.write('<html><head><style type="text/css" media="print">@page { size: landscape; }</style></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

  newWin.document.close();

  // setTimeout(function(){newWin.close();},10);

}

Template.vendorOffer1.onRendered(function(){
	$('.changeDate').val(moment(new Date()).add(1, 'days').format('YYYY-MM-DD'));
});

Template.vendorMyOffers.helpers({
	businessName(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"},{"businessTitle":1});
		return businessName;
	},

	paymentBtn(){
		var businessLink = FlowRouter.getParam("businessLink");
		var businessObj = Business.findOne({"businessLink":businessLink, "status":"active"});
		var valueObj = {'value' : 'disabled'};
		if(businessObj){
			var unpaidOffers = Offers.find({"vendorId":Meteor.userId(),
											"businessId":businessObj._id,
											"offerStatus":"new"}).count();
			if(unpaidOffers){
				if(unpaidOffers > 0){
					var valueObj = {'value' : ''};
				}
				return valueObj;				
			}
		}		
		return valueObj;				
	},

	monthChange(){
		if(Session.get('noOfMonths')){
			var data= Session.get('noOfMonths');
			return data;
		}else{
			return false;
		}
	},
});


Template.paymentSuccess.helpers({
	paymentSuccessfull(){
		var status      = FlowRouter.getQueryParam('status');
	    var id          = FlowRouter.getQueryParam('id');
	    var billnumbers = FlowRouter.getQueryParam('billnumbers');
	    var checksum    = FlowRouter.getQueryParam('checksum');
		var userId      = Meteor.userId();
		var payId    	= FlowRouter.getQueryParam('orderId');
 
	    if(status == 'paid'){
              Meteor.call("insertOnlineDetailsToOffers",id, billnumbers, payId, function(err,result){
                if(result){

				}
			});
		}

	},
	invoiceDetailsForOnline(){
		var invNum 			= parseInt(FlowRouter.getQueryParam('InvNo'));
		var businessLink 	= FlowRouter.getQueryParam('BusLink');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});
		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});

		if(paymentDetails){
			var offers = [];
			var totalPrice = 0;
			for( var i = 0 ; i< paymentDetails.offers.length ; i++)
			{

				var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});

				offers[i] = {
					"i"			   : (i+1),
					offerId 	   : paymentDetails.offers[i].offerId,
					dealHeadline   : offerObj.dealHeadline,
					numberOfMonths : offerObj.numOfMonths,
					ratePerOffer   : paymentDetails.offerPricePerMonth,
					totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
				}
				totalPrice     = (totalPrice + offers[i].totalAmount);
			}
			
			var dateTime = paymentDetails.invoiceDate.toLocaleString();
			var newDateTime = moment(dateTime).format('DD/MM/YYYY hh:mm:ss');

			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				merchantRef				: paymentDetails._id.toUpperCase(),
				transactionID			: paymentDetails.transactionId,
				invDate					: newDateTime,
				paymentMode 			: paymentDetails.modeOfPayment,
				totalAmount				: paymentDetails.totalAmount,
				totalPrice				: totalPrice,
				transactionMsg 			: 'Payment Successful'
			}
			return data;
		}
	},
});

Template.vendorMyOffers.events({
	'change .offrdInput': function(event){		
		var offrdInput = event.currentTarget.value;
		Session.set('numberOfOffers', offrdInput);
	},

	'change .numOfMonths': function(event){
		Session.set('numOfMonths', '');
		var numOfMonths = event.currentTarget.value;
		Session.set('numOfMonths', numOfMonths);
	},

	'focusout .changeDate': function(event){
		var targetVal = $('.changeDate').val();
		var newTodayVal = moment(targetVal).format('YYYY-MM-DD');
		$('.changeDate').val(newTodayVal);
		var noOfMonths = $('.numOfMonths').val();
		if(!noOfMonths){
			noOfMonths = 1;
		}
		$('.changeMonth').val(moment(newTodayVal).add(noOfMonths, 'M').format('YYYY-MM-DD'));
	},

	'focusout .changeMonth': function(event){
	 	Session.set('noOfMonths','');
		Session.set('numOfMonths', '');
		var changeFromDate = $('input[name="expirationFromDate"]').val();
		var changeToDate = event.currentTarget.value;
		if(changeFromDate < changeToDate ){
			var toYear = moment(changeToDate).year();
			var fromYear = moment(changeFromDate).year();
			var diffYear = toYear - fromYear;
			var toMonth = moment(changeToDate).month();
			var fromMonth = moment(changeFromDate).month();
			if(diffYear > 1){
				if(toMonth < fromMonth){
					var totalMonths = (12 - fromMonth) + ((diffYear - 1) * 12) + toMonth;
				}else{
					var totalMonths = (12 - fromMonth) + ((diffYear - 1) * 12) + toMonth;
				}
			}else{
				if(toMonth < fromMonth){
					var totalMonths =  (12 - toMonth) -(12 - fromMonth)  ;
				}else{
					var totalMonths = toMonth - fromMonth;
				}
			}
			 	Session.set('noOfMonths',totalMonths);
			 	Session.set('numOfMonths',totalMonths);
		}else{
			Bert.alert('To Date should be greater than From Date','danger','growl-top-right')
		}
	},

	'click .panel-heading': function(event){
    	var $this = $(event.target);
   		if($this.hasClass('panel-heading')){
    		$this.toggleClass('accordianSelect');
    		$this.find('i').addClass('fa-angle-up');
    		$this.find('i').removeClass('fa-angle-down');
    		var toggleClass = $this.parent().find('.panel-collapse');
    		if(toggleClass.hasClass('in')){
    			$this.find('i').removeClass('fa-angle-up');
	    		$this.find('i').addClass('fa-angle-down');
    		}else{
    			
    		}
    		$('.panel-heading').not($this).removeClass('accordianSelect');
	    	$('.panel-heading').not($this).find('i').removeClass('fa-angle-up');
    		$('.panel-heading').not($this).find('i').addClass('fa-angle-down');
    	}
    	else if($this.hasClass('panel-title')){
    		$this.parent().toggleClass('accordianSelect');
    		$this.find('i').addClass('fa-angle-up');
    		$this.find('i').removeClass('fa-angle-down');
    		var toggleClass = $this.parent().parent().find('.panel-collapse');
    		if(toggleClass.hasClass('in')){
    			$this.find('i').removeClass('fa-angle-up');
	    		$this.find('i').addClass('fa-angle-down');
    		}else{
    			
    		}
    		$('.panel-title').not($this).parent().removeClass('accordianSelect');
   		 	$('.panel-title').not($this).find('i').removeClass('fa-angle-up');
    		$('.panel-title').not($this).find('i').addClass('fa-angle-down');
    	}
	},

	'submit #OrderForm': function(event){
		event.preventDefault();
		var $this = $(event.target);
		$($this).find('input[name="save1"]').attr('disabled','disabled');

		var businessId =  $('input[name="businessId"]').val();
		var numOfMonths = $('input[name="numOfMonths"]').val();
		var imgId = '';
		if(files[0]){
			Resizer.resize(files[0], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
					OfferImagesS3.insert(files[0], function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        if(err){
				        	console.log('Error : ' + err.message);
				        }else{
				        	imgId =  fileObj._id ;
						    var formValues = {
								"businessId"			: businessId,
								"vendorId"  			: Meteor.userId(),
								"dealTemplate" 			: event.target.dealTemplate.value,
								"dealHeadline"			: event.target.dealHeadline.value,
								"dealDescription" 		: event.target.dealDescription.value,
								"expirationFromDate" 	: event.target.expirationFromDate.value,
								"expirationToDate" 		: event.target.expirationToDate.value,
								"legalNotices"			: event.target.legalNotices.value,
								"offerStatus"			: 'new',
								"numOfMonths"			: numOfMonths,
								"offerImage"			: imgId,
							};

							// var $this = $(event.target);
							Meteor.call('insertOffers',formValues,
								function(error, result, event){
									if(error){
										Bert.alert(error.reason, 'danger','growl-top-right');
										$($this).find('input[name="save1"]').removeAttr('disabled');
									}
									else{
										// Bert.alert("Offer saved sucessfully.",'success','growl-top-right');
										// ============================================================
										// 			Notification Email / SMS / InApp
										// ============================================================
										var vendorId = Meteor.userId();
										// console.log('vendorId ',vendorId); 
										var admin = Meteor.users.findOne({'roles':'admin'});
										// console.log('admin ',admin);

										var vendorDetail = Meteor.users.findOne({'_id':vendorId});
										// console.log('vendorDetail ',vendorDetail);

										var businessDetails = Business.findOne({"_id":businessId});
										// console.log('businessDetails ',businessDetails);
										if(businessDetails){
											if(admin&&vendorDetail){
										    	var adminId = admin._id;

												//Send Notification, Mail and SMS to Current Vendor
												var vendorname 	= vendorDetail.profile.name;
												var username 	= admin.profile.firstName;

							            		var date 		= new Date();
							            		var currentDate = moment(date).format('DD/MM/YYYY');
							            		var msgvariable = {
													'[vendorname]' 	: vendorname,
								   					'[currentDate]'	: currentDate,
													'[businessName]': businessDetails.businessTitle,
													'[dealHeadline]': formValues.dealHeadline

								               	};

												var inputObj = {
													notifPath	 : businessDetails.businessLink,
												    to           : vendorId,
												    templateName : 'Thanks for Submiting Offer',
												    variables    : msgvariable,
												}
												sendInAppNotification(inputObj);

												var inputObj = {
													notifPath	 : businessDetails.businessLink,
													from         : adminId,
												    to           : vendorId,
												    templateName : 'Thanks for Submiting Offer',
												    variables    : msgvariable,
												}
												sendMailNotification(inputObj);

												//Send Notification, Mail and SMS to Admin
							            		var date 		= new Date();
							            		var currentDate = moment(date).format('DD/MM/YYYY');
							            		var msgvariable = {
													'[vendorname]' 	: vendorname,
													'[adminname]'	: username,
								   					'[currentDate]'	: currentDate,
													'[businessName]': businessDetails.businessTitle,
													'[dealHeadline]': formValues.dealHeadline
								               	};

												var inputObj = {
													notifPath	 : businessDetails.businessLink,
												    to           : adminId,
												    templateName : 'Vendor has Submiting Offer',
												    variables    : msgvariable,
												}
												sendInAppNotification(inputObj);

												var inputObj = {
													notifPath	 : businessDetails.businessLink,
													from         : adminId,
												    to           : adminId,
												    templateName : 'Vendor has Submiting Offer',
												    variables    : msgvariable,
												}
												sendMailNotification(inputObj); 
											}
										}
										//============================================================
										// 			End Notification Email / SMS / InApp
										//============================================================
										
										Bert.alert("Offer saved sucessfully.",'success','growl-top-right');

									}
								}	
							);
						}
				    });
				}
			});
		}else{
			imgId = '/images/rightnxt_image_nocontent.jpg';
			var formValues = {
				"businessId"			: businessId,
				"vendorId"  			: Meteor.userId(),
				"dealTemplate" 			: event.target.dealTemplate.value,
				"dealHeadline"			: event.target.dealHeadline.value,
				"dealDescription" 		: event.target.dealDescription.value,
				"expirationFromDate" 	: event.target.expirationFromDate.value,
				"expirationToDate" 		: event.target.expirationToDate.value,
				"legalNotices"			: event.target.legalNotices.value,
				"offerStatus"			: 'new',
				"numOfMonths"			: numOfMonths,
				"offerImage"			: imgId,
			};

			// var $this = $(event.target);
			Meteor.call('insertOffers',formValues,
				function(error, result, event){
					if(error){
						Bert.alert(error.reason, 'danger','growl-top-right');
						$($this).find('input[name="save1"]').removeAttr('disabled');
					}
					else{
						Bert.alert("Offer saved sucessfully.",'success','growl-top-right');
						// $($this).find('input[name="save1"]').attr('disabled','disabled');
						// $($this).find('.drag').show();
						// $($this).find('input[name="choosePic"]').css('margin-top','0px');
						// ============================================================
						// 			Notification Email / SMS / InApp
						// ============================================================
						var vendorId = Meteor.userId();
						var admin = Meteor.users.findOne({'roles':'admin'});
						var vendorDetail = Meteor.users.findOne({'_id':vendorId});
						var businessDetails = Business.findOne({"_id":businessId});
						if(businessDetails){
							if(admin&&vendorDetail){
						    	var adminId = admin._id;

								//Send Notification, Mail and SMS to Current Vendor
								var vendorname 	= vendorDetail.profile.name;
								var username 	= admin.profile.firstName;

			            		var date 		= new Date();
			            		var currentDate = moment(date).format('DD/MM/YYYY');
			            		var msgvariable = {
									'[vendorname]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
									'[businessName]': businessDetails.businessTitle,
									'[dealHeadline]': formValues.dealHeadline

				               	};

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
								    to           : vendorId,
								    templateName : 'Thanks for Submiting Offer',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Thanks for Submiting Offer',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj);

								//Send Notification, Mail and SMS to Admin
			            		var date 		= new Date();
			            		var currentDate = moment(date).format('DD/MM/YYYY');
			            		var msgvariable = {
									'[vendorname]' 	: vendorname,
									'[adminname]'	: username,
				   					'[currentDate]'	: currentDate,
									'[businessName]': businessDetails.businessTitle,
									'[dealHeadline]': formValues.dealHeadline
				               	};

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
								    to           : adminId,
								    templateName : 'Vendor has Submiting Offer',
								    variables    : msgvariable,
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : businessDetails.businessLink,
									from         : adminId,
								    to           : adminId,
								    templateName : 'Vendor has Submiting Offer',
								    variables    : msgvariable,
								}
								sendMailNotification(inputObj); 
							}
						}
						//============================================================
						// 			End Notification Email / SMS / InApp
						//============================================================
					}
				}	
			);
		}
	},

	'click #offersub': function(event){
		event.preventDefault();

	    var businessId =  $('input[name="businessId"]').val();
	    var businessLink =  $('input[name="businessLink"]').val();
		
	 	var formValues = {
			"businessId"  			: businessId,
			"businessLink" 			: businessLink,
		};

		//If vendor already has invoice with 'unpaid' status in payment collection,
		// then don't add new invoice in payment collection.
		var unpaidInvoiceObj = Payment.findOne({"vendorId"	 	: Meteor.userId(), 
												"businessId" 	: formValues.businessId,
												"paymentStatus" : 'unpaid',
												"orderType"		: 'Offer',
											  });
		if(unpaidInvoiceObj){
			var invNum = unpaidInvoiceObj.invoiceNumber;
			//If unpaid invoice for this business exists, then check if any new offer is still 
			//pending to be added into invoice - payment collection
			var offersArray = Offers.find({"vendorId"	 	: Meteor.userId(), 
										   "businessId" 	: formValues.businessId,
										   "offerStatus" 	: 'new'
										  }).fetch(); 
			if(unpaidInvoiceObj.offers){
				if(offersArray){
					if(unpaidInvoiceObj.offers.length != offersArray.length){
						for(i=0; i<offersArray.length; i++){
							var offerFound = 'notfound';
							for (j=0; j<unpaidInvoiceObj.offers.length;j++) {
								if(offersArray[i]._id == unpaidInvoiceObj.offers[j].offerId){
									offerFound = 'found';
									break;
								} 
							}
							if(offerFound != 'found'){
								Meteor.call('addNewOfferinPayment',unpaidInvoiceObj._id, offersArray[i]._id,
									function(error,result){
										if(error){
											Bert.alert('There is some error while adding recent offer to invoice!','danger','growl-top-right');
										}
										else{
											console.log('checking1');
											Bert.alert('Your recent new Offer added to Invoice.','success','growl-top-right');
										}
									}
								);									
							}
						}
					}
				}
			}
			FlowRouter.go('/businessOffers/:businessLink/invoice/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invNum});
		}else{
			Meteor.call('insertPayment',formValues,
				function(error, result){
					if(error){
						Bert.alert(error.reason, 'danger','growl-top-right');
					}
					else{
						Bert.alert("Payment Invoice is Created!",'success','growl-top-right');
						var payid = result;
						// send mail to admin //
	                    var userData = Meteor.users.findOne({'roles':'admin'});
	                    if(userData){
	                      	var adminID = userData._id; 
	                    }//userData

	                    //send mail to the vendor//
                     	var paymentData = Payment.findOne({"_id":payid,"orderType":'Offer'});
                      	if(paymentData){
                      		var invoiceNumber 	= paymentData.invoiceNumber;
                      		var invoiceDate 	= moment(paymentData.invoiceDate).format();
                      		var numberOfOffers 	= paymentData.numberOfOffers;
                      		var totalAmount 	= paymentData.totalAmount;
                      		var paymentDate		= paymentData.paymentDate;
                        	var busPaymentId 	= paymentData.businessId;
                        	var busId 			= Business.findOne({'_id':busPaymentId});
                        	if(busId){
                        		var vendorname 		= busId.ownerFullName;
                        		var businessName 	= busId.businessTitle;
                        	}
                        	var date 		= new Date();
		                	var currentDate = moment(date).format('DD/MM/YYYY');
		                	var vendormailId = paymentData.vendorId;
                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
	                        if(userDetail){
				                var msgvariable = {
									'[invoiceNumber]' 	: invoiceNumber,
									'[invoiceDate]' 	: invoiceDate,
									'[numberOfOffers]' 	: numberOfOffers,
									'[totalAmount]' 	: totalAmount,
									'[paymentDate]' 	: paymentDate,
									'[busPaymentId]' 	: busPaymentId,
									'[businessName]' 	: businessName,
									'[username]' 		: vendorname,
				   				   	// '[orderNo]' 	: '12345',
				                   	'[orderDate]'		: currentDate
				               	};

								var inputObj = {
								    to           : vendormailId,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendInAppNotification(inputObj);
								var inputObj = {
									from         : adminID,
								    to           : vendormailId,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendMailNotification(inputObj); 
								var inputObj = {
									from         : vendormailId,
								    to           : adminID,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendMailNotification(inputObj); 
								var inputObj = {
								    to           : adminID,
								    templateName : 'Invoice',
								    variables    : msgvariable,
								}

								sendInAppNotification(inputObj); 

	                         //    var notifConf = userDetail.notificationConfiguration.invoice;
	                         //    if(notifConf == "true"){
		                        // 	// var inputObj = {
			                       //  //     roles       : 'Vendor',
			                       //  //     to          : vendormailId,
			                       //  //     templateName: 'Invoice',
			                       //  //     OrderId     : payid,
		                        // 	// }
		                        // 	// sendMailnNotif(inputObj);
		                        // }
		                    }
                      	}//paymentData 
	                   

						var maxInvNum = Payment.find({"orderType":'Offer'}, {sort: {invoiceNumber:-1, limit:1}}).fetch();
						if(maxInvNum.length > 0){
							var invNum = maxInvNum[0].invoiceNumber;
							FlowRouter.go('/businessOffers/:businessLink/invoice/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invNum});
						}
					}
				}
			);
		}
	},
});

Template.paymentInvoice.helpers({
	invoiceDetails(){
		var invNum 			= parseInt(FlowRouter.getParam('invoiceNumber'));
		var businessLink 	= FlowRouter.getParam('businessLink');

		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});

		// var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});

		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum});


		if(paymentDetails){
			var offers = [];
			var totalPrice = 0;
			for( var i = 0 ; i< paymentDetails.offers.length ; i++)
			{
				var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});
				offers[i] = {
					"i"			   : (i+1),
					offerId 	   : paymentDetails.offers[i].offerId,
					dealHeadline   : offerObj.dealHeadline,
					numberOfMonths : offerObj.numOfMonths,
					ratePerOffer   : paymentDetails.offerPricePerMonth,
					totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
				}
				totalPrice     = (totalPrice + offers[i].totalAmount);
			}
			
			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				companyAddress			: companyDetails.companyLocationsInfo[0].companyAddress,
				companyPincode			: companyDetails.companyLocationsInfo[0].companyPincode,
				companyCity				: companyDetails.companyLocationsInfo[0].companyCity,
				companyState			: companyDetails.companyLocationsInfo[0].companyState,
				companyCountry			: companyDetails.companyLocationsInfo[0].companyCountry,
				vendorCompanyName 		: businessDetails.businessTitle,
				vendorCompanyAddress 	: businessDetails.businessAddress,
				vendorPincode			: businessDetails.businessZipCode,
				vendorCity				: businessDetails.businessCity,
				vendorState				: businessDetails.businessState,
				vendorArea				: businessDetails.businessArea,
				ratePerOffer 			: companyDetails.rates.ratePerOffer,
				invDate					: moment(paymentDetails.invoiceDate).format('DD/MM/YYYY'),
				invNum 					: paymentDetails.invoiceNumber,
				numberOfMonths			: paymentDetails.numberOfMonths,
				totalAmount				: paymentDetails.totalAmount,
				offers 					: offers,
				totalPrice				: totalPrice,
				paymentMode 			: paymentDetails.modeOfPayment,
			}
			return data;
		}
	},
});

Template.paymentInvoice.events({
	'click #placeOrder':function(event){
		event.preventDefault();

		var businessLink = FlowRouter.getParam('businessLink');
		var invoiceNumber = FlowRouter.getParam('invoiceNumber');
		var mode = $('input[name="modeOfPayment"]:checked').val();

		var receiptObj = Payment.findOne({"vendorId"	  : Meteor.userId(),
										   "businessLink" : businessLink,
										   "invoiceNumber": parseInt(invoiceNumber),
										   "orderType"    :'Offer',
										});
		if(receiptObj){
			if(mode == 'Cash'){
				for (var i = 0; i < receiptObj.offers.length; i++) {
					Meteor.call('updateInvoiceforPayment',receiptObj._id,receiptObj.offers[i].offerId,mode, 
						function(error,result){
							if(error){
								Bert.alert("Error occurs while payment!","danger","growl-top-right");
							}else{
								Bert.alert("Payment successfully completed.","success","growl-top-right");
								var id = receiptObj._id;

								// send mail to admin //
			                    var userData    = Meteor.users.findOne({'roles':'admin'});
			                    if(userData){
				                    var adminID = userData._id;
			                   	}//userData

			                    //send mail to the vendor//
		                     	var paymentData = Payment.findOne({"_id":id,"orderType":'Offer'});
		                      	if(paymentData){
		                        	var vendormailId = paymentData.vendorId;
		                        	var userDetail = Meteor.users.findOne({'_id':vendormailId});
		                        	
			                        if(userDetail){
			                            var notifConf = userDetail.notificationConfiguration.payment;
			                            if(notifConf == "true"){
			                            	var busPaymentId 	= paymentData.businessId;
				                      		var invoiceDate 	= moment(paymentData.invoiceDate).format();
				                      		var numberOfOffers 	= paymentData.numberOfOffers;
				                      		var totalAmount 	= paymentData.totalAmount;
				                      		var paymentDate		= paymentData.paymentDate;
				                        	var busPaymentId 	= paymentData.businessId;
				                        	var busId 			= Business.findOne({'_id':busPaymentId});
				                        	if(busId){
				                        		var vendorname 		= busId.ownerFullName;
				                        		var businessName 	= busId.businessTitle;
				                        	}
				                        	var date 		= new Date();
		                					var currentDate = moment(date).format('DD/MM/YYYY');
			                            	var msgvariable = {
												'[vendorname]' 			: vendorname,
												'[invoiceDate]' 		: invoiceDate,
												'[numberOfOffers]' 		: numberOfOffers,
												'[totalAmount]' 		: totalAmount,
												'[paymentDate]' 		: paymentDate,
												'[busPaymentId]' 		: busPaymentId,
							   				   	'[businessName]' 		: businessName,
							                   	'[currentDate]'			: currentDate
						               	  	};


											var inputObj = {
											    to           	: vendormailId,
											    templateName 	: 'Payment Successfull',
											    variables    	: msgvariable,
											}

											sendInAppNotification(inputObj);

											var inputObj = {
												from         : adminID,
											    to           : vendormailId,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendMailNotification(inputObj);

											var inputObj = {
											    to           : adminID,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendInAppNotification(inputObj);

											var inputObj = {
												from         : vendormailId,
											    to           : adminID,
											    templateName : 'Payment Successfull',
											    variables    : msgvariable,
											}

											sendMailNotification(inputObj);  
					                    }
					                }
		                      	}//paymentData 
								FlowRouter.go('/:businessLink/receipt/:invoiceNumber',{'businessLink':businessLink, 'invoiceNumber':invoiceNumber});
							}
						}
					);
				}
			}
			else{
				//Send user to Payment Gateway link
				Meteor.call('updateInvoiceforOnlinePayment', businessLink, parseInt(invoiceNumber), (error, result)=>{
					if(result){
						window.location = result;
					}
				});
			}
		}
	},	
});

Template.offerPayment.helpers({
	orderData(){
		var companyRates = CompanySettings.findOne({'companyId':101},{"rates":1,"_id":0});

		if(Session.get('numberOfOffers')){
			var numOfOffers = Session.get('numberOfOffers');
		}else{
			var numOfOffers = 1;
		}

		if(Session.get('numOfMonths')){
			var numOfMonths = Session.get('numOfMonths');
		}else{
			var numOfMonths = 1;
		}

		if(companyRates){
			var value = {
				"ratePerOffer" 	: companyRates.rates.ratePerOffer,
				"numOfOffers"	: numOfOffers,
				"numOfMonths"	: numOfMonths,
				"totalPrice"	: companyRates.rates.ratePerOffer * numOfOffers * numOfMonths,
			}
			return value;			
		}
	},
	monthChange(){
		if(Session.get('noOfMonths')){
			var noOfMonths = Session.get('noOfMonths');
			var price = this.ratePerOffer * this.numOfOffers * noOfMonths;
			var data = {
				noOfMonths : noOfMonths,
				price 	   : price
			}
			// console.log('data',data);
			return data;
		}else{
			return false;
		}
	}
});

Template.offerAccordian.helpers({
	numberOfOffers(){
		if(Session.get('numberOfOffers')){
			var numberOfOffers = Session.get('numberOfOffers');
			var value = [];
			for(i=0;i<numberOfOffers;i++){
				value[i] = {"i":(i+1)};
			}
			return value;
		}else{
			return [{"i":1}];
		}
	},
	inData(){
		if(this.i == 1){
			return true;
		}	
	}
});

Template.vendorOffer1.helpers({
	dateData(){
		var date = moment().date((moment().date())+1);
		var newDate = moment(date).format('YYYY-MM-DD');
		return newDate;
	},

	todateData(){
		// console.log('todateData ',todateData);
		var date = moment().date((moment().date())+1);
		var newDate = moment(date).format('YYYY-MM-DD');
		
		if(Session.get('numOfMonths')){
			var numOfMonths = Session.get('numOfMonths');
			var newMonth = moment(newDate).month((moment().month())+parseInt(numOfMonths));
		}
		else{
			var newMonth = moment(newDate).month((moment().month())+1);
		}

		var dateMonth = moment(newMonth).format('YYYY-MM-DD');
		return dateMonth;
	},

	numberOfOffers(){
		if(Session.get('numberOfOffers')){
			var numberOfOffers = Session.get('numberOfOffers');
			var value = [];
			for(i=0;i<numberOfOffers;i++){
				value[i] = {"i":(i+1)};
			}
			return value;
		}else{
			return [{"i":1}];
		}
	},
});

Template.vendorOffer1.events({
	'change .businessPhotofiles' : function(event){
		var $this = $(event.target);
		$this.parent().parent().find('output').empty();
		$this.parent().next().find('.drag').hide();
		$this.parent().find('input[name="choosePic"]').css('margin-top','45%');
		var imageId = $this.parent().parent().find('output').attr('id');
		files = event.target.files; // FileList object\
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
			files[i].businessLink = Session.get('SessionBusinessLink');
			
		    // Only process image files.
		    if (!f.type.match('image.*')) {
		      continue;
			}

			var reader = new FileReader();
			
			// Closure to capture the file information.
		    reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.
		        var span = document.createElement('span');
		        span.innerHTML = ['<img class="thumbnail draggedImg imgVendorSpan" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/><i class="pull-right fa fa-times-circle cursorPointer" id="imgVendorSpan" aria-hidden="true"></i>'].join('');
		        document.getElementById(imageId).insertBefore(span, null);
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		}// end of for loop
	},	
	'click #imgVendorSpan' :  function(event){
		// $(event.target).parent().parent().empty();
		$('input[name="files"]').val('');
		$(event.target).parent().hide();
		$(event.target).hide();
		$(event.target).parent().parent().parent().find('.drag').show();
		$(event.target).parent().parent().parent().parent().children().find('.uploadButton1').css('margin-top','0px');
	},
	// 'change .changeDate' : function(event){

	// },
});

Template.vendorOffer2.helpers({
	formvaluesData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		var offerData = Offers.find({}).fetch();
		var count = 0;
		if(offerObj){
			var dateToDate = offerObj.expirationToDate;
			var date1 = moment(dateToDate).format('YYYY-MM-DD');
			var dateFromDate = offerObj.expirationFromDate;
			var date2 = moment(dateFromDate).format('YYYY-MM-DD');

			var data={
				dealHeadline 		: offerObj.dealHeadline,
				dealDescription 	: offerObj.dealDescription,
				expirationFromDate  : date2,
				expirationToDate	: date1,
				legalNotices 		: offerObj.legalNotices,
				offerImage 			: offerObj.offerImage,
				id 					: offerObj._id,
			}
		}
		return data;
	},
	offerImgData(){
		var offerId = Session.get('id');
		var offerObj = Offers.findOne({"_id":offerId});
		if(offerObj){
			var pic = OfferImagesS3.findOne({'_id' : offerObj.offerImage});
		}
		return pic;
	}
});

Template.vendorOffer2.events({
	'click #locationIcon': function(event){
		event.preventDefault();
		FlowRouter.go('/terms-of-service');
		if(FlowRouter.current().path == '/terms-of-service'){
			$('.modal-backdrop').hide();
		}
	},
	'submit #OfferForm': function(event){
		event.preventDefault();
		var id = $(event.target).parent().parent().parent().parent().parent().find('i').attr('id');
		var offers = Offers.findOne({"_id":id});
		var offersImgId = offers.offerImage;
		var monthVal = (moment($(event.target).find('input[name="expirationFromDate"]').val()).month())+1;
		var monthVal1 = (moment($(event.target).find('input[name="expirationToDate"]').val()).month())+1;
		var num = parseInt(monthVal1) - parseInt(monthVal);
		if(num < 0){
			var offerStatus = 'inactive';
		}else if(offers.offerStatus == 'active'){
			var offerStatus = 'active';
		}else if(num > 0 && offers.offerStatus == 'inactive'){
			var offerStatus = 'inactive';
		}
		else{
			var offerStatus = 'new';
		}
		
		if(files[0]){
			Resizer.resize(files[0], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
					OfferImagesS3.insert(files[0], function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        if(err){
				        	console.log('Error : ' + err.message);

				        }else{
				        	OfferImagesS3.remove(offersImgId);
				        	imgId = fileObj._id;
				        	var formValues = {
								"dealTemplate" 			: event.target.dealTemplate.value,
								"dealHeadline"			: event.target.dealHeadline.value,
								"dealDescription" 		: event.target.dealDescription.value,
								"expirationFromDate" 	: event.target.expirationFromDate.value,
								"expirationToDate" 		: event.target.expirationToDate.value,
								"legalNotices"			: event.target.legalNotices.value,
								"numOfMonths"			: num,
								"offerImage"			: imgId,
								"offerStatus"			: offerStatus
							};

							Meteor.call('updateOffers',formValues,id,
								function(error, result){
									if(error){
										Bert.alert(error.reason,"danger","growl-top-right");
									}else{
										Bert.alert("Offer updated sucessfully.","success","growl-top-right");
										$('.modal-backdrop').hide();
										$('.modaledit').hide();
									}
								}
							);
						}
					});
		        }
			});
		}else{
			if($(event.target).find('output').is(':empty') && $(event.target).find('.vendor2Img').is(':empty')){
        		OfferImagesS3.remove(offersImgId);
				offerImageId = '/images/rightnxt_image_nocontent.jpg';
			}else{
				offerImageId = offersImgId;
			}

			var formValues = {
				"dealTemplate" 			: event.target.dealTemplate.value,
				"dealHeadline"			: event.target.dealHeadline.value,
				"dealDescription" 		: event.target.dealDescription.value,
				"expirationFromDate" 	: event.target.expirationFromDate.value,
				"expirationToDate" 		: event.target.expirationToDate.value,
				"legalNotices"			: event.target.legalNotices.value,
				"numOfMonths"			: num,
				"offerImage"			: offerImageId,
				"offerStatus"			: offerStatus
			};

			Meteor.call('updateOffers',formValues,id,
				function(error, result){
					if(error){
						Bert.alert(error.reason,"danger","growl-top-right");
					}else{
						Bert.alert("Offer updated sucessfully.","success","growl-top-right");
						$('.modal-backdrop').hide();
						$('.modaledit').hide();
					}
				}
			);
		}
	},
	'change .businessOffersfiles' : function(event){
		var $this = $(event.target);
		$this.parent().parent().find('output').empty();
		// $('.drag').hide();
		$this.parent().next().find('.drag').hide();
		$this.parent().parent().find('.vendor2Img').empty();
		var imgId = $this.parent().parent().find('output').attr('id','setImgID');
		var imageId = $this.parent().parent().find('output').attr('id');
		// $this.parent().parent().css('margin-bottom','-30px');

		files = event.target.files; // FileList object\
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
			files[i].businessLink = Session.get('SessionBusinessLink');
			
		    // Only process image files.
		    if (!f.type.match('image.*')) {
		      continue;
			}

			var reader = new FileReader();
			
			// Closure to capture the file information.
		    reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.
		        var span = document.createElement('span');
		        span.innerHTML = ['<img class="thumbnail draggedImg imgVendorSpan" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById(imageId).insertBefore(span, null);
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		}// end of for loop
	},	
});

Template.receipt.helpers({
	receiptDetails(){
		var invNum 			= parseInt(FlowRouter.getParam('invoiceNumber'));
		var businessLink 	= FlowRouter.getParam('businessLink');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var companyDetails 	= CompanySettings.findOne({'companyId':101});
		var paymentDetails 	= Payment.findOne({'invoiceNumber':invNum,"orderType":'Offer'});

		if(paymentDetails){
			var offers = [];
			var totalPrice = 0;
			for( var i = 0 ; i< paymentDetails.offers.length ; i++)
			{

				var offerObj 	=  Offers.findOne({"_id":paymentDetails.offers[i].offerId});

				offers[i] = {
					"i"			   : (i+1),
					offerId 	   : paymentDetails.offers[i].offerId,
					dealHeadline   : offerObj.dealHeadline,
					numberOfMonths : offerObj.numOfMonths,
					ratePerOffer   : paymentDetails.offerPricePerMonth,
					totalAmount    : parseInt(offerObj.numOfMonths) * parseInt(paymentDetails.offerPricePerMonth),
				}
				totalPrice     = (totalPrice + offers[i].totalAmount);
			}
			
			var dateTime = paymentDetails.invoiceDate.toLocaleString();
			var newDateTime = moment(dateTime).format('DD/MM/YYYY hh:mm:ss');

			var data = {
				businessName			: businessDetails.businessTitle ,
				companyName				: companyDetails.companyName,
				merchantRef				: paymentDetails._id.toUpperCase(),
				invDate					: newDateTime,
				paymentMode 			: paymentDetails.modeOfPayment,
				totalAmount				: paymentDetails.totalAmount,
				totalPrice				: totalPrice,
				transactionMsg 			: 'Payment Successful'
			}
			return data;
		}
	},
});

Template.receipt.events({
	'click .button2': function(event){
		var businessLink = FlowRouter.getParam('businessLink');
		FlowRouter.go('/businessOffers/:businessLink',{'businessLink':businessLink});
	},
	'click .button1': function(event){
		printDiv();
	},
	'click .shareReceiptEmail' : function(event){
		var userId = Meteor.userId();
		var userDetails = Meteor.users.findOne({'_id':userId});
		if(userDetails){
			var email = $('#toVEmail').val();
		    var divToPrint=document.getElementById('DivIdToPrint');
			var message = '<html><head></head><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>'; 
			// console.log('message ',message);

			var date 		= new Date();
			var currentDate = moment(date).format('DD/MM/YYYY');
			var businessLink = FlowRouter.getParam('businessLink');
			var businessDetails = Business.findOne({"businessLink":businessLink});
			if(businessDetails){
				var msgvariable = {
					'[receipt]' 	: message,
					'[currentDate]'	: currentDate,
					'[businessName]': businessDetails.businessTitle,
					// '[dealHeadline]': offerObj.dealHeadline

		       	};

				var inputObj = {
					notifPath	 : "",
					from 		 : userDetails.emails[0].address,
				    to           : email,
				    templateName : 'Mail Receipt',
				    variables    : msgvariable,
				}
				sendMailReceiptNotification(inputObj);
			}
		}

	},
});

Template.editOffer.events({
	'click .editModal': function(event){
		event.preventDefault();
		
		var id = event.currentTarget.id;
		Session.set('id',id);

		// $('.modal-backdrop').hide();
		
		if($(event.target).hasClass('inactiveOk')){
			$('#inactOfferModal-'+id).modal('hide');
			// $('#editDataModal-'+id).modal('show');
		}
	},

	'click .deleteModal':function(event){
		event.preventDefault();
		var businessLink = FlowRouter.getParam('businessLink');
		var modelid = $(event.target).attr('id');
		var offerObj 	=  Offers.findOne({"_id":modelid});
		var status = offerObj.offerStatus; 
		if(status == 'new'){
			Meteor.call('deleteOffers',modelid,businessLink,function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
					$('.modal-backdrop').hide();
				}else{
					Bert.alert('Offer deleted sucessfully.','success',"growl-top-right");

					// ============================================================
					// 			Notification Email / SMS / InApp
					// ============================================================
					var vendorId = Meteor.userId();
					var admin = Meteor.users.findOne({'roles':'admin'});
					var vendorDetail = Meteor.users.findOne({'_id':vendorId});
					var businessDetails = Business.findOne({"businessLink":businessLink});
					if(businessDetails){
						if(admin&&vendorDetail){
					    	var adminId = admin._id;

							//Send Notification, Mail and SMS to Current Vendor
							var vendorname 	= vendorDetail.profile.name;
							var username 	= admin.profile.firstName;

		            		var date 		= new Date();
		            		var currentDate = moment(date).format('DD/MM/YYYY');
		            		var msgvariable = {
								'[vendorname]' 	: vendorname,
			   					'[currentDate]'	: currentDate,
								'[businessName]': businessDetails.businessTitle,
								'[dealHeadline]': offerObj.dealHeadline

			               	};

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
							    to           : vendorId,
							    templateName : 'Offer Deleted',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
								from         : adminId,
							    to           : vendorId,
							    templateName : 'Offer Deleted',
							    variables    : msgvariable,
							}
							sendMailNotification(inputObj);

							//Send Notification, Mail and SMS to Admin
		            		var date 		= new Date();
		            		var currentDate = moment(date).format('DD/MM/YYYY');
		            		var msgvariable = {
								'[vendorname]' 	: vendorname,
								'[adminname]'	: username,
			   					'[currentDate]'	: currentDate,
								'[businessName]': businessDetails.businessTitle,
								'[dealHeadline]': offerObj.dealHeadline
			               	};

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
							    to           : adminId,
							    templateName : 'Vendor deleted Offer',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessDetails.businessLink,
								from         : adminId,
							    to           : adminId,
							    templateName : 'Vendor deleted Offer',
							    variables    : msgvariable,
							}
							sendMailNotification(inputObj); 
						}
					}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
					OfferImagesS3.remove(offerObj.offerImage);
					$('.modal-backdrop').hide();

				}
			});
		}
	},

	'click .offerStatus':function(event){
		event.preventDefault();
		var modelid = $(event.target).attr('id');
		var offerObj 	=  Offers.findOne({"_id":modelid});
		var status = offerObj.offerStatus; 
		if(status == 'active'){
			Meteor.call('updateOfferStatus',modelid,'inactive',function(error,result){
				if(error){
					Bert.alert(error.reason,"danger","growl-top-right");
				}else{
					Bert.alert('Your offer inactivate sucessfully.','success',"growl-top-right");
				}
			});
		}
		else{
			var postDate = offerObj.expirationFromDate;
			var todayDate = moment(new Date()).format("YYYY-MM-DD");
			var expireDate = offerObj.expirationToDate;
			if(expireDate < postDate || expireDate < todayDate){
				// $(event.target).removeAttr('data-target','modal');
				$('#inactOfferModal-'+modelid).modal('show');
			}else{
				if(status == 'inactive'){
					Meteor.call('updateOfferStatus',modelid,'active',function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							Bert.alert('Your offer activate sucessfully.','success',"growl-top-right");
						}
					});	
				}
			}
		}
	},
});

Template.editOffer.helpers({
	editOffers(){
		var allPages = [];
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"});
		var businessId = businessName._id;

		allPages = Offers.find({"vendorId":Meteor.userId(),"businessId":businessId}).fetch();
		if(allPages){
			for(i=0;i<allPages.length;i++){
				var postDate = allPages[i].expirationFromDate;
				var todayDate = moment(new Date()).format("YYYY-MM-DD");
				var expireDate = allPages[i].expirationToDate;
				if(expireDate < postDate || expireDate < todayDate){
					// var offerStatus = 'inactive';
					Meteor.call('updateOfferStatus',allPages[i]._id,'inactive',function(error,result){
						if(error){
							Bert.alert(error.reason,"danger","growl-top-right");
						}else{
							// Bert.alert('Offer status updated sucessfully.','success',"growl-top-right");
						}
					});
				}


				allPages[i] = {
					"i"					: (i+1),
					_id 				: allPages[i]._id,
					offerStatus 		: allPages[i].offerStatus,
					dealHeadline		: allPages[i].dealHeadline,
					expirationFromDate 	: moment(allPages[i].expirationFromDate).format('DD/MM/YYYY'),
					expirationToDate 	: moment(allPages[i].expirationToDate).format('DD/MM/YYYY'),
				};
			}
			return allPages;			
		}
	},
	showEditOffer(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessName = Business.findOne({"businessLink":businessLink, "status":"active"});
		if(businessName){
			var businessId = businessName._id;
		}
		var offersObj = Offers.findOne({"vendorId":Meteor.userId(),"businessId":businessId});
		if(offersObj){
			return true;
		}else{
			return false;
		} 
	},
	showDeleteOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'new'){
			return true;
		}else{
			return false;
		}
	},
	showActiveOffer(){
		var offerStatus = this.offerStatus;
		if(offerStatus == 'active'){
			return true;
		}else{
			return false;
		}
	}
});

Template.offerPayment.onRendered(function(){
	Session.set('numberOfOffers','');
	Session.set('numOfMonths','');
	Session.set('noOfMonths','');
});

Template.offerAccordian.onRendered(function(){
	Session.set('numberOfOffers','');
});

Template.vendorOffer1.onRendered(function(){
	$("html,body").scrollTop(0);
	Session.set('SessionBusinessLink','');
	$("#OrderForm").validate({
	 	rules: {
	        dealHeadline: {
	            required: true,
	        },
	        dealDescription: {
	        	required: true,
	        },
	        expirationFromDate: {
	        	required: true,
	        },
	        expirationToDate: {
	        	required: true,
	        },
	        legalNotices: {
	        	required: true,
	        },
	        // dealTemplate: {
	        // 	required: true,
	        // },
    	},
    });
});

Template.vendorOffer2.onRendered(function(){
	Session.set('SessionBusinessLink','');
	$("#OfferForm").validate({
	 	rules: {
	        dealHeadline: {
	            required: true,
	        },
	        dealDescription: {
	        	required: true,
	        },
	        expirationFromDate: {
	        	required: true,
	        },
	        expirationToDate: {
	        	required: true,
	        },
	        legalNotices: {
	        	required: true,
	        },
	        // dealTemplate: {
	        // 	required: true,
	        // },
    	},
    });
});

Template.paymentInvoice.onRendered(function(){
	$("html,body").scrollTop(0);
});

Template.receipt.onRendered(function(){
	$("html,body").scrollTop(0);
	$('.recDiv').show();
});

Template.vendorMyOffers.onRendered(function(){
	$("html,body").scrollTop(0);
	Session.set('noOfMonths','');
});

Template.editOffer.onRendered(function(){
	Session.set('id','');
});


vendorMyOffersForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorMyOffers'});
}

export { vendorMyOffersForm };

paymentInvoiceForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentInvoice'});
}

export { paymentInvoiceForm };

paymentSuccessForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentSuccess'});
}

export { paymentSuccessForm };

paymentFailedForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentFailed'});
}

export { paymentFailedForm };

receiptForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'receipt'});
}

export { receiptForm };