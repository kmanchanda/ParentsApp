'use strict';

angular.module('App')
  .factory('LocationSvc', ['$q', function($q){

    var get = function() {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        deferred.resolve({lat: 1.290018 || position.coords.latitude, long: 103.804586 || position.coords.longitude});
      }, function() {
        deferred.resolve({lat: 1.290018, long: 103.804586});// some random SIN location
      }, {
        timeout: 3000
      });
      return deferred.promise;
    };

    return {
      get: get
    };
  }]);