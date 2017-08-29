import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Messages } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';
import { moment } from 'meteor/momentjs:moment';

//accounts config
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});

import './main.html';

/** CHAT **/

Template.t_chat.onCreated(function (){

    this.usr = new ReactiveVar('Anonymous');
    Session.setDefault('room', 'public');

    Meteor.subscribe('messages');
});

Template.t_chat.events({

    //on click
    'click #submit-message'(event, instance) {
        // increment the counter when button is clicked
        //instance.counter.set(instance.counter.get() + 1);

        msg = instance.find('#msg-box').value;
        if (msg == ''){
            alert('Can\'t be blank');
        } else {
            Messages.insert({ "from": Meteor.user().username, "to": Session.get('room'), "text": msg, createdAt: new Date() });
            instance.find('#msg-box').value = '';
        }
    },

    //pressing enter - better to be solved with only one method but I had problems calling method from another method
    'keypress input#msg-box': function (evt, instance) {
        if (evt.which === 13) {
            msg = instance.find('#msg-box').value;
            if (msg == ''){
                alert('Can\'t be blank');
            } else {
                Messages.insert({ "from": Meteor.user().username, "to": Session.get('room'), "text": msg, createdAt: new Date() });
                instance.find('#msg-box').value = '';
            }
        }
    }

});

Template.t_chat.helpers({

    getUser(){
        let user = Meteor.user();

        if (user === null){
            return 'Anonymous';
        } else {
            return user.username;
        }
    },

    messages() {
        let userName = Meteor.user().username;
        if (Session.get('room') == 'public'){
            return Messages.find({ 'to': 'public' }, {sort: {'createdAt': -1}});
        } else {
            return Messages.find({$or: [{$and: [{'from': Session.get('room')}, {'to': userName}]}, {$and: [{'to': Session.get('room')}, {'from': userName}]}]}, {sort: {'createdAt': -1}});
        }
    },

    room(){
        return Session.get('room');
    }

});

Template.t_msg.helpers({

    formatDate(dt){
        return moment(dt).fromNow();
    }

});

Template.t_online.onCreated(function () {

    Meteor.subscribe('userStatus');

});

Template.t_online.helpers({

    onlineUsers() {
        //exclude self and return online users
        return Meteor.users.find({ $and: [ { "status.online": true }, {username: {$ne: Meteor.user().username} } ] });
    }

    // OLD ROUTINE FOR IDENTIFYING ONLINE USERS

    /*onlineUsers(){
        const instance = Template.instance();
        //let msg = Messages.find({});
        let mDate = moment(new Date().toISOString()).subtract(30, 'minutes').toDate();

        let msg = Messages.find({"createdAt": {$gte: new Date(mDate)}});

        var users = [];

        //filter unique names
        msg.forEach(function(obj){
            var found = false;
            for (var j = 0; j < users.length; j++){
                if (obj.from == users[j].from){
                    found = true;
                }
            }
            if (found == false || users.length == 0){
                //eliminate current user
                if (obj.from != Meteor.user().username) {
                    users.push(obj);
                }
            }
        });
        console.log(Meteor.user());
        return users;
    },*/
});

Template.t_online.events({
    'click .change-room'(event, instance) {
        Session.set('room', event.target.getAttribute('ref'));
    }
});