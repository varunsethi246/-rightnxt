import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { Payment } from '../../api/paymentMaster.js';
import { Position } from '/imports/api/discountMaster.js';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './vendorBannerInvoice.html';
import '../vendor.js';
import './VendorPayments.html';

import './vendorAdsInvoice.html';
import './paymentSuccess.html';
import '../../admin/businessBanner/businessBanner.js';
import '../../admin/businessAds/businessAds.js';




Template.paymentSuccessAdsBanners.helpers({
	paymentSuccessfull(){
		var status      = FlowRouter.getQueryParam('status');
	    var id          = FlowRouter.getQueryParam('id');
	    var billnumbers = FlowRouter.getQueryParam('billnumbers');
	    var checksum    = FlowRouter.getQueryParam('checksum');
		var userId      = Meteor.userId();
		var payId    	= FlowRouter.getQueryParam('payId');
		var businessLink = FlowRouter.getQueryParam('BusLink');
		var getPayData = Payment.findOne({"_id":payId});

		if(getPayData && getPayData.paymentStatus != "paid"){
			if(status == 'paid'){
				Meteor.call("updateAdsBannerInvoiceforPayment",id, billnumbers, payId, businessLink, function(err,result){
				  if(result){
  
				  }
			  });
		  }
		}
	},
	bannerInvoiceDataFinal(){
		var businessLink = FlowRouter.getQueryParam('BusLink');
		var businessDetails = Business.findOne({"businessLink":businessLink, "status":"active"});
		var paymentCheck = Payment.find({"businessLink":businessLink,"orderType":"Banner"}).fetch();
	  if(paymentCheck.length>0) {
		  businessDetails.invoiceNumber 	= paymentCheck[0].invoiceNumber;
		  businessDetails.discountPercent = paymentCheck[0].discountPercent;
		  businessDetails.totalDiscount 	= paymentCheck[0].totalDiscount;
		  businessDetails.discountedPrice = paymentCheck[0].discountedPrice;
	  }else{
		  businessDetails.invoiceNumber = 'None';
	  }
	  var companyDetails 	= CompanySettings.findOne({'companyId':101});

	  businessDetails.invoiceDate = moment(new Date()).format('DD/MM/YYYY');
	  if(companyDetails){
		  businessDetails.companyName = companyDetails.companyName;
		  businessDetails.companyAddress = companyDetails.companyLocationsInfo[0].companyAddress;
		  businessDetails.companyCity = companyDetails.companyLocationsInfo[0].companyCity;
		  businessDetails.companyState = companyDetails.companyLocationsInfo[0].companyState;
		  businessDetails.companyPincode = companyDetails.companyLocationsInfo[0].companyPincode;
	  }

	  var totalPrice = 0;
	  var businessBanner = BusinessBanner.find({"businessLink":businessLink,"status":"active"}).fetch();
	  console.log("businessBanner: ",businessBanner);
	  if(businessBanner){
		  for(i=0;i<businessBanner.length;i++){
			  if(businessBanner[i].areas){
				  businessBanner[i].numOfAreas=businessBanner[i].areas.length;
			  }else{
				  businessBanner[i].numOfAreas=0;
			  }
			  var monthlyRate = Position.findOne({'position':businessBanner[i].position});
			  businessBanner[i].monthlyRate 	= monthlyRate.rate;
			  businessBanner[i].totalAmount 	= parseInt(monthlyRate.rate) * parseInt(businessBanner[i].areas.length) * parseInt(businessBanner[i].noOfMonths);
			  totalPrice= totalPrice + businessBanner[i].totalAmount;
		  }
	  }

	  console.log("businessBanner: ",businessBanner);



	  businessDetails.businessLink = businessLink;
	  businessDetails.totalPrice = totalPrice;
	  businessDetails.businessBanner = businessBanner;
	  return businessDetails;
	}
});

Template.vendorPayments.helpers({
	paymentDetails(){
		var paymentDetails 	= Payment.find({"vendorId":Meteor.userId()},{sort:{invoiceNumber:-1}}).fetch();
		if(paymentDetails){
			for(i=0; i<paymentDetails.length; i++){
				var businessObj = Business.findOne({"_id":paymentDetails[i].businessId});
				paymentDetails[i].businessTitle = businessObj.businessTitle;
				paymentDetails[i].invoiceDate = moment(paymentDetails[i].invoiceDate).format('DD/MM/YYYY');
				var receiptLink = '';
				if(paymentDetails[i].orderType=="Banner"){
					paymentDetails[i].totalAmount = paymentDetails[i].discountedPrice;
					paymentDetails[i].receiptLink = "/bannerInvoice/" + paymentDetails[i].businessLink;
				} else if(paymentDetails[i].orderType=="Ads"){
					paymentDetails[i].totalAmount = paymentDetails[i].discountedPrice;
					paymentDetails[i].receiptLink = "/adsInvoice/" + paymentDetails[i].businessLink;
				} else {
					paymentDetails[i].receiptLink = "/" + paymentDetails[i].businessLink + "/receipt/" + paymentDetails[i].invoiceNumber;
				}
			}
			return paymentDetails;
		}

	},
});

vendorPaymentsForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorPayments'});
}

export { vendorPaymentsForm };

vendorBannerInvoiceForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorBannerInvoice'});
}

export { vendorBannerInvoiceForm };

vendorAdsInvoiceForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorAdsInvoice'});
}

export { vendorAdsInvoiceForm };

paymentSuccessAdsBannersForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'paymentSuccessAdsBanners'});
}

export { paymentSuccessAdsBannersForm };