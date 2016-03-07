'use strict';
angular.module('App')
  .factory('LocationSvc', ['$q', function($q){

    var locationPromise, categoryPromise;
    var locationType;

    function initLocations() {
      var locationsRef = new Firebase('https://fiery-fire-3697.firebaseio.com/locations/');
      var deferred = $q.defer();
      locationPromise = deferred.promise;

      locationsRef.once('value', function(snapshot) {
        var locations = snapshot.val();
        deferred.resolve(locations.length ? locations : []);
      }, function () {
        deferred.resolve([]);
      });  
    }

    function initCategories() {
      var categoryRef = new Firebase('https://fiery-fire-3697.firebaseio.com/categories/');
      var deferred = $q.defer();
      categoryPromise = deferred.promise;

      categoryRef.once('value', function(snapshot) {
        var categories = snapshot.val();
        deferred.resolve(categories.length ? categories : []);
      }, function () {
        deferred.resolve([]);
      });  
    }

    initLocations();
    initCategories();

    var get = function() {
      return locationPromise;
    };

    var getCategories = function() {
      return categoryPromise;
    };

    return {
      get: get,
      getCategories: getCategories,
      locationType: locationType
    };
  }]);

