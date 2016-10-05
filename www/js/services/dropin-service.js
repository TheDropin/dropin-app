angular.module('services').factory('DropinService', function($q, $http){
    
    var API_URL = "https://the-dropin.herokuapp.com/api/v1";
    
    function postLocation(location) {
        
        var def = $q.defer();

        $http.post(API_URL+"/location",location)
            .then(function(res){
                def.resolve(res.data);
            })
            .catch(def.reject);
        
        return def.promise;
    }
    
    function getLocations(lat, lon) {
        
        var def = $q.defer();

        $http.get(API_URL+"/location",{ 
            headers: {
                "Geo-Position": lat + "," + lon
            }
        }).then(function(res){
            console.log(res);
            def.resolve(res.data.content);
        });
        
        return def.promise;
    }
    
    function getLocationsIn(bounds) {
        
        var def = $q.defer();

        $http.get(API_URL+"/location",{ 
            params: bounds
        }).then(function(res){
            console.log(res);
            def.resolve(res.data.content);
        });
        
        return def.promise;
    }
   
    return {
        getLocations: getLocations,
        getLocationsIn: getLocationsIn,
        postLocation: postLocation
    };
    
});