'use strict';

angular.module('App')
  .directive('map', ['LocationList', function (LocationList) {

    var pos, isMapAPILoaded;
    var _element, _map;

    function addMyLocationMarker(latlong) {
      var marker = new google.maps.Marker({
        position:latlong,
        map: _map,
        icon: 'images/green-dot.png',
      });

      google.maps.event.addListener(marker, 'click', function(){
        var info_body = '<b>Current Location</b>';
        var infoWindow = new google.maps.InfoWindow({
          content: info_body,
        });
        infoWindow.open(_map,this);
      });  
    }

    function addLocationMarkers() {
      _.each(LocationList, function(location) {
        var icon_type, location_type;
        if (location.type === 'Nursing'){
          icon_type = 'images/pink-dot.png';
          location_type = 'Nursing Area';
        } else if (location.type === 'Play'){
          icon_type = 'images/blue-dot.png';
          location_type = 'Play Area';
        } else if (location.type === 'Food and Play'){
          icon_type = 'images/yellow-dot.png';
          location_type = 'Food And Play Area';
        } else {
          icon_type = 'images/red-dot.png';
          location_type = location.type;
        }

        var marker = new google.maps.Marker({
          position:new google.maps.LatLng(location.lat, location.lon),
          map: _map,
          title: location.name,
          details: location.details,
          url: location.url,
          type: location_type,
          icon: icon_type,
        });

        google.maps.event.addListener(marker, 'click', function(){
          var info_body = '<b>'+this.title + ' (' + this.type + ')</b><br>' + this.details + '<br><b>' + this.url + '</b>';
          var infoWindow = new google.maps.InfoWindow({
            content: info_body,
          });
          infoWindow.open(_map,this);
        });

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
      addLocationMarkers();
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


