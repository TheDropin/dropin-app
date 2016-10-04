angular.module('dropin').factory('DropinService', function($q, $http){
    
    var API_URL = "/dropin_api";
    
    function getLocations() {
        
        getGeoHeader().then(function(getHeader){
            
            $http.get(API_URL+"/location", { headers: getHeader })
                .then(function(res){
                    console.dir(res);                                                
                });
        });
        
    }
    
   function getGeoHeader() {
       
       var def = $q.defer();
       
        navigator.geolocation.getCurrentPosition(
            function(position){
                console.log(position);
                def.resolve({
                    "geo-Position": 
                    position.coords.latitudeZ+","+position.coords.longitude
                });
            },
            def.resolve,
            def.reject,
            {});
       
       return def.promise;
   } 
   
    return {
        getLocations: getLocations
    };
});