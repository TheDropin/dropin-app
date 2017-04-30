var module = angular.module('DropinService', []);

module.factory('DropinService', function ($q, $http) {
    
    var API_URL = '';
    var API_PREFIX = "/api/v1";
/*
    var token = localStorage.getItem('Account-JWT');
    if (token) {
        $http.defaults.headers.common.Authorization = token;
        localStorage.setItem('Account-JWT', token);
    }
*/

    function authenticate(user) {

        return $http.post(API_URL + API_PREFIX + '/authenticate', user)
            .then(function (response) {
                console.log(response);
                var token = response.data.token;
                $http.defaults.headers.common.Authorization = token;
                localStorage.setItem('Account-JWT', token);
            })
            .catch(function (err) {
                console.error(JSON.stringify(err));
            });
    }

    function signup(user) {

        return $http.post(API_URL + API_PREFIX + '/signup', user)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (err) {
                console.error(JSON.stringify(err));
            });
    }

    function postPlace(place) {

        var def = $q.defer();

        $http.post(API_URL + API_PREFIX + "/places", place)
            .then(function (res) {
                def.resolve(res.data);
            })
            .catch(def.reject);

        return def.promise;
    }

    function updatePlace(place) {

        var def = $q.defer();

        $http.put(API_URL + API_PREFIX + "/places/"+place._id, place)
            .then(function (res) {
                def.resolve(res.data);
            })
            .catch(def.reject);

        return def.promise;
    }
    
    function deletePlace(placeId) {
        
        return $http.delete(API_URL + API_PREFIX + "/places/"+placeId);
    }

    function getPlaces() {

        return $http.get(API_URL + API_PREFIX + '/places');

    }

    function getPlacesIn(bounds) {
console.log('getPlacesIn');
        var def = $q.defer();
        
            console.log('$http.get');
        $http.get(API_URL + API_PREFIX + "/places", {
                params: bounds
            })
            .then(function (res) {
            console.log(res);
                def.resolve(res.data.results);
            })
            .catch(function (err) {
            console.log('error')
                console.log(err);
                console.error(JSON.stringify(err));
            });

        return def.promise;
    }



    
    return {
        setBowerPath: function(path){
            bowerPath = path; 
            placeIconPath = bowerPath+'dropin-service/img/place_icons/';
        },
        setUrl: function (url) {
            API_URL = url;
        },
        authenticate: authenticate,
        signup: signup,
        logout: function () {
            delete $http.defaults.headers.common.Authorization;
        },
        postPlace: postPlace,
        updatePlace: updatePlace,
        deletePlace: deletePlace,
        getPlaces: getPlaces,
        getPlacesIn: getPlacesIn,
        placeIcon: function(type) {

            var icon = placeIcon[type];
            if (icon) {
                return placeIconPath + icon;
            } else {
                return null;
            }
        }
    };
})