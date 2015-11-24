app.controller('addCtrl', function($scope, $http){

    // $scope.formData = {};
    // var coords = {};
    // var lat = 0;
    // var long = 0;

    // // initial setting
    // $scope.formData.latitude = 39.500;
    // $scope.formData.longitude = -98.350;


    // $scope.createUser = function() {

    //     // Grabs all of the text box fields
    //     var userData = {
    //         username: $scope.formData.username,
    //         gender: $scope.formData.gender,
    //         age: $scope.formData.age,
    //         location: [$scope.formData.longitude, $scope.formData.latitude],
    //         htmlverified: $scope.formData.htmlverified
    //     };

    //     // Saves the user data to the db
    //     $http.post('/users', userData)
    //         .then(function (data) {

    //             // Once complete, clear the form (except location)
    //             $scope.formData.username = "";
    //             $scope.formData.gender = "";
    //             $scope.formData.age = "";

    //         })
    //         .catch(function (data) {
    //             console.log('Error: ' + data);
    //         });
    // };
});
