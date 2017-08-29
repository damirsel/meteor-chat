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

    Meteor.publish('userStatus', function() {
        return Meteor.users.find({ "status.online": true });
    });
}
