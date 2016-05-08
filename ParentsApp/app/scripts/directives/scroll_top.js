'use strict';

angular.module('App')
  .directive('scrollTop', [function () {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element) {
        scope.$on('message:sent', function() {
          angular.element(element)[0].scrollTop = 0;
        });
      }
    };
  }]);


