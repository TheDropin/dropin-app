angular.module('services')
    .factory('Config', function ($http, $q, $ionicPlatform) {
    
    var def = $q.defer();

    $ionicPlatform.ready(function() {
        $http.get('./config.json')
            .then(function (resp) {
                def.resolve(resp.data);
            })
            .catch(function (err) {
                def.reject(err);
            });
    });

    return {
        load: def.promise
    };

});
