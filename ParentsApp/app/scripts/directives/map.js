'use strict';

angular.module('App')
  .directive('map', ['LocationList', function (LocationList) {

    var _element, _scope, _map, _prevSelectedMarker;
    var baseMarkerIcon, myLocationIcon, selectedMarkerIcon;

    // --=== marker defintions ===--

    function createMarkerIcons() {
      myLocationIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#3E82F7',
        fillOpacity: 1.0,
        strokeColor: '#3E82F7',
        strokeOpacity: 0.3,
        scale: 5,
        strokeWeight: 3
      };
      baseMarkerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#FF0000',
        fillOpacity: 0.6,
        strokeColor: '#FFFFFF',
        scale: 7,
        strokeWeight: 2
      };
      selectedMarkerIcon = {
        path: 'M1152 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52l-365-774q-33-70-33-179 0-212 150-362t362-150 362 150 150 362z',
        fillColor: '#CD0000',
        fillOpacity: 1.0,
        anchor: new google.maps.Point(896,1392),
        scale: 40/1792
      };
    }

    // --=== map initialization and rendering ===--

    function addMyLocationMarker(latlong) {
      var marker = new google.maps.Marker({
        position:latlong,
        map: _map,
        icon: myLocationIcon,
      });
      var infoWindow = new google.maps.InfoWindow({
        content: 'YOUR CURRENT LOCATION'
      });
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(_map,this);
      });
    }

    function addLocationMarkers() {      
      _.each(LocationList, function(location) {
        var marker = new google.maps.Marker({
          position:new google.maps.LatLng(location.lat, location.lon),
          map: _map,
          title: location.name,
          details: location.details,
          type: location.type,
          url: location.url,
          icon: baseMarkerIcon
        });

        google.maps.event.addListener(marker, 'click', function(){
          marker.setIcon(selectedMarkerIcon);
          if(_prevSelectedMarker && _prevSelectedMarker != marker) {_prevSelectedMarker.setIcon(baseMarkerIcon);}
          _prevSelectedMarker = marker;
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
          location.marker.setVisible(!locationType || (locationType === location.type));
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
      createMarkerIcons();
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


