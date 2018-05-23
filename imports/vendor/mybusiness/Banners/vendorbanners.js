import './vendorbanners.html';
import '../../VendorPayments/VendorPayments.js'

vendorbannersForm = function () {  
  BlazeLayout.render("vendorLayout" ,{main: 'vendorbanners'});
  // Blaze.render(Template.claim,document.body);
}

export { vendorbannersForm };