'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.toggleLocationType = function(locationType) {
      $rootScope.mapSectionOpen = true;
      $scope.$broadcast('toggle:markers', locationType);
    };

  }]);