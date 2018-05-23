import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/findYourFriends',{
 name:'findYourFriends',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userProfile',params.userId),  
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('allreviews'), 
                    Meteor.subscribe('userProfileS3'),
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('configSettings'), 
                    Meteor.subscribe('reviewCommLikes'),
                    Meteor.subscribe('userBusinessLikes'),
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('userBookmark'),
                    Meteor.subscribe('allSavedOffer'), 
                    Meteor.subscribe('userBeenThere'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('vendorBusiness'),  
                    Meteor.subscribe('reviewUser'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('userReviewS3',params.businessurl), 
               ];   
    }, 
    
    action(){
        // BlazeLayout.render('userLayout', { content: 'findYourFriends'});
        findYourFriendsFunc();
    }
});


FlowRouter.route('/createEmailTemplate', {
    name: 'createEmailTemplate',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userfunction'), 
                    Meteor.subscribe('rolefunction'),
                    Meteor.subscribe('notification'),
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'createEmailTemplate'});
        createEmailTemplateFunc();
    }
});

FlowRouter.route('/createEmailTemplate', {
    name: 'createEmailTemplate',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userfunction'), 
                    Meteor.subscribe('rolefunction'),
                    Meteor.subscribe('notification'),
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'editTemplate'});
        editTemplateFunc();
    }
});

FlowRouter.route('/userDefinedTemplate', {
    name: 'userDefinedTemplate',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userfunction'), 
                    Meteor.subscribe('rolefunction'),
                    Meteor.subscribe('notification'),
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'userDefinedTemplate'});
        userDefinedTemplateFunc();
    }
});

FlowRouter.route('/notificationConfiguration', {
    name: 'notificationConfig',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('rolefunction'), 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
               ];   
    },
    action: function() {
        // BlazeLayout.render("profileSettingLayout", {profileSettings:'notificationConfig'});
        notificationConfigFunc()
    }
});


FlowRouter.route('/viewTemplate', {
    name: 'viewTemplate',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('userfunction'), 
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'viewTemplate'});
        viewTemplateFunc();
    }
});

FlowRouter.route('/ViewAllNotification', {
    name: 'ViewAllNotification',
    waitOn(params) {        
        return [ 
        Meteor.subscribe('businessImgS3'),  
        Meteor.subscribe('notification') ,
        Meteor.subscribe('notificationTemplate') ,
     ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'ViewAllNotif'});
        ViewAllNotifFunc();
    }
});

FlowRouter.route('/mailTemplate', {
    name: 'mailTemplate',
    subscriptions: function(params, queryParams) {
        this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
        this.register('userfunction', Meteor.subscribe('userfunction') );
        this.register('notification', Meteor.subscribe('notification')); 
    },
    action: function() {
        BlazeLayout.render("adminLayout",{main:'mailTemplate'});
    }
});


FlowRouter.route('/sendMailnNotification', {
    name: 'sendMailnNotification',
    subscriptions: function(params, queryParams) {
        this.register('notification', Meteor.subscribe('notification')); 
        this.register('userfunction', Meteor.subscribe('userfunction'));  
        this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
        this.register('vendorBusinessEnquiry', Meteor.subscribe('vendorBusinessEnquiry') );
        this.register('enquiryImgS3', Meteor.subscribe('enquiryImgS3'));
        this.register('business', Meteor.subscribe('vendorBusiness'));  
        this.register('allpayment', Meteor.subscribe('allpayment'));
        this.register('allreviews', Meteor.subscribe('allreviews'));
        this.register('likes', Meteor.subscribe('userBusinessLikes'));
        this.register('userfunction', Meteor.subscribe('userfunction') );
        this.register('followUser', Meteor.subscribe('followUser')); 
    },
    action: function() {
        BlazeLayout.render('sendMailnNotification');
    }
});

FlowRouter.route('/vendorDashboard', {
    name: 'vendorDashboard',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('chartBusiness'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('businessImgS3'), 
                    Meteor.subscribe('allLatLng'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('businessLikesCount'),
                    Meteor.subscribe('businessBeenThereCount'),
                    Meteor.subscribe('businessReportsCount'),
                    Meteor.subscribe('businessReviewsCount'),
                    Meteor.subscribe('businessOffersCount'),
                    Meteor.subscribe('businessEnquiryCount'), 
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"vendorDashboard"} );
        vendorDashboardFunc();
    }
});

FlowRouter.route('/discountManagement', {
    name: 'discountManagement',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('discounts') ,
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'discountManagement'});
        discountManagementFunc();
    }
});

FlowRouter.route('/positionManagement', {
    name: 'positionManagement',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('position') ,
               ];   
    }, 
    action: function() {
        // BlazeLayout.render("adminLayout",{main:'positionManagement'});
        positionManagementFunc();
    }
});


FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        var loggedInUser = Meteor.userId();
        if(loggedInUser){
            FlowRouter.go('/');
            Meteor.call('sendWelcomeMail',
             function(error, result){
                if(error){
                    console.log("Error is" +error.reason);
                }else{
                    Bert.alert( 'Welcome to RightNxt!!!!', 'success', 'growl-top-right' );
                }
            });           
        }
      }
    });
  }
});


