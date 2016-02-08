'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', 'LocationSvc', function ($scope, LocationSvc) {

    $scope.test = 'Angular works !!!';
    LocationSvc.get()
      .then(function(r) {
        console.log(r);
        $scope.pos = r;
      });

  }]);