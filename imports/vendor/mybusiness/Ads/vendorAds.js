import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../vendor.js';
import './vendorAds.html';
import '../../VendorPayments/VendorPayments.js';


vendorAdsForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorAds'});
}

export { vendorAdsForm };

