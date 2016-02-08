angular.module('App')
  .factory('LocationSvc', ['$q', function($q){

    var get = function() {
      var deferred = $q.defer();
      navigator.geolocation.getCurrentPosition(function(position) {
        deferred.resolve({lat: position.coords.latitude, long: position.coords.longitude});
      }, function() {
        deferred.resolve();
      }, {
        timeout: 5000
      });
      return deferred.promise;
    };

    return {
      get: get
    }
  }]);