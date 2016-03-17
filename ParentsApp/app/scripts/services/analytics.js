'use strict';

angular.module('App')
  .factory('GoogleAnalyticsSvc', [function(){

    var init = function() {
      if(window.analytics) {
        window.analytics.startTrackerWithId('UA-74833444-1');  
      }
    };

    var view = function(pageView) {
      if(window.analytics) {
        window.analytics.trackView(pageView);
      }
    };

    return {
      init: init,
      view: view
    };
  }]);

