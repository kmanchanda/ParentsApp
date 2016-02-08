'use strict';

angular.module('App')
  .directive('map', [function () {

    var pos, isMapAPILoaded;
    var _element, _map;

    function addMyLocationMarker(latlong) {
      var marker = new google.maps.Marker({
        position:latlong,
        map: _map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      });

      google.maps.event.addListener(marker, 'click', function(){
        var info_body = '<b>Current Location</b>';
        var infoWindow = new google.maps.InfoWindow({
          content: info_body,
        });
        infoWindow.open(_map,this);
      });  
    }

    function loadMapAPI(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.src = 'http://maps.googleapis.com/maps/api/js?v=3&sensor=false&callback=mapAPILoaded';
    }
    loadMapAPI();

    function plotMap(){
      if(!pos || !isMapAPILoaded) {
        return;
      }
      var currentPos = new google.maps.LatLng(pos.lat, pos.long);
      _map = new google.maps.Map(_element[0], {
        center:currentPos,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      });
      addMyLocationMarker(currentPos);
    }

    window.mapAPILoaded = function() {
      isMapAPILoaded = true;
      plotMap();
    };

    return {
      restrict: 'A',
      replace: false,

      link: function(scope, element) {
        _element = element;
        scope.$on('location:get', function(e, position) {
          pos = position;
          plotMap();
        });
      }
    };
  }]);


