'use strict';

angular.module('App')
  .directive('map', ['LocationList', 'LocationTypeList', function (LocationList, LocationTypeList) {

    var _element, _scope, _map;

    function addMyLocationMarker(latlong) {
      var marker = new google.maps.Marker({
        position:latlong,
        map: _map,
        icon: 'images/green-dot.png',
      });

      google.maps.event.addListener(marker, 'click', function(){
        _scope.selectedLocation = {title: 'Your location'};
        _scope.$apply();
      });  
    }

    function addLocationMarkers() {
      _.each(LocationList, function(location) {
        location.id = (location.type === 'Nursing') || (location.type === 'Play') || (location.type === 'Food and Play') ? location.type : 'Others';
        location.type = (location.type === 'Nursing') || (location.type === 'Play') || (location.type === 'Food and Play') ? location.type + ' Area' : location.type;

        var marker = new google.maps.Marker({
          position:new google.maps.LatLng(location.lat, location.lon),
          map: _map,
          title: location.name,
          details: location.details,
          url: location.url,
          type: location.type,
          icon: 'images/' + LocationTypeList[location.id].icon
        });

        google.maps.event.addListener(marker, 'click', function(){
          _scope.selectedLocation = {title: this.title, details: this.details, url: this.url};
          _scope.$apply();
        });

        location.marker = marker;
      });
      toggleMarkers();
    }

    function toggleMarkers(locationType) {
      _.each(LocationList, function(location) {
        if(location.marker) {
          location.marker.setVisible(!locationType || (locationType === location.id));
        }
      });
    }

    function loadMapAPI(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.src = 'http://maps.googleapis.com/maps/api/js?v=3&callback=plotMap';
    }

    window.plotMap = function(){
      var pos = {lat: 1.34, long: 103.85};
      var currentPos = new google.maps.LatLng(pos.lat, pos.long);
      _map = new google.maps.Map(_element[0], {
        center:currentPos,
        zoom:12,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        mapTypeId:google.maps.MapTypeId.ROADMAP
      });
      addMyLocationMarker(currentPos);
      addLocationMarkers();
    };

    return {
      restrict: 'A',
      replace: false,

      link: function(scope, element) {
        _element = element;
        _scope = scope;
        loadMapAPI();

        scope.$on('toggle:markers', function(e, m) {
          toggleMarkers(m);
        });
      }
    };
  }]);


