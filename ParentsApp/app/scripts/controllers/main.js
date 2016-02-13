'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', 'LocationSvc', 'LocationTypeList', function ($scope, LocationSvc, LocationTypeList) {
    
    $scope.locationTypes = LocationTypeList;
    _.each($scope.locationTypes, function(locationType) {locationType.selected = true;});

    LocationSvc.get()
      .then(function(r) {
        $scope.$broadcast('location:get', r);
      });

    $scope.toggleLocationType = function(locationType) {
      locationType.selected = !locationType.selected;
      $scope.$broadcast('toggle:markers');
    };

  }]);