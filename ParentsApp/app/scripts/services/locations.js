'use strict';
angular.module('App')
  .factory('LocationSvc', ['$q', function($q){

    var locationsRef = new Firebase('https://fiery-fire-3697.firebaseio.com/locations/');
    var deferred = $q.defer();
    var locationType;

    locationsRef.once('value', function(snapshot) {
      var locations = snapshot.val();
      deferred.resolve(locations.length ? locations : []);
    }, function () {
      deferred.resolve([]);
    });

    var get = function() {
      return deferred.promise;
    };

    return {
      get: get,
      locationType: locationType
    };
  }]);

