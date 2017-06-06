app.controller("profileCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', function($rootScope, $scope, $http, $cookies, $location){

    $scope.updateProfile = function($userId) {
        var sUrl = $rootScope.apiPath + "/users/"+$userId+"/update";
        var oConfig = {
            url: sUrl,
            method: "PUT",
            data: {'email': $rootScope.user.email, 'username': $rootScope.user.username},
            headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
            if (response.data.hasOwnProperty('error')){
                console.log(response.data);
            }
            else{
                console.log(response.data);
                for(user in $rootScope.flat.users){
                    if($rootScope.flat.users[user].id === response.data.id){
                        $rootScope.flat.users[user] = response.data;
                    }
                }
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.updatePassword = function($userId) {
        var sUrl = $rootScope.apiPath + "/users/"+$userId+"/password";
        var oConfig = {
            url: sUrl,
            method: "PUT",
            data: $scope.passForm,
            headers: {Authorization: 'Bearer ' + $rootScope.user.token},
            params: {callback: "JSON_CALLBACK"}
        };
        $http(oConfig).then(function successCallback(response) {
            if (response.data.hasOwnProperty('error')){
                console.log(response.data);
            }
            else{
                for(user in $rootScope.flat.users){
                    if($rootScope.flat.users[user].id === response.data.id){
                        $rootScope.flat.users[user] = response.data;
                    }
                }
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
}]);