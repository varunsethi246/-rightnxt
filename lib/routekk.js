
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/about', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('businessImgS3'),
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "aboutUs"} );
        aboutUsFunc();
    }
});
// vendorBusinessLayout
FlowRouter.route('/career', {

    name: 'career',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'),  
                    Meteor.subscribe('newjob'),
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('businessImgS3'),
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "career"});
        careerFunc();
    }
});

// FlowRouter.route('/claim/:city', {
//     name: 'claim',
//      subscriptions: function(params, queryParams) {
//         // using Fast Render
//         this.register('businessImgS3', Meteor.subscribe('businessImgS3'));  
//         this.register('business', Meteor.subscribe('vendorBusiness')); 
//         this.register('notification', Meteor.subscribe('notification'));
//         this.register('userfunction', Meteor.subscribe('userfunction'));
//         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );  
//         this.register('state', Meteor.subscribe('allStates')); 
//         this.register('city', Meteor.subscribe('allCity'));
//         this.register('area', Meteor.subscribe('area'));
//         this.register('userProfileS3', Meteor.subscribe('userProfileS3'));   
//     },
//     action: function() {
//         BlazeLayout.render("claim");
//     }
// });

FlowRouter.route('/claim/:city', {
    name: 'claim',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('vendorBusiness'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,  
                    Meteor.subscribe('allStates'), 
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('userProfileS3'),
               ];   
    },
    action: function() {
        // BlazeLayout.render("claim");
        claimFunc();
    }
});


// FlowRouter.route('/contactUs/:city', {
//     name: 'contactUs',
//     subscriptions: function(params, queryParams) {
//         // using Fast Render
//         this.register('businessImgS3', Meteor.subscribe('businessImgS3'));  
//         this.register('area', Meteor.subscribe('area'));
//         this.register('notification', Meteor.subscribe('notification'));
//         this.register('userfunction', Meteor.subscribe('userfunction'));
//         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );  
//         this.register('userProfileS3', Meteor.subscribe('userProfileS3'));   
//     },
//     action: function() {
//         BlazeLayout.render("generalLayoutWithImage", {generalcontent: "contactUs"});
//     }
// });

FlowRouter.route('/contactUs', {
    name: 'contactUs',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,  
                    Meteor.subscribe('userProfileS3'),  
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "contactUs"});
        contactUsFunc();
    }
});

FlowRouter.route('/comingSoon', {
    name: 'coming soon',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,   
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "comingSoon"});
        comingSoonFunc();

    }
});


FlowRouter.route('/join-us/:id', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('newjob'),  
                    Meteor.subscribe('resumeS3'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,   
               ];   
    },
    action: function() {
        console.log('in join us -id-city')
        // BlazeLayout.render("generalLayout", {generalcontent: "joinUs"});
        joinUsFunc();
    }
});

FlowRouter.route('/code-of-conduct', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,               
                ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "codeOfConduct"});
        codeOfConductFunc();
    }
});


FlowRouter.route('/privacy-policy', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,                
                ];   

    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "privacyPolicy"});
        privacyPolicyFunc();
    }
});


FlowRouter.route('/terms-of-service', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,               
                ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "termsOfService"});
        termsOfServiceFunc();
    }
});

FlowRouter.route('/faqs', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,              
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayoutWithImage", {generalcontent: "faq"});
        faqFunc();
    }
});


FlowRouter.route('/merchant-guidelines', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "merchantGuidelines"});
        merchantGuidelinesFunc();
    }
});

FlowRouter.route('/aboutUs-form', {
    name: 'Aboutusform',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main: "aboutUsForm"});
        aboutUsFunc();
    }
});

FlowRouter.route('/generalcontent-form', {
    name: 'GENERALCONTENTform',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('generalContent'),  
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,     
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main: "generalContentForm"});
        generalContentFunc();
    }
});

FlowRouter.route('/admin-FAQ-form', {
    name: 'Admin FAQ Form',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('generalContent'),  
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main: "faqForm"});
        faqFormThreeFunc();
    }
});

FlowRouter.route('/editPages', {
    name: 'Edit Webpages',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('generalContent'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main: "editPages"});
        editPagesFunc();
    }
});

FlowRouter.route('/jobList', {
    name: 'Job Lists',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('newjob'),  
                    Meteor.subscribe('allCity'),  
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('allStates'), 
                    Meteor.subscribe('allStates'),
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,    
                ];   
    },
    action: function() {
        // BlazeLayout.render("adminLayout",{main: "jobList"});
        jobListFunc();
    }
});

FlowRouter.route('/businessOffers/:businessLink/invoice/:invoiceNumber', {
    name: 'Payment Invoice',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('companySettings'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('offers'),
                    Meteor.subscribe('businessOffers',params.businessurl),
                    Meteor.subscribe('payment'), 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('vendorBusinessEnquiry') ,
                    Meteor.subscribe('enquiryImgS3'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('userfunction'),   
                ];   
    },
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"paymentInvoice"} );
        paymentInvoiceFunc();
    }
});


FlowRouter.route('/payment-response', {
    name: 'Payment Success',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
        Meteor.subscribe('userProfileS3'), 
        Meteor.subscribe('companySettings'),
        Meteor.subscribe('vendorBusiness'),
        Meteor.subscribe('offers'),
        Meteor.subscribe('businessOffers',params.businessurl),
        Meteor.subscribe('payment'), 
        Meteor.subscribe('notificationTemplate') ,
        Meteor.subscribe('notification'), 
        Meteor.subscribe('vendorBusinessEnquiry') ,
        Meteor.subscribe('enquiryImgS3'),
        Meteor.subscribe('allpayment'),
        Meteor.subscribe('userfunction'), 
                ];   
    },
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"paymentSuccess"} );
        paymentSuccessFunc();
    }
});
FlowRouter.route('/paymentAds-response', {
    name: 'Payment Success',
     waitOn(params) {        
        return [ 
        Meteor.subscribe('businessImgS3'),  
        Meteor.subscribe('userProfileS3'), 
        Meteor.subscribe('companySettings'),
        Meteor.subscribe('vendorBusiness'),
        Meteor.subscribe('offers'),
        Meteor.subscribe('businessOffers',params.businessurl),
        Meteor.subscribe('payment'), 
        Meteor.subscribe('notificationTemplate') ,
        Meteor.subscribe('notification'), 
        Meteor.subscribe('vendorBusinessEnquiry') ,
        Meteor.subscribe('enquiryImgS3'),
        Meteor.subscribe('allpayment'),
        Meteor.subscribe('userfunction'), 
        Meteor.subscribe('allbusinessBanner'), 
        Meteor.subscribe('position'), 
        Meteor.subscribe('payment'), 
                ];   
    },
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"paymentSuccessAdsBanners"} );
        paymentSuccessAdsBannersFunc();
    }
});


FlowRouter.route('/payment-error', {
    name: 'Payment Error',
    waitOn(params) {        
        return [ 
        Meteor.subscribe('businessImgS3'), 
        Meteor.subscribe('userProfileS3'),
        Meteor.subscribe('companySettings'),
        Meteor.subscribe('vendorBusiness'),
        Meteor.subscribe('offers'),
        Meteor.subscribe('businessOffers',params.businessurl),
        Meteor.subscribe('payment'), 
        Meteor.subscribe('notificationTemplate') ,
        Meteor.subscribe('notification'), 
        Meteor.subscribe('vendorBusinessEnquiry') ,
        Meteor.subscribe('enquiryImgS3'),
        Meteor.subscribe('allpayment'),
        Meteor.subscribe('userfunction'), 
                ];   
    },
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"paymentFailed"} );
        paymentFailedFunc();
    }
});


FlowRouter.route('/:businessLink/receipt/:invoiceNumber', {
    // FlowRouter.route('/receipt', {
    name: 'Receipt',
    waitOn(params) {        
        return [ 
        Meteor.subscribe('userProfileS3'),
        Meteor.subscribe('businessImgS3'),  
        Meteor.subscribe('companySettings'),
        Meteor.subscribe('vendorBusiness'),
        Meteor.subscribe('offers'),
        Meteor.subscribe('payment'), 
        Meteor.subscribe('notificationTemplate') ,
        Meteor.subscribe('vendorBusinessEnquiry') ,
        Meteor.subscribe('enquiryImgS3'),
        Meteor.subscribe('allpayment'),
        Meteor.subscribe('userfunction'), 
        Meteor.subscribe('notification'),
        Meteor.subscribe('notificationTemplate') ,
                ];   
    },
    action: function() {
        // BlazeLayout.render("vendorLayout", {main:"receipt"} );
        receiptFunc();
    }
});


FlowRouter.route('/:businessurl', {
    name: 'Business Page',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('imageCommentLike',params.businessurl),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('vendorBusiness'),
                    Meteor.subscribe('oneBusiness',params.businessurl), 
                    Meteor.subscribe('businessOffers',params.businessurl), 
                    Meteor.subscribe('review',params.businessurl),
                    Meteor.subscribe('imageComment',params.businessurl), 
                    Meteor.subscribe('userReviewS3',params.businessurl),
                    Meteor.subscribe('userReviewS3'),
                    Meteor.subscribe('offerImagesS3'),
                    Meteor.subscribe('businessOffers',params.businessurl), 
                    Meteor.subscribe('bookmark',params.businessurl),
                    Meteor.subscribe('beenThere',params.businessurl),
                    Meteor.subscribe('savedOffer',params.businessurl),
                    Meteor.subscribe('allSavedOffer'),
                    Meteor.subscribe('businessLikes',params.businessurl), 
                    Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('businessMenu'),
                    Meteor.subscribe('businessVideo'), 
                    Meteor.subscribe('review'),
                    Meteor.subscribe('reviewCommentLikes',params.businessurl),
                    Meteor.subscribe('businessVideo'),
                    Meteor.subscribe('followUser'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('enquiryImgS3'),
                    Meteor.subscribe('allpayment'),
                    Meteor.subscribe('allreviews'),
                    Meteor.subscribe('userReviewS3'),
                    Meteor.subscribe('offers'),
                    Meteor.subscribe('userProfileS3'),
                    Meteor.subscribe('allStatistics'),
                    Meteor.subscribe('bussImgLikes'),
                    Meteor.subscribe('reviewCount'),
                    // Meteor.subscribe('followerCounts'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('notificationTemplate'),
               ];   
    }, 
    // subscriptions: function(params, queryParams) {
    //     // using Fast Render
        
    // },
    action: function() {
        // BlazeLayout.render("vendorBusinessLayout");
        vendorBusinessLayoutFunc();
    }
});