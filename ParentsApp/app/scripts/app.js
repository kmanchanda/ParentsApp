'use strict';

angular.module('App', ['ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['$rootScope', function ($rootScope) {
    document.addEventListener('backbutton', function(){$rootScope.$emit('app:backbutton');}, false);
  }]);