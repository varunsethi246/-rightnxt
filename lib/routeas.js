import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/adminDashboard', {
    name: 'general Header',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('noOfUserCount'),
                    Meteor.subscribe('noOfVendorCount'),
                    Meteor.subscribe('noOfBusinessInactive'),
                    Meteor.subscribe('noOfBusinessActive'),
                    Meteor.subscribe('noOfEnqWeek'),
                    Meteor.subscribe('noOfEnqMonth'),
                    Meteor.subscribe('noOfEnqYear'),
                    Meteor.subscribe('noOfOfferWeek'),
                    Meteor.subscribe('noOfofferYear'),
                    Meteor.subscribe('noOfofferMonth'),
               ];   
    }, 
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "adminDashboard"});
        adminDashboardFunc();
    }
});

FlowRouter.route('/companySettings', {
    name: 'company settings',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('tempLogoImage'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
               ];   
    }, 
    triggersEnter : [activateSidebarLink],
    action: function() {
        BlazeLayout.render('adminLayout',{main: "companySettings"});
        // companysettingsFunc();
    }
});

FlowRouter.route('/joinUsForm', {
    name: 'careerJoinUsForm',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('career'),
                    Meteor.subscribe('newjob'),
                    Meteor.subscribe('resumeS3'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    
                ];   
    }, 
   
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "careerJoinUsForm"});
        careerJoinUsFormFunc();
    }
});

FlowRouter.route('/addNewJob', {
    name: 'AddNewJobForm',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
     
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "AddNewJobForm"});
        addNewJobFormFunc();
    }
});
FlowRouter.route('/homePageBanner', {
    name: 'homePageBanner',
     waitOn(params) {        
        return [ 
                    // Meteor.subscribe('allCity'),
                    // Meteor.subscribe('allStates'),
                    // Meteor.subscribe('notification'),
                    // Meteor.subscribe('userfunction'),
                    // Meteor.subscribe('notificationTemplate'),
                    // Meteor.subscribe('vendorBusiness'),
                ];   
    }, 

    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "homePageBanner"});
        HomepageBannerFunc();
    }
});

FlowRouter.route('/listOfUsers', {
    name: 'listOfUsers',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('noOfUser'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "listofUser"});
        listOfUsersFunc();
    }
});

FlowRouter.route('/editMyProfile', {
    name: 'Edit Profile',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "editMyProfileAdmin"});
        editMyProfileAdminFunc();
    }
});

FlowRouter.route('/BusinessBlkupload', {
    name: 'Business Blkupload',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
   
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "businessBlkup"});
        businessBlkupFunc()
    }
});

FlowRouter.route('/editRoles', {
    name: 'editRoles',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "adminAddRolesList"});
        adminAddRolesListFunc();
    }
});

FlowRouter.route('/businessbanners', {
    name: 'Business Banners',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('noOfInvoiceCount'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('position'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allbusinessBanner'),
                    Meteor.subscribe('discounts'),
                    Meteor.subscribe('position'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    // meteor.subscribe('notificationTemplate'),
                ];   
    }, 
    triggersEnter : [activateSidebarLink],     
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "businessBanner"});
        businessBannerFunc();
    }
});

FlowRouter.route('/businessbannersInvoice/:businessLink', {
    name: 'Business Banners Invoice',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allbusinessBanner'),
                    Meteor.subscribe('discounts'),
                    Meteor.subscribe('position'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    }, 
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "bannerInvoice"});
        bannerInvoiceFunc();
    }
});

FlowRouter.route('/businessBannerList', {
    name: 'Business Banners List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allbusinessBanner'),
                    Meteor.subscribe('discounts'),
                    Meteor.subscribe('position'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    triggersEnter : [activateSidebarLink],     
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "businessBannerList"});
        businessBannerListFunc();
    }
});

FlowRouter.route('/businessAds', {
    name: 'Business Ads',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('noOfInvoiceCount'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allBusinessAds'),
                    Meteor.subscribe('adsDiscount'),
                    Meteor.subscribe('adsPosition'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    triggersEnter : [activateSidebarLink],     
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "businessAds"});
        businessAdsFunc();
    }
});

FlowRouter.route('/businessAdsInvoice/:businessLink', {
    name: 'Business Ads Invoice',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allBusinessAds'),
                    Meteor.subscribe('adsDiscount'),
                    Meteor.subscribe('adsPosition'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "adsInvoice"});
        adsInvoiceFunc();
    }
});

FlowRouter.route('/businessAdsList', {
    name: 'Business Ads List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('allBusinessAds'),
                    Meteor.subscribe('adsDiscount'),
                    Meteor.subscribe('adsPosition'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "businessAdsList"});
        businessAdsListFunc();
    }
});

FlowRouter.route('/adsDiscountManagement', {
    name: 'Ads Discount Management',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('adsDiscount'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'adsDiscountManagement'});
        adsDiscountManagementFunc();
    }
});

FlowRouter.route('/adsPositionManagement', {
    name: 'Ads Position Management',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('adsPosition'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'adsPositionManagement'});
        adsPositionManagementFunc();
    }
});

FlowRouter.route('/manageLocations', {
    name: 'Manage Locations',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    triggersEnter : [activateSidebarLink],     
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "manageLocations"});
        manageLocationsFunc();
    }
});

FlowRouter.route('/categoriesLevels', {
    name: 'Categories Levels List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    triggersEnter : [activateSidebarLink],     
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "manageCategoriesList"});
        manageCategoriesListFunc();
    },
    triggersExit: [trackCatgLevelsLeft]
});

function trackCatgLevelsLeft(context){
    console.log('left catg levels page');
    Session.set('catgListLimit',10);
}

FlowRouter.route('/listOfBusiness', {
    name: 'Categories Levels List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('noOfBusiness'),
                ];   
    },
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "listOfBusiness"});
        listOfBusinessFunc();
    }
});

FlowRouter.route('/editBusinessAdmin/:businessLink', {
    name: 'Edit Business Admin',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('businessVideo'),
                    Meteor.subscribe('businessMenu'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('review'),
                    Meteor.subscribe('review',params.businessLink),
                ];   
    },
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "editBusinessAdmin"});
        editBusinessAdminFunc();
    }
});

FlowRouter.route('/addnewbusinessAdmin', {
    name: 'addnewbusinessAdmin',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('userProfile'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render('adminLayout',{main: "myBusinessAdmin"});
        addNewBusInfoAdminFunc();
    }
});

FlowRouter.route('/openingAndClosingDaysAdmin/:businessLink', {
    name: 'vendor Header',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    action: function() {
        // BlazeLayout.render('adminLayout',{main: "openCloseDayAdmin"});
        openCloseDayAdminFunc();
    }
});

FlowRouter.route('/aboutOwnerAdmin/:businessLink', {
    name: 'vendor Header',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    action: function() {
        // BlazeLayout.render('adminLayout',{main: "aboutOwnerAdmin"});
        aboutOwnerAdminFunc();
    }
});

FlowRouter.route('/imagesAndVideosAdmin/:businessLink', {
    name: 'vendor Header',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('businessVideo'),
                    Meteor.subscribe('businessMenu'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },
    action: function() {
        // BlazeLayout.render( 'adminLayout',{main: "addImagesVidAdmin"});
        addImagesVidAdminFunc();
    }
});

FlowRouter.route('/UMdeleteUserConfirm/:userId', {
    name: 'Delete Confirm',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    action: function() {
        // BlazeLayout.render( 'adminLayout',{main: "UMdeleteUserConfirm"});
        UMdeleteUserConfirmFunc();
    }
});

FlowRouter.route('/createUser', {
    name: 'Create User',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('configSettings'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    triggersEnter : [activateSidebarLink],
    action: function() {
        // BlazeLayout.render( 'adminLayout',{main: "createUsers"});
        createUsersFunc();
    }
});

FlowRouter.route('/editUsersProfile/:userId', {
    name: 'Edit My Profile',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('configSettings'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('userData',params.userId),
                ];   
    },

    action: function() {
        // BlazeLayout.render( 'adminLayout',{main: "editMyProfiles"});
        editMyProfilesFunc();
    }
});

FlowRouter.route('/contactUsList', {
    name: 'contactUsList',
     waitOn(params) {        
        return [ 
                    Meteor.subscribe('contactUs'),
                    Meteor.subscribe('noOfContactUs'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('notificationTemplate'),
                ];   
    },

    action: function() {
        // BlazeLayout.render('adminLayout',{main: "contactUsList"});
        contactUsListFunc();
    }
});

FlowRouter.route('/configSettings', {
    name: 'configSettings',
    action: function() {
        // BlazeLayout.render('configSettings');
        configSettingsFunc();
    }
});

function activateSidebarLink(){
    var currentURL = FlowRouter.current().path;
    var actualURL = currentURL.substring(1);
    $('.sidebarlink').removeClass('active');
    $('.'+actualURL).addClass('active');
}