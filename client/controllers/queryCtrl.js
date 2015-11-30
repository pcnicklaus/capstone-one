app.controller('queryCtrl', ['$scope', '$log', '$http', '$rootScope', 'geolocation', 'geoService', '$rootScope', function($scope, $log, $http, $rootScope, geolocation, geoService){


    $scope.formData = {};
    var queryBody = {};


    // this is supposted to get user's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){
        coords = {
            lat: data.coords.latitude,
            long: data.coords.longitude
        };
        console.log(coords.lat, coords.long, "in query control");

        // Set the latitude and longitude equal to the HTML5 coordinates
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(geoService.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(geoService.clickLong).toFixed(3);
        });
    });

    // Take query parameters and incorporate into a JSON queryBody
    $scope.queryUsers = function(){

        // Assemble Query Body
        queryBody = {
            longitude: parseFloat($scope.formData.longitude),
            latitude: parseFloat($scope.formData.latitude),
            distance: parseFloat($scope.formData.distance),
            male: $scope.formData.male,
            female: $scope.formData.female,
            other: $scope.formData.other,
            minAge: $scope.formData.minage,
            maxAge: $scope.formData.maxage
        };

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/daters/query/', queryBody)

            // Store the filtered results in queryResults
            .success(function(queryResults){
                ('here')
                // Query Body and Result Logging
                geoService.refresh(queryBody.latitude, queryBody.longitude, queryResults);

                // Count the number of records retrieved for the panel-footer
                $scope.queryCount = queryResults.length;
            })
            .error(function(queryResults){
                console.log('Error ' + queryResults);
            });
    };
}]);
