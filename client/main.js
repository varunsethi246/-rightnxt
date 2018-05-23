import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';

// import '../imports/admin/admin.js';
// import '../imports/userarea/userarea.js';
// import '../imports/common/UM/UMregister.js';
// import '../imports/general/general.js';
// import '../imports/vendor/businessList/businessSearchList.js';
// import '../imports/companysettings/companySettings.js';
// import '../imports/notifications/notification.js';
import './slingshot.js';


//-----  For star rating -----------
// import '../imports/common/starRating/js/star-rating.js';
// import '../imports/common/starRating/themes/krajee-svg/theme.js';
// import '../imports/common/starRating/themes/krajee-svg/theme.css';

Meteor.startup(() => {
	global.Buffer = function() {}
	global.Buffer.isBuffer = () => false
});

Meteor.startup(function () {
  TimeSync.loggingEnabled = false;

	generateURLid =function(id){
	 var newurl = 'q=rightnxt+url&oq=user..69i57j0j69i60l2j0l2.4907j0j7&'+id+'&sourceid=chrome&ie=UTF-8';
	 return newurl;
	}

	produceURLid = function (id){
	 var newid = id.split('&');
	 return newid[2];
	}
});


UMregisterFunc= function () {
console.log('asda');    
	import('/imports/common/UM/UMregister.js').then(function (handle) {        
		handle.UMregisterForm();    
	})
}
HomepageFunc= function () {    
	import('/imports/general/homepage/homepage.js').then(function (handle) {        
		handle.Homepage();    
	})
}
LoginOTPFunc= function () {    
	import('/imports/common/LoginOTP.js').then(function (handle) {        
		handle.LoginOTP();    
	})
}
VenderLoginFormFunc= function () {    
	import('/imports/common/vendorLoginForm.js').then(function (handle) {        
		handle.VenderLoginForm();    
	})
}
vendorSignUpFormFunc= function () {    
	import('/imports/common/vendorSignUpForm.js').then(function (handle) {        
		handle.vendorSignUpForm();    
	})
}
adminDashboardFunc= function () {    
	import('/imports/admin/admin.js').then(function (handle) {        
		handle.adminDashboard();    
	})
}
// companysettingsFunc= function () {    
// 	import('/imports/companysettings/companySettings.js').then(function (handle) {        
// 		handle.companysettingsDashboard();    
// 	})
// }

careerJoinUsFormFunc= function () {    
	import('/imports/admin/admin.js').then(function (handle) {        
		handle.careerJoinUsForm();    
	})
}
addNewJobFormFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.addNewJobForm();    
	})
}
listOfUsersFunc= function () {    
	import('/imports/admin/userManagement/UMlistOfUsers.js').then(function (handle) {        
		handle.listOfUsersForm();    
	})
}
editMyProfileAdminFunc= function () {    
	import('/imports/admin/userManagement/UMeditMyProfile.js').then(function (handle) {        
		handle.editMyProfileAdminForm();    
	})
}
businessBlkupFunc= function () {    
	import('/imports/admin/masterData/businessBlkup.js').then(function (handle) {        
		handle.businessBlkupForm();    
	})
}
adminAddRolesListFunc= function () {    
	import('/imports/admin/userManagement/UMaddRoleList.js').then(function (handle) {        
		handle.adminAddRolesListForm();    
	})
}
businessBannerFunc= function () {    
	import('/imports/admin/businessBanner/businessBanner.js').then(function (handle) {        
		handle.businessBannerForm();    
	})
}
bannerInvoiceFunc= function () {    
	import('/imports/admin/businessBanner/businessBanner.js').then(function (handle) {        
		handle.bannerInvoiceForm();    
	})
}
businessBannerListFunc= function () {    
	import('/imports/admin/businessBanner/businessBannerList.js').then(function (handle) {        
		handle.businessBannerListForm();    
	})
}
businessAdsFunc= function () {    
	import('/imports/admin/businessAds/businessAds.js').then(function (handle) {        
		handle.businessAdsForm();    
	})
}
adsInvoiceFunc= function () {    
	import('/imports/admin/businessAds/businessAds.js').then(function (handle) {        
		handle.adsInvoiceForm();    
	})
}
businessAdsListFunc= function () {    
	import('/imports/admin/businessAds/businessAdsList.js').then(function (handle) {        
		handle.businessAdsListForm();    
	})
}
adsDiscountManagementFunc= function () {    
	import('/imports/admin/businessAds/positionAndDiscountManagement/adsManagement.js').then(function (handle) {        
		handle.adsDiscountManagementForm();    
	})
}
adsPositionManagementFunc= function () {    
	import('/imports/admin/businessAds/positionAndDiscountManagement/adsManagement.js').then(function (handle) {        
		handle.adsPositionManagementForm();    
	})
}
manageLocationsFunc= function () {    
	import('/imports/admin/masterData/masterData.js').then(function (handle) {        
		handle.manageLocationsForm();    
	})
}
manageCategoriesListFunc= function () {    
	import('/imports/admin/masterData/masterData.js').then(function (handle) {        
		handle.manageCategoriesListForm();    
	})
}
listOfBusinessFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.listOfBusinessForm();    
	})
}
editBusinessAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.editBusinessAdminForm();    
	})
}

addNewBusInfoAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.addNewBusInfoAdminForm();    
	})
}
discountManagementFunc= function () {    
	import('/imports/admin/discountManagement/discountManagement.js').then(function (handle) {        
		handle.discountManagementForm();    
	})
}
positionManagementFunc= function () {    
	import('/imports/admin/discountManagement/discountManagement.js').then(function (handle) {        
		handle.positionManagementForm();    
	})
}

openCloseDayAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.openCloseDayAdminForm();    
	})
}

aboutOwnerAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.aboutOwnerAdminForm();    
	})
}

addImagesVidAdminFunc= function () {    
	import('/imports/admin/myBusiness/myBusinessAdmin.js').then(function (handle) {        
		handle.addImagesVidAdminForm();    
	})
}

UMdeleteUserConfirmFunc= function () {    
	import('/imports/admin/userManagement/UMlistOfUsers.js').then(function (handle) {        
		handle.UMdeleteUserConfirmForm();    
	})
}

createUsersFunc= function () {    
	import('/imports/admin/editUser/createUsers.js').then(function (handle) {        
		handle.createUsersForm();    
	})
}

editMyProfilesFunc= function () {    
	import('/imports/admin/editUser/editMyProfiles.js').then(function (handle) {        
		handle.editMyProfilesForm();    
	})
}

contactUsListFunc= function () {    
	import('/imports/admin/contactUsList/contactUsList.js').then(function (handle) {        
		handle.contactUsListForm();    
	})
}

configSettingsFunc= function () {    
	import('/imports/admin/editUser/configSettings.js').then(function (handle) {        
		handle.configSettingsForm();    
	})
}

ViewAllNotifsFunc= function () {    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifsForm();    
	})
}

HomepageBannerFunc = function () {    
	import('/imports/general/homepage/homepageBanner.js').then(function (handle) {        
		handle.HomepageBannerForm();    
	})
}

vendorBusinessLayoutFunc= function () {    
	import('/imports/vendor/vendorBusinessDetails/vendorBusinessDetails.js').then(function (handle) {        
		handle.vendorBusinessLayoutForm();    
	})
}




/* user profile */

userTimelinePageFunc= function () {    
	import('/imports/userarea/userTimeline/userTimelinePage.js').then(function (handle) {        
		handle.userTimelinePageForm();    
	})
}

userLikeFunc= function () {    
	import('/imports/userarea/userLike/userLike.js').then(function (handle) {        
		handle.userLikeForm();    
	})
}

userReviewPageFunc= function () {    
	import('/imports/userarea/userReview/userReviewPage.js').then(function (handle) {        
		handle.userReviewPageForm();    
	})
}

userPhotosFunc= function () {    
	import('/imports/userarea/userPhotos/userPhotos.js').then(function (handle) {        
		handle.userPhotosForm();    
	})
}

userFollowersFunc= function () {    
	import('/imports/userarea/userFollowers/userFollowers.js').then(function (handle) {        
		handle.userFollowersForm();    
	})
}

userBookmarksFunc= function () {    
	import('/imports/userarea/userBookmarks/userBookmark.js').then(function (handle) {        
		handle.userBookmarksForm();    
	})
}

userBeenThereFunc= function () {    
	import('/imports/userarea/userBeenThere/userBeenThere.js').then(function (handle) {        
		handle.userBeenThereForm();    
	})
}

userRatingsFunc= function () {    
	import('/imports/userarea/userRatings/userRatings.js').then(function (handle) {        
		handle.userRatingsForm();    
	})
}
userOffersFunc= function () {    
	import('/imports/userarea/userOffers/userOffers.js').then(function (handle) {        
		handle.userOffersForm();    
	})
}
userEnquiryPageFunc= function () {    
	import('/imports/userarea/userEnquiry/userEnquiry.js').then(function (handle) {        
		handle.userEnquiryPageForm();    
	})
}
profileSettingFunc= function () {    
	import('/imports/userarea/profileSetting/profileSetting.js').then(function (handle) {        
		handle.profileSettingForm();    
	})
}
editProfileFunc= function () {    
	import('/imports/userarea/profileSetting/editProfile.js').then(function (handle) {        
		handle.editProfileForm();    
	})
}

ResetPasswordFunc= function () {    
	import('/imports/userarea/ForgotPassword.js').then(function (handle) {           
		handle.ResetPasswordForm();    
	})
}

notificationConfigFunc= function () {    
	import('/imports/notifications/notificationConfig.js').then(function (handle) {        
		handle.notificationConfigForm();    
	})
}

/*=============== vendor profile ===============*/

vendorDashboardFunc= function () {    
	import('/imports/vendor/vendorDashboard/vendorDashboard.js').then(function (handle) {        
		handle.vendorDashboardForm();    
	})
}
vendorbannersFunc= function () {    
	import('/imports/vendor/mybusiness/Banners/vendorbanners.js').then(function (handle) {        
		handle.vendorDashboardForm();    
	})
}
aboutBusinessFunc= function () {    
	import('/imports/vendor/mybusiness/AboutBusiness/AboutBusiness.js').then(function (handle) {        
		handle.aboutBusinessForm();    
	})
}
ViewAllNotifFunc= function () {    
	import('/imports/admin/commonAdmin/commonAdmin.js').then(function (handle) {        
		handle.ViewAllNotifForm();    
	})
}
VendorGotLikesFunc= function () {    
	import('/imports/vendor/mybusiness/Likes/VendorGotLikes.js').then(function (handle) {        
		handle.VendorGotLikesForm();    
	})
}
VendorBeenThereFunc= function () {    
	import('/imports/vendor/mybusiness/BeenThere/VendorBeenThere.js').then(function (handle) {        
		handle.VendorBeenThereForm();    
	})
}
vendorReportFunc= function () {    
	import('/imports/vendor/mybusiness/Report/vendorReport.js').then(function (handle) {        
		handle.vendorReportForm();    
	})
}
vendorCommentsFunc= function () {    
	import('/imports/vendor/mybusiness/Comments/VendorComments.js').then(function (handle) {        
		handle.vendorCommentsForm();    
	})
}
vendorPhotosFunc= function () {    
	import('/imports/vendor/mybusiness/Photos/vendorPhotos.js').then(function (handle) {        
		handle.vendorPhotosForm();    
	})
}
vendorMyOffersFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.vendorMyOffersForm();    
	})
}
paymentInvoiceFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentInvoiceForm();    
	})
}
paymentSuccessFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentSuccessForm();    
	})
}
paymentFailedFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.paymentFailedForm();    
	})
}
receiptFunc= function () {    
	import('/imports/vendor/mybusiness/MyOffers/vendorMyOffers.js').then(function (handle) {        
		handle.receiptForm();    
	})
}
vendorEnquiryFunc= function () {    
	import('/imports/vendor/mybusiness/Enquiry/vendorEnquiry.js').then(function (handle) {        
		handle.vendorEnquiryForm();    
	})
}
vendorAdsFunc= function () {    
	import('/imports/vendor/mybusiness/Ads/vendorAds.js').then(function (handle) {        
		handle.vendorAdsForm();    
	})
}
vendorPaymentsFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorPaymentsForm();    
	})
}
vendorBannerInvoiceFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorBannerInvoiceForm();    
	})
}
vendorAdsInvoiceFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.vendorAdsInvoiceForm();    
	})
}
paymentSuccessAdsBannersFunc= function () {    
	import('/imports/vendor/VendorPayments/VendorPayments.js').then(function (handle) {        
		handle.paymentSuccessAdsBannersForm();    
	})
}
addVendorBusInfoFunc= function () {    
	import('/imports/vendor/AddNewBusiness/addvendorBusInfo.js').then(function (handle) {        
		handle.addVendorBusInfoForm();    
	})
}
addvendorOpeningAndClosingFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorOpeningAndClosing.js').then(function (handle) {        
		handle.addvendorOpeningAndClosingForm();    
	})
}
addvendorAboutOwnerFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorAboutOwner.js').then(function (handle) {        
		handle.addvendorAboutOwnerForm();    
	})
}
addvendorImagesVideosFunc= function () {    
	import('/imports/vendor/AddNewBusiness/AddvendorImagesVideos.js').then(function (handle) {        
		handle.addvendorImagesVideosForm();    
	})
}
businessListFunc= function () {    
	import('/imports/vendor/businessList/businessList.js').then(function (handle) {        
		handle.businessListForm();    
	})
}


/*================general page =====================*/

aboutUsFunc= function () {    
	import('/imports/general/aboutUs/aboutUs.js').then(function (handle) {        
		handle.aboutUsForm();    
	})
}
careerFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.careerForm();    
	})
}
claimFunc= function () {    
	import('/imports/general/claim/claim.js').then(function (handle) {        
		handle.claimForm();    
	})
}
contactUsFunc= function () {    
	import('/imports/general/contactUs/contactUs.js').then(function (handle) {        
		handle.contactUsForm();    
	})
}
comingSoonFunc= function () {    
	import('/imports/general/generalLayout/generalLayout.js').then(function (handle) {        
		handle.comingSoonForm();    
	})
}
joinUsFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.joinUsForm();    
	})
}
codeOfConductFunc= function () {    
	import('/imports/general/codeOfConduct/codeOfConduct.js').then(function (handle) {        
		handle.codeOfConductForm();    
	})
}
privacyPolicyFunc= function () {    
	import('/imports/general/privacyPolicy/privacyPolicy.js').then(function (handle) {        
		handle.privacyPolicyForm();    
	})
}
termsOfServiceFunc= function () {    
	import('/imports/general/termsCondition/termsOfService.js').then(function (handle) {        
		handle.termsOfServiceForm();    
	})
}
faqFunc= function () {    
	import('/imports/general/FAQ/faq.js').then(function (handle) {        
		handle.faqForm();    
	})
}
merchantGuidelinesFunc= function () {    
	import('/imports/general/merchantGuidelines/merchant.js').then(function (handle) {        
		handle.merchantGuidelinesForm();    
	})
}
aboutUsFormTwoFunc= function () {    
	import('/imports/general/aboutUs/aboutUsForm.js').then(function (handle) {        
		handle.aboutUsFormTwo();    
	})
}
generalContentFunc= function () {    
	import('/imports/general/generalLayout/generalLayout.js').then(function (handle) {        
		handle.generalContentForm();    
	})
}
faqFormThreeFunc= function () {    
	import('/imports/general/FAQ/faq.js').then(function (handle) {        
		handle.faqFormThree();    
	})
}
editPagesFunc= function () {    
	import('/imports/general/EditPages/editPages.js').then(function (handle) {        
		handle.editPagesForm();    
	})
}
jobListFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.jobListForm();    
	})
}
createEmailTemplateFunc= function () {    

	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.createEmailTemplateForm();    
	})

	
}
editTemplateFunc= function () {    
	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.editTemplateForm();    
	})	
}
viewTemplateFunc= function () {    
	import('/imports/notifications/createEmailTemplate.js').then(function (handle) {        
		handle.viewTemplateForm();    
	})	
}
userDefinedTemplateFunc= function () {    
	import('/imports/notifications/userDefinedTemplate.js').then(function (handle) {        
		handle.userDefinedTemplateForm();    
	})	
}
findYourFriendsFunc= function () {    
	import('/imports/userarea/userFollowers/userFollowers.js').then(function (handle) {        
		handle.findYourFriendsForm();    
	})	
}
