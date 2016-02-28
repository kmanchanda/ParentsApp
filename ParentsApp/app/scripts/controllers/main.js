'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$q', function ($scope, $q) {

    $scope.toggleLocationType = function(locationType) {
      $scope.mapSectionOpen = true;
      $scope.selectedLocationType = locationType || 'All';
      $scope.$broadcast('toggle:markers', locationType);
    };

    $scope.backToNav = function() {
      $scope.mapSectionOpen = false;
    };

    $scope.showMessages = function() {
      $scope.messagesSectionOpen = true;
    };

    $scope.closeMessages = function() {
      $scope.messagesSectionOpen = false;
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