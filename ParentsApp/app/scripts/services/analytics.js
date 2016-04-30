'use strict';

angular.module('App')
  .factory('AnalyticsSvc', [function(){

    var analytics = navigator.analytics;
    if(analytics) {
      analytics.setTrackingId('UA-74833444-2');
    }
    
    var sendScreen = function(screenName) {
      if(analytics) {
        console.log('--analytics--', screenName);
        analytics.sendAppView(screenName);
      } else {
        console.log('--no analytics--', screenName);
      }
    };

    var sendEvent = function(category, action, label, value) {
      if(analytics) {
        console.log('--analytics--', category, action, label, value);
        analytics.sendEvent(category, action, label, value);
      } else {
        console.log('--no analytics--', category, action, label, value);
      }
    };

    return {
      sendScreen: sendScreen,
      sendEvent: sendEvent
    };
  }]);

