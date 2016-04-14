"use strict";angular.module("App",["ngRoute"]).config(["$routeProvider",function($routeProvider){$routeProvider.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("App").controller("MainCtrl",["$scope","$q","$timeout","LocationSvc","UserSvc",function($scope,$q,$timeout,LocationSvc,UserSvc){var messageRef;UserSvc.init(),$scope.userName=localStorage.userName,$scope.userEmail=localStorage.userEmail,$scope.newMessage="",$scope.isFeedback=!1,LocationSvc.getCategories().then(function(r){$scope.categories=r}),$scope.toggleLocationType=function(locationType){$scope.mapSectionOpen=!0,$scope.selectedLocationType=locationType,LocationSvc.locationType=locationType,$scope.$emit("toggle:markers")},$scope.backToNav=function(){$scope.mapSectionOpen=!1},$scope.showMessages=function(title,isFeedback){$scope.isFeedback=isFeedback,$scope.messageSectionTitle=isFeedback?title:'Write feedback for "'+title+'"',$scope.messagesSectionOpen=!0,isFeedback&&$scope.getMessages()},$scope.closeMessages=function(){$scope.messagesSectionOpen=!1},$scope.addMessage=function(){var name=$scope.userName.trim()||"Awesome Parent",msg=$scope.newMessage.trim();msg&&$timeout(function(){messageRef.push({name:name,msg:msg,createdAt:Firebase.ServerValue.TIMESTAMP,userId:UserSvc.getUserId()})},10),$scope.newMessage=""},$scope.getMyLocation=function(){!$scope.locationRequest&&google&&($scope.locationRequest=$q.defer(),navigator.geolocation.getCurrentPosition(function(position){$scope.locationRequest.resolve({lat:position.coords.latitude,"long":position.coords.longitude})},function(){$scope.locationRequest.resolve()},{timeout:3e3}),$scope.locationRequest.promise.then(function(loc){$scope.$emit("update:location",loc),$scope.locationRequest=null}))},$scope.getMessages=function(locationId){messageRef&&messageRef.off(),"undefined"==typeof locationId?($scope.messages=[{name:"Nearby Lah for Parents",msg:"Tell us about your favorite kids play area, nursing spot or any other parenting related spot that you like.",createdAt:1*localStorage.createdAt||(new Date).getTime()}],messageRef=new Firebase("https://fiery-fire-3697.firebaseio.com/feedback/"+UserSvc.getUserId())):($scope.messages=[],messageRef=new Firebase("https://fiery-fire-3697.firebaseio.com/messages/"+locationId)),messageRef.on("child_added",function(snapshot){var currentUserId=UserSvc.getUserId(),message=snapshot.val();message.id=snapshot.key(),message.spam&&message.spam[currentUserId]&&(message.isSpam=!0),$scope.messages.unshift(message),$scope.$apply()})},$scope.updateUserInfo=function(){UserSvc.update($scope.userName,$scope.userEmail)},$scope.openExternalUrl=function(e,url){e.preventDefault(),window.open(url,"_system")},$scope.reportSpam=function(msg){if(!msg.isSpam){msg.isSpam=!0;var spamRef=new Firebase("https://fiery-fire-3697.firebaseio.com/messages/"+$scope.selectedLocation.id+"/"+msg.id+"/spam/"+UserSvc.getUserId());spamRef.set(1)}},$scope.$on("app:backbutton",function(){$scope.messagesSectionOpen?$scope.closeMessages():$scope.mapSectionOpen&&$scope.backToNav()})}]),angular.module("App").factory("LocationSvc",["$q",function($q){function initLocations(){var locationsRef=new Firebase("https://fiery-fire-3697.firebaseio.com/locations/"),deferred=$q.defer();locationPromise=deferred.promise,locationsRef.once("value",function(snapshot){var locations=snapshot.val();locations=locations.length?_.compact(locations):[],deferred.resolve(locations)},function(){deferred.resolve([])})}function initCategories(){var categoryRef=new Firebase("https://fiery-fire-3697.firebaseio.com/categories/"),deferred=$q.defer();categoryPromise=deferred.promise,categoryRef.once("value",function(snapshot){var categories=snapshot.val();deferred.resolve(categories.length?categories:[])},function(){deferred.resolve([])})}var locationPromise,categoryPromise,locationType;initLocations(),initCategories();var get=function(){return locationPromise},getCategories=function(){return categoryPromise};return{get:get,getCategories:getCategories,locationType:locationType}}]),angular.module("App").factory("UserSvc",[function(){var userId,genUUID=function(){function S4(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return(S4()+S4()+"-"+S4()+"-4"+S4().substr(0,3)+"-"+S4()+"-"+S4()+S4()+S4()).toLowerCase()},init=function(){if(localStorage.userId)userId=localStorage.userId;else{userId=genUUID(),localStorage.userId=userId,localStorage.userName="Awesome Parent",localStorage.userEmail="",localStorage.createdAt=(new Date).getTime();var userRef=new Firebase("https://fiery-fire-3697.firebaseio.com/users/"+userId);userRef.set({name:"Awesome Parent",email:"",createdAt:Firebase.ServerValue.TIMESTAMP})}console.log("init",userId)},update=function(name,email){localStorage.userName=name,localStorage.userEmail=email;var userRef=new Firebase("https://fiery-fire-3697.firebaseio.com/users/"+userId);userRef.update({name:name,email:email},function(error){if(error){var newUserRef=new Firebase("https://fiery-fire-3697.firebaseio.com/users/"+userId);newUserRef.set({name:name,email:email,createdAt:Firebase.ServerValue.TIMESTAMP})}})},getUserId=function(){return userId};return{getUserId:getUserId,init:init,update:update}}]),angular.module("App").directive("map",["LocationSvc",function(LocationSvc){function createMarkerIcons(){myLocationIcon={path:google.maps.SymbolPath.CIRCLE,fillColor:"#3E82F7",fillOpacity:1,strokeColor:"#3E82F7",strokeOpacity:.3,scale:5,strokeWeight:3},baseMarkerIcon={path:google.maps.SymbolPath.CIRCLE,fillColor:"#FF0000",fillOpacity:.6,strokeColor:"#FFFFFF",scale:7,strokeWeight:2},selectedMarkerIcon={path:"M1152 640q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52l-365-774q-33-70-33-179 0-212 150-362t362-150 362 150 150 362z",fillColor:"#CD0000",fillOpacity:1,anchor:new google.maps.Point(896,1392),scale:40/1792}}function updateMyLocation(latlong){if(latlong){var newLoc=new google.maps.LatLng(latlong.lat,latlong["long"]);_myLocationMarker.setPosition(newLoc),_myLocationMarker.setVisible(!0),_map.panTo(newLoc)}else _myLocationMarker.setVisible(!1)}function addMyLocationMarker(latlong,isVisible){var marker=new google.maps.Marker({position:latlong,map:_map,icon:myLocationIcon,visible:isVisible}),infoWindow=new google.maps.InfoWindow({content:"YOUR CURRENT LOCATION"});google.maps.event.addListener(marker,"click",function(){infoWindow.open(_map,this)}),_myLocationMarker=marker}function addLocationMarkers(){_.each(markerList,function(location){var marker=new google.maps.Marker({position:new google.maps.LatLng(location.lat,location.lon),map:_map,title:location.name,details:location.details,type:location.type,url:location.url,locationId:location.id,icon:baseMarkerIcon});google.maps.event.addListener(marker,"click",function(){_prevSelectedMarker!==marker?(marker.setIcon(selectedMarkerIcon),_prevSelectedMarker&&_prevSelectedMarker.setIcon(baseMarkerIcon),_prevSelectedMarker=marker,_scope.selectedLocation={title:this.title,details:this.details,url:this.url,id:marker.locationId},_scope.getMessages(marker.locationId),_map.panTo(marker.position)):(marker.setIcon(baseMarkerIcon),_prevSelectedMarker=null,_scope.selectedLocation=null),_scope.$apply()}),location.marker=marker}),toggleMarkers()}function toggleMarkers(){_prevSelectedMarker&&_prevSelectedMarker.setIcon(baseMarkerIcon),_prevSelectedMarker=null,_scope.selectedLocation=null;var locationType=LocationSvc.locationType;_.each(markerList,function(location){location.marker&&location.marker.setVisible(locationType===location.type)})}function loadMapAPI(){var script=document.createElement("script");script.type="text/javascript",document.getElementsByTagName("head")[0].appendChild(script),script.src="http://maps.googleapis.com/maps/api/js?v=3&callback=plotMap",navigator.geolocation.getCurrentPosition(function(position){_initialPosition={lat:position.coords.latitude,"long":position.coords.longitude},window.plotMap()},function(){_initialPosition=null,window.plotMap()},{timeout:3e3})}var _element,_scope,_map,_prevSelectedMarker,_myLocationMarker,_initialPosition,baseMarkerIcon,myLocationIcon,selectedMarkerIcon,markerList;return window.plotMap=function(){if(void 0!==_initialPosition&&google){var pos=_initialPosition||{lat:1.29,"long":103.85},currentPos=new google.maps.LatLng(pos.lat,pos["long"]);_map=new google.maps.Map(_element[0],{center:currentPos,zoom:15,disableDefaultUI:!0,zoomControl:!0,zoomControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},mapTypeId:google.maps.MapTypeId.ROADMAP}),createMarkerIcons(),addMyLocationMarker(currentPos,_initialPosition?!0:!1),LocationSvc.get().then(function(locations){markerList=locations,addLocationMarkers()})}},{restrict:"A",replace:!1,link:function(scope,element){_element=element,_scope=scope,loadMapAPI(),scope.$on("toggle:markers",function(){toggleMarkers()}),scope.$on("update:location",function(e,m){updateMyLocation(m)})}}}]),angular.module("App").directive("backButton",[function(){return{restrict:"A",replace:!1,link:function(scope){angular.element(document).on("backbutton",function(){scope.$emit("app:backbutton"),scope.$apply()})}}}]),angular.module("App").filter("msgdate",[function(){return function(input){var dt=new Date(input),gap=((new Date).getTime()-dt.getTime())/1e3;return 60>gap?"now":3600>gap?(gap/60).toFixed(0)+"m":86400>gap?(gap/3600).toFixed(0)+"h":dt.getDate()+"/"+(dt.getMonth()+1)+"/"+dt.getFullYear()%100}}]);