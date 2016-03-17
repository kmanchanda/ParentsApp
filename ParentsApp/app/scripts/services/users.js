'use strict';
/*jshint bitwise: false*/

angular.module('App')
  .factory('UserSvc', [function(){

    var userId;
    
    var genUUID = function() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
      }
      return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0,3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
    };

    var init = function() {

      if(!localStorage.userId) {
        userId = genUUID();
        var createdAt = (new Date()).getTime();
        localStorage.userId = userId;
        localStorage.userName = 'Awesome Parent';
        localStorage.userEmail = '';
        localStorage.createdAt = createdAt;
        var userRef = new Firebase('https://fiery-fire-3697.firebaseio.com/users/' + userId);
        userRef.set({name: 'Awesome Parent', email: '', createdAt: createdAt});
      } else {
        userId = localStorage.userId;
      }
      console.log('init', userId);
    };

    var update = function(name, email) {
      localStorage.userName = name;
      localStorage.userEmail = email;
      var userRef = new Firebase('https://fiery-fire-3697.firebaseio.com/users/' + userId);
      userRef.update({name: name, email: email});
    };

    var getUserId = function() {
      return userId;
    };

    return {
      getUserId: getUserId,
      init: init,
      update: update
    };
  }]);

