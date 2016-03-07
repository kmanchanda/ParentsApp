'use strict';

angular.module('App')
  .directive('backButton', [function () {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope) {
        angular.element(document).on('backbutton', function(){
          scope.$emit('app:backbutton');
          scope.$apply();
        });
      }
    };
  }]);


