'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', 'LocationSvc', function ($scope, LocationSvc) {
    
    LocationSvc.get()
      .then(function(r) {
        $scope.$broadcast('location:get', r);
      });

  }]);