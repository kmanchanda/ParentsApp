'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {

    $scope.toggleLocationType = function(locationType) {
      $rootScope.mapSectionOpen = true;
      $scope.selectedLocationType = locationType || 'All';
      $scope.$broadcast('toggle:markers', locationType);
    };

    $scope.backToNav = function() {
      $rootScope.mapSectionOpen = false;
    };

  }]);