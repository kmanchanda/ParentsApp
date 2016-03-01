'use strict';

angular.module('App')
  .filter('msgdate', [function(){
    return function(input) {
      var dt = new Date(input);
      var gap = ((new Date()).getTime() - dt.getTime())/1000;
      if(gap < 60) {
        return 'now';
      } else if(gap < 3600) {
        return (gap/60).toFixed(0) + 'm';
      } else if(gap < 86400) {
        return (gap/3600).toFixed(0) + 'h';
      } else {
        return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + (dt.getFullYear() % 100);  
      }
    };
  }])
;