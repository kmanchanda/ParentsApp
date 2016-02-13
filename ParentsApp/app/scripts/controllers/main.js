'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', 'LocationSvc', 'LocationTypeList', function ($scope, LocationSvc, LocationTypeList) {
    
    $scope.locationTypes = LocationTypeList;

    LocationSvc.get()
      .then(function(r) {
        $scope.$broadcast('location:get', r);
      });

  }]);