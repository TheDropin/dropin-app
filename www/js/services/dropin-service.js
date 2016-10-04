angular.module('services').factory('DropinService', function($q, $http){
    
    var API_URL = "https://the-dropin.herokuapp.com/api/v1";
    
    function getLocations(lat, lon) {

        return $http.get(API_URL+"/location",{ 
            headers: {
                "Geo-Position": lat + "," + lon
            }
        });
        
    }
   
    return {
        getLocations: getLocations
    };
    
});