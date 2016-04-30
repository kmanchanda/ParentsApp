'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$q', '$timeout', 'LocationSvc', 'UserSvc', 'AnalyticsSvc', function ($scope, $q, $timeout, LocationSvc, UserSvc, AnalyticsSvc) {

    var messageRef;

    UserSvc.init();
    $scope.userName = localStorage.userName || '';
    $scope.userEmail = localStorage.userEmail || '';
    $scope.newMessage = '';
    $scope.isFeedback = false;

    LocationSvc.getCategories().then(function(r) {$scope.categories = r;});
    AnalyticsSvc.sendScreen('Home');

    $scope.toggleLocationType = function(locationType) {
      $scope.mapSectionOpen = true;
      $scope.selectedLocationType = locationType;
      LocationSvc.locationType = locationType;
      $scope.$emit('toggle:markers');
      AnalyticsSvc.sendScreen(locationType);
    };

    $scope.backToNav = function() {
      $scope.mapSectionOpen = false;
    };

    $scope.showMessages = function(title, isFeedback) {
      $scope.isFeedback = isFeedback;
      $scope.messageSectionTitle = isFeedback ? title : 'Feedback for "' + title + '"';
      $scope.messagesSectionOpen = true;
      if(isFeedback) {
        $scope.getMessages();
        AnalyticsSvc.sendScreen('Suggest');
      } else {
        AnalyticsSvc.sendScreen('Messages');
      }
    };

    $scope.closeMessages = function() {
      $scope.messagesSectionOpen = false;
    };

    $scope.addMessage = function() {
      var name = $scope.userName.trim() || 'Awesome Parent';
      var msg = $scope.newMessage.trim();
      if(msg) {
        $timeout(function() {messageRef.push({name: name, msg: msg, createdAt: Firebase.ServerValue.TIMESTAMP, userId: UserSvc.getUserId()});}, 10);
      }
      $scope.newMessage = '';
    };

    $scope.getMyLocation = function() {
      if($scope.locationRequest || !google) {return;}

      $scope.locationRequest = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.locationRequest.resolve({lat: position.coords.latitude, long: position.coords.longitude});
      }, function() {
        $scope.locationRequest.resolve();
      }, {
        timeout: 3000
      });
      
      $scope.locationRequest.promise.then(function(loc) {
        $scope.$emit('update:location', loc);
        $scope.locationRequest = null;
      });
    };

    $scope.getMessages = function(locationId) {
      if(messageRef) {
        messageRef.off();
      }
      if(typeof locationId === 'undefined') {
        $scope.messages = [{
          name: 'Nearby Lah for Parents',
          msg: 'Tell us about your favorite kids play area, nursing spot or any other parenting related spot that you like.',
          createdAt: localStorage.createdAt * 1 || (new Date()).getTime()
        }];
        messageRef = new Firebase('https://fiery-fire-3697.firebaseio.com/feedback/' + UserSvc.getUserId());
      } else {
        $scope.messages = [];
        messageRef = new Firebase('https://fiery-fire-3697.firebaseio.com/messages/' + locationId);  
      }
      
      messageRef.on('child_added', function(snapshot) {
        var currentUserId = UserSvc.getUserId();
        var message = snapshot.val();
        message.id = snapshot.key();
        if(message.spam && message.spam[currentUserId]) {message.isSpam = true;}
        $scope.messages.unshift(message);
        $scope.$apply();
      });
    };

    $scope.updateUserInfo = function() {
      UserSvc.update($scope.userName, $scope.userEmail);
    };

    $scope.openExternalUrl = function(e, url) {
      e.preventDefault();
      window.open(url, '_system');
    };

    $scope.reportSpam = function(msg) {
      if(msg.isSpam) {return;}
      msg.isSpam = true;
      var spamRef = new Firebase('https://fiery-fire-3697.firebaseio.com/messages/' + $scope.selectedLocation.id + '/' + msg.id + '/spam/' + UserSvc.getUserId());
      spamRef.set(1);
    };    

    $scope.$on('app:backbutton', function() {
      if($scope.messagesSectionOpen) {
        $scope.closeMessages();
      } else if($scope.mapSectionOpen) {
        $scope.backToNav();
      }
    });

  }]);