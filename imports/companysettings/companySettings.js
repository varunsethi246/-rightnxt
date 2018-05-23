// import './companysettingsCarousel/companysettingsHeader.html';
// import '/imports/admin/commonAdmin/adminLayout.html';
// import '/imports/admin/commonAdmin/adminHeader.html';
// import '/imports/admin/commonAdmin/adminSidebar.html';
// import '/imports/admin/commonAdmin/adminFooter.html';
// import '/imports/admin/commonAdmin/ViewAllNotif.html';

import './companySettings.html';

import './companysettingsCarousel/companysettingsDisplayCarousel.js';
import './companysettingsCarousel/companysettingsFormsCarousel.js';
import './companysettingsCarousel/companysettingsModal.js';


import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings');

Template.companysettingsHeader.helpers({

	'companyCount' : function() {
    	return CompanySettings.find({}).count();
	},
	
});

// companysettingsDashboard = function () {  
//   BlazeLayout.render("adminLayout",{main: 'companysettingsDashboard'});
// }

// export { companysettingsDashboard };