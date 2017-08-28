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

/*Template.t_header.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.t_header.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.t_header.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/

/** CHAT **/

Template.t_chat.onCreated(function (){

    this.usr = new ReactiveVar('Anonymous');

    Meteor.subscribe('messages');
    /*if (Meteor.user() == null){
        this.usr = 'Anonymous';
    } else {
        this.usr = Meteor.user();
    }*/
});

Template.t_chat.events({

    //on click
    'click #submit-message'(event, instance) {
        event.preventDefault();
        // increment the counter when button is clicked
        //instance.counter.set(instance.counter.get() + 1);

        msg = instance.find('#msg-box').value;
        if (msg == ''){
            alert('Can\'t be blank');
        } else {
            Messages.insert({ "from": Meteor.user().username, "to": "public", "text": msg, createdAt: new Date() });
            instance.find('#msg-box').value = '';
        }
    },

    //pressing enter
    'keypress input#msg-box': function (evt, instance) {
        if (evt.which === 13) {
            Meteor.call(instance.view.template.__helpers.play);
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
      return Messages.find({}, {sort: {'createdAt': -1}});
    },

    play(){
        alert('here');
    }

});

Template.t_msg.helpers({

    formatDate(dt){
        return moment(dt).fromNow();
    }

});

Template.t_online.onCreated(function () {

    Meteor.subscribe('onlineUsers');

    /*let mDate = moment(new Date().toISOString()).subtract(20, 'minutes').toDate();
    let pDate = new Date();

    console.log(pDate.toString());
    console.log(mDate.toString());*/


    //let online = Messages.find({"createdAt": {$gte: new Date(mDate).toISOString()}}, 'from');

    //let mDate = moment(new Date().toISOString()).subtract(20, 'minutes').toDate();

    //Meteor.subscribe('onlineUsers');

    //let x = onlineUsers.find().fetch();
    //console.log(onlineUsers);

    /*Meteor.call('getOnlineUsers', function(err, response) {
        console.log(response);
    });*/


    //console.log(online);
});

Template.t_online.helpers({

    onlineUsers(){
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

        return users;
    },
});