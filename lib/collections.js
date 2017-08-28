import { Mongo } from 'meteor/mongo';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
    Meteor.publish('messages', function () {
        return Messages.find();
    });

    Meteor.publish('onlineUsers', function () {
        let msg = Messages.find();

        return msg;
        //return Messages.find({});
    });
}

/*
Meteor.methods({

   getOnlineUsers(){
       let mDate = moment(new Date().toISOString()).subtract(20, 'minutes').toDate();

       let online = Messages.find({"createdAt": {$lte: new Date(mDate)}}, 'from');

       console.log(online);

       //return online;
   }
});*/
