app.factory('geoService', function($rootScope, $http){

        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;


        var locations = [];


        var selectedLat = 39.50;
        var selectedLong = -98.35;


        googleMapService.refresh = function(latitude, longitude, filteredResults){

            locations = [];

            selectedLat = latitude;
            selectedLong = longitude;

            if (filteredResults){

                locations = convertToMapPoints(filteredResults);

                 initialize(latitude, longitude, true);
            }

            else {

              $http.get('/daters').success(function(response){

                    locations = convertToMapPoints(response);

                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };


        var convertToMapPoints = function(response){

            var locations = [];

            for(var i= 0; i < response.length; i++) {
                var dater = response[i];

                var  contentString =
                    '<p><b>Username</b>: ' + dater.username +
                    '<br><b>Age</b>: ' + dater.age +
                    '<br><b>Gender</b>: ' + dater.gender +
                    '<br><b>Favorite Language</b>: ' + dater.favlang +
                    '</p>';

                locations.push({
                    latlon: new google.maps.LatLng(dater.location[1], dater.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: dater.username,
                    gender: dater.gender,
                    age: dater.age
            });
        }
        return locations;
    };

var initialize = function(latitude, longitude) {

    var myLatLng = {lat: selectedLat, lng: selectedLong};

    if (!map){

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng
        });
    }

    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the bouncing
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red marker
        lastMarker = marker;
        map.panTo(marker.position);

        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });

};


google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
