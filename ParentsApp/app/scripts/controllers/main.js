'use strict';

angular.module('App')
  .controller('MainCtrl', ['$scope', function ($scope) {

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

  }]);