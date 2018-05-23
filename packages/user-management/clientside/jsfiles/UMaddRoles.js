import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


Template.UMaddRoles.onCreated(function(){
  Meteor.subscribe('rolefunction');

});

Template.UMaddRoles.events({

    'click .submit' : function(event) {
      event.preventDefault();
      var roleName   = $("input[name=roleName]").val();
      var inputId    = $("input[name=roleName]").attr("id");
      console.log('roleName : ' + roleName);
      console.log('inputId : ' + inputId);
      Meteor.call('addrole', roleName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                         // FlowRouter.go("/UMroles");
                    }//the _id of new object if successful
                }


      	);
      $("input[name=roleName]").val('');
      // event.target.roleName.value = '';
    },



});