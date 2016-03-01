'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$q', '$timeout', 'LocationSvc', 'UserSvc', function ($scope, $q, $timeout, LocationSvc, UserSvc) {

    var messageRef;
    //var msg1 = [{name: 'admin', msg: 'Tell us about your favorite kids play area, nursing spot or any other parenting related spot that you like.'}];

    UserSvc.init();
    $scope.userName = localStorage.userName;
    $scope.userEmail = localStorage.userEmail;
    $scope.newMessage = '';

    $scope.toggleLocationType = function(locationType) {
      $scope.mapSectionOpen = true;
      $scope.selectedLocationType = locationType;
      LocationSvc.locationType = locationType;
      $scope.$emit('toggle:markers');
    };

    $scope.backToNav = function() {
      $scope.mapSectionOpen = false;
    };

    $scope.showMessages = function(title) {
      $scope.messageSectionTitle = title;
      $scope.messagesSectionOpen = true;
    };

    $scope.closeMessages = function() {
      $scope.messagesSectionOpen = false;
    };

    $scope.addMessage = function() {
      var name = $scope.userName.trim() || 'Awesome Parent';
      var msg = $scope.newMessage.trim();
      if(msg) {
        $timeout(function() {messageRef.push({name: name, msg: msg, createdAt: Firebase.ServerValue.TIMESTAMP, userId: UserSvc.userId});}, 10);
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
      $scope.messages = [];
      messageRef = new Firebase('https://fiery-fire-3697.firebaseio.com/messages/' + locationId);
      messageRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        $scope.messages.unshift(message);
        $scope.$apply();
      });
    };

    $scope.updateUserInfo = function() {
      UserSvc.update($scope.userName, $scope.userEmail);
    };

  }]);