app.controller("profileCtrl", ['$rootScope', '$scope', '$http', '$cookies', '$location', "$filter", function($rootScope, $scope, $http, $cookies, $location, $filter){
    $("#profileLink").addClass("activePage");
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
                $rootScope.error = response.data.error;
            }
            else{
                $rootScope.error = "";
                for(user in $rootScope.flat.users){
                    if($rootScope.flat.users[user].id === response.data.id){
                        $rootScope.flat.users[user] = response.data;
                        $rootScope.showNotification($filter('translate')('PROFILE_UPDATED'), null);
                        break;
                    }
                }
            }
        }, function errorCallback(response) {
            $location.path('/login');
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
                $rootScope.error = $filter('translate')(response.data.error);
            }
            else{
                $rootScope.error = "";
                for(user in $rootScope.flat.users){
                    if($rootScope.flat.users[user].id === response.data.id){
                        $rootScope.flat.users[user] = response.data;
                        $rootScope.showNotification($filter('translate')('PASSWORD_CHANGED'), null);
                        break;
                    }
                }
            }
        }, function errorCallback(response) {
            $location.path('/login');
        });
    };
}]);