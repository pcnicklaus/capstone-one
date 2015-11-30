app.controller('addCtrl', ['$scope', '$http', 'geolocation', 'geoService', '$rootScope', function($scope, $http, geolocation, geoService, $rootScope){

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // initial setting
    $scope.formData.latitude = 39.7392;
    $scope.formData.longitude = -104.9903;

    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);



        geoService.refresh($scope.formData.latitude, $scope.formData.longitude);

        var yourCoords = new google.maps.LatLng($scope.formData.latitude, $scope.formData.longitude);

        var marker = new google.maps.Marker({
            position: yourCoords,
            map: map,
            title:"You are here!"
        });

    });


    // Get coordinates
    $rootScope.$on("clicked", function(){

        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(geoService.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(geoService.clickLong).toFixed(3);
        });
    });

    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            location: [$scope.formData.longitude, $scope.formData.latitude]
        };

        console.log(userData, " userdata");

        // Saves the user data to the db
        $http.post('/daters', userData)
            .then(function (data) {
                console.log(data, " data");

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";

                geoService.refresh($scope.formData.latitude, $scope.formData.longitude);


            })
            .catch(function (data) {
                console.log('Error: ' + data);
            });
    };
}]);
