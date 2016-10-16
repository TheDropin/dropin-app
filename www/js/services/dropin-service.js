angular.module('services').factory('DropinService', function($q, $http){
    
    var API_URL = "https://the-dropin.herokuapp.com/api/v1";
    
    function postPlace(place) {
        
        var def = $q.defer();

        $http.post(API_URL+"/places", place)
            .then(function(res){
                def.resolve(res.data);
            })
            .catch(def.reject);
        
        return def.promise;
    }
    
    function getPlaces(lat, lon) {
        
        var def = $q.defer();

        $http.get(API_URL+"/places",{ 
            headers: {
                "Geo-Position": lat + "," + lon
            }
        }).then(function(res){
            console.log(res);
            def.resolve(res.data.content);
        });
        
        return def.promise;
    }
    
    function getPlacesIn(bounds) {
        
        var def = $q.defer();

        $http.get(API_URL+"/places",{ 
            params: bounds
        }).then(function(res){
            console.log(res);
            def.resolve(res.data.content);
        });
        
        return def.promise;
    }
   
    return {
        getPlaces: getPlaces,
        getPlacesIn: getPlacesIn,
        postPlace: postPlace
    };
    
});