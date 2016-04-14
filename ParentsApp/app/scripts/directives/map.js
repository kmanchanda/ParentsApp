'use strict';

angular.module('App')
  .directive('map', ['LocationSvc', function (LocationSvc) {

    var _element, _scope, _map, _prevSelectedMarker, _myLocationMarker, _initialPosition;
    var baseMarkerIcon, myLocationIcon, selectedMarkerIcon;
    var markerList;

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

    // --=== getCurrentLocation ===--

    function updateMyLocation(latlong) {
      if(latlong) {
        var newLoc = new google.maps.LatLng(latlong.lat, latlong.long);
        _myLocationMarker.setPosition(newLoc);
        _myLocationMarker.setVisible(true);
        _map.panTo(newLoc);
      } else {
        _myLocationMarker.setVisible(false);
      }
    }    

    // --=== map initialization and rendering ===--

    function addMyLocationMarker(latlong, isVisible) {
      var marker = new google.maps.Marker({
        position:latlong,
        map: _map,
        icon: myLocationIcon,
        visible: isVisible
      });
      var infoWindow = new google.maps.InfoWindow({
        content: 'YOUR CURRENT LOCATION'
      });
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(_map,this);
      });
      _myLocationMarker = marker;
    }

    function addLocationMarkers() {
      _.each(markerList, function(location) {
        var marker = new google.maps.Marker({
          position:new google.maps.LatLng(location.lat, location.lon),
          map: _map,
          title: location.name,
          details: location.details,
          type: location.type,
          url: location.url,
          locationId: location.id,
          icon: baseMarkerIcon
        });

        google.maps.event.addListener(marker, 'click', function(){
          if(_prevSelectedMarker !== marker) {
            marker.setIcon(selectedMarkerIcon);
            if(_prevSelectedMarker) {_prevSelectedMarker.setIcon(baseMarkerIcon);}
            _prevSelectedMarker = marker;
            _scope.selectedLocation = {title: this.title, details: this.details, url: this.url, id: marker.locationId};
            _scope.getMessages(marker.locationId);
            _map.panTo(marker.position);
          } else {
            marker.setIcon(baseMarkerIcon);
            _prevSelectedMarker = null;
            _scope.selectedLocation = null;
          }
          _scope.$apply();
        });

        location.marker = marker;
      });
      toggleMarkers();
    }

    function toggleMarkers() {
      if(_prevSelectedMarker) {_prevSelectedMarker.setIcon(baseMarkerIcon);}
      _prevSelectedMarker = null;
      _scope.selectedLocation = null;
      
      var locationType = LocationSvc.locationType;
      _.each(markerList, function(location) {
        if(location.marker) {
          location.marker.setVisible(locationType === location.type);
        }
      });
    }

    function loadMapAPI(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(script);
      script.src = 'http://maps.googleapis.com/maps/api/js?v=3&callback=plotMap';

      // parallely load my current position
      navigator.geolocation.getCurrentPosition(function(position) {
        _initialPosition = {lat: position.coords.latitude, long: position.coords.longitude};
        window.plotMap();
      }, function() {
        _initialPosition = null;
        window.plotMap();
      }, {
        timeout: 3000
      });
    }

    window.plotMap = function(){
      if(_initialPosition === undefined || !google) {return;}
      
      var pos = _initialPosition || {lat: 1.29, long: 103.85};
      var currentPos = new google.maps.LatLng(pos.lat, pos.long);
      _map = new google.maps.Map(_element[0], {
        center:currentPos,
        zoom:15,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP
        },
        mapTypeId:google.maps.MapTypeId.ROADMAP
      });
      createMarkerIcons();
      addMyLocationMarker(currentPos, _initialPosition ? true : false);
      LocationSvc.get().then(function(locations) {
        markerList = locations;
        addLocationMarkers();  
      });
    };

    return {
      restrict: 'A',
      replace: false,

      link: function(scope, element) {
        _element = element;
        _scope = scope;
        loadMapAPI();

        scope.$on('toggle:markers', function() {
          toggleMarkers();
        });
        scope.$on('update:location', function(e, m) {
          updateMyLocation(m);
        });
      }
    };
  }]);


