app.controller('addCtrl', ['$scope', '$http', 'geolocation', 'geoService', '$rootScope', function($scope, $http, geolocation, geoService, $rootScope){

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // initial setting
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        geoService.refresh($scope.formData.latitude, $scope.formData.longitude);

    });


    // Get coordinates
    $rootScope.$on("clicked", function(){

        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(geoService.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(geoService.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });

    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
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
