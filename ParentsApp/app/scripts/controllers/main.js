'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$q', function ($scope, $q) {

    var msg1 = [{name: 'admin', msg: 'Tell us about your favorite kids play area, nursing spot or any other parenting related spot that you like.'}];
    var msg2 = [{name: 'John', msg: 'This place is the best in the city'}, {name: 'Jim', msg: 'Not sure what the hype is all about. I didnt like it all.'}, {name: 'John', msg: 'This place is the best in the city'}, {name: 'Jim', msg: 'Not sure what the hype is all about. I didnt like it all.'}];

    $scope.toggleLocationType = function(locationType) {
      $scope.mapSectionOpen = true;
      $scope.selectedLocationType = locationType || 'All';
      $scope.$broadcast('toggle:markers', locationType);
    };

    $scope.backToNav = function() {
      $scope.mapSectionOpen = false;
    };

    $scope.showMessages = function(title, isLocation) {
      $scope.messageSectionTitle = title;
      $scope.messages = isLocation ? msg2 : msg1;
      $scope.messagesSectionOpen = true;
    };

    $scope.closeMessages = function() {
      $scope.messagesSectionOpen = false;
    };

    $scope.addMessage = function() {
      $scope.messages.unshift({name: 'You', msg: $scope.newMessage});
      $scope.newMessage = '';
    };

    $scope.getMyLocation = function() {
      if($scope.locationRequest) {return;}

      $scope.locationRequest = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.locationRequest.resolve({lat: position.coords.latitude, long: position.coords.longitude});
      }, function() {
        $scope.locationRequest.resolve();
      }, {
        timeout: 3000
      });
      
      $scope.locationRequest.promise.then(function(loc) {
        $scope.$broadcast('update:location', loc);
        $scope.locationRequest = null;
      });
    };

  }]);