var module = angular.module('DropinService', []);

module.factory('DropinService', function ($q, $http) {

    var API_URL = '';
    var API_PREFIX = "/api/v1";

    var token = localStorage.getItem('Account-JWT');
    if (token) {
        $http.defaults.headers.common.Authorization = token;
        localStorage.setItem('Account-JWT', token);
    }


    function authenticate(user) {

        return $http.post(API_URL + API_PREFIX + '/authenticate', user)
            .then(function (response) {
                console.log(response);
                var token = response.data.token;
                $http.defaults.headers.common.Authorization = token;
                localStorage.setItem('Account-JWT', token);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function signup(user) {

        return $http.post(API_URL + API_PREFIX + '/signup', user)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function postPlace(place) {

        var def = $q.defer();

        $http.post(API_URL + "/places", place)
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

    function getPlaces() {

        return $http.get(API_URL + API_PREFIX + '/places');

    }

    function getPlacesIn(bounds) {

        var def = $q.defer();

        $http.get(API_URL + API_PREFIX + "/places", {
                params: bounds
            })
            .then(function (res) {
                def.resolve(res.data.content);
            })
            .catch(function (err) {
                console.error(err);
            });

        return def.promise;
    }


    var bowerPath = 'bower_components/';
    var placeIconPath = bowerPath+'dropin-service/img/place_icons/';
    var placeIcon = {
        food: 'apple.png',
        restroom: 'toilet-paper.png',
        bed: 'person-lying-on-bed-inside-a-home.png',
        electric: 'power-cord.png',
        water: 'raindrop.png',
        help: 'stop.png'
    };

    
    return {
        setBowerPath: function(path){ bowerPath = path; },
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
        getPlaces: getPlaces,
        getPlacesIn: getPlacesIn,
        placeIcon: function(type) {
            return placeIconPath + placeIcon[type];
        }
    };
})