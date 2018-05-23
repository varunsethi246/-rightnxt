import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import'./routegb.js';
// import'./routekk.js';
// import'./routeas.js';
// import'./routeaa.js';
// import'./routedn.js';



FlowRouter.route('/', {
    name: 'Home Page',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('userProfileS3OneUser'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('vendorBusiness'),

               ];   
    }, 
    action: function() {
        console.log('loading');
        HomepageFunc();
    }
});

FlowRouter.route('/UMonetimeSignup', {
    name: 'UMonetimeSignup',
    action: function() {
        // console.log('cjcshc');
        // BlazeLayout.render("UMmainLayout", {content: "UMregister"});
        UMregisterFunc();
    }
});

FlowRouter.route('/LoginOTP', {
    name: 'Login OTP',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'),
               ];   
    }, 
    action: function() {
        /*BlazeLayout.render("anonymousUserLayout", {main:"LoginOTP"} );*/
        LoginOTPFunc();
    }
});


FlowRouter.route('/vendorpage', {
    name: 'vendor Page',
    action: function() {
        BlazeLayout.render("vendorpage");
    }
});

FlowRouter.route('/vendorLoginForm', {
    action: function() {
        // BlazeLayout.render("vendorLoginForm");
        VenderLoginFormFunc();
    }
});

FlowRouter.route('/vendorSignUpForm', {
    action: function() {
        // BlazeLayout.render("vendorSignUpForm");
        vendorSignUpForm();
    }
});
