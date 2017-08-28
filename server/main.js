import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.startup(() => {
  // code to run on server at startup
});

/*Meteor.methods({

   getOnlineUsers(){
       let mDate = moment(new Date().toISOString()).subtract(20, 'minutes').toDate();

       let online = Messages.find({"createdAt": {$lte: new Date(mDate)}}, 'from');

       console.log(online);

       //return online;
   }
});*/

/*Meteor.publish('onlineUsers', function () {
    let mDate = moment(new Date().toISOString()).subtract(20, 'minutes').toDate();

    //return Messages.find({"createdAt": {$lte: new Date(mDate)}}, 'from');
    return Messages.find({});
});*/

