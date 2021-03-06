app.factory('geoService', function($rootScope, $http){

        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;


        var locations = [];


        var selectedLat = 39.7392;
        var selectedLong = -104.9903;


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
                    '<br><b>Gender</b>: ' + dater.gender  +
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

var initialize = function(latitude, longitude, filter) {


    var myLatLng = {lat: selectedLat, lng: selectedLong};

    if (!map){

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: myLatLng
        });
    }

    // If a filter was used set the icons yellow, otherwise blue
    if(filter){
        icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    }
    else{
        icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }

    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Big Map",
            icon: icon,
        });

        google.maps.event.addListener(marker, 'click', function(e){

            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://www.inkace.com/media/catalog/product/cache/1/thumbnail/50x/9df78eab33525d08d6e5fb8d27136e95/f/u/fuck_off_vinyl_decal.jpg'
    });
    // lastMarker = marker;


    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the bouncing red marker
    // google.maps.event.addListener(map, 'click', function(e){
    //     var marker = new google.maps.Marker({
    //         position: e.latLng,
    //         map: map,
    //         icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    //     });

        // When a new spot is selected, delete the old red bouncing marker
        // if(lastMarker){
        //     lastMarker.setMap(null);
        // }

        // Create a new red bouncing marker and move to it
        // lastMarker = marker;
        // map.panTo(marker.position);


        // googleMapService.clickLat = marker.getPosition().lat();
        // googleMapService.clickLong = marker.getPosition().lng();
        // $rootScope.$broadcast("clicked");
    // });
};


google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
