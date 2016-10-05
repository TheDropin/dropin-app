angular.module('controllers')
.controller('AddLocationController', function ($scope, DropinService) {

    var map, markers = {};
    
    var pressTimeout, pressPosition;
    
    function addLocation() {
        pressPosition = pressPosition.latLng.toJSON();
        console.log(pressPosition);
        
        var location = {
            geometry: {
                coordinates: [pressPosition.lat, pressPosition.lng]
            },
            description: "test"
        };
        
        DropinService.postLocation(location)
            .then(function(res){
                addLocationMarker(res);
            })
            .catch(console.error);            
    }

    $scope.$on('MAP_LOADED', function (e, _map) {
        map = _map;
        $scope.map = map;
        
        map.addListener('mousedown', function(event){
            pressPosition = event;
            pressTimeout = setTimeout(addLocation, 2000);
        });

        map.addListener('mouseup', function(event){
            clearTimeout(pressTimeout);
        });
        
        map.addListener('bounds_changed', function () {
            clearTimeout(pressTimeout);

            console.log('bounds_changed');

            var bounds = map.getBounds().toJSON();
            var query = {
                xmin: bounds['west'],
                xmax: bounds.east,
                ymin: bounds.south,
                ymax: bounds.north
            };
            console.log(JSON.stringify(query));

            DropinService.getLocationsIn(query)
                .then(function(locations) {
                    mergeLocations(locations);
                });
        });
       
    });
    

    function mergeLocations(locations) {

        var new_siteids = locations.map(function (location) {
            return location._id;
        });
        
        var marked_siteids = [];
        var delete_count = 0;

        for (var siteid in markers) {
            var index = new_siteids.indexOf(siteid);

            if (index == -1) {
                var marker = markers[siteid];
                marker.setMap(null);
                delete markers[siteid];
                delete_count++;
            } else {
                marked_siteids.push(siteid);
            }
        }

        locations.forEach(function (location) {
            addLocationMarker(location);
        })
    }

    function addLocationMarker(location) {

        if (markers[location._id]) {
            return;
        }

        var myLatLng = {
            lat: location.geometry.coordinates[0],
            lng: location.geometry.coordinates[1]
        };

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
//            icon: PaletteService.getMapPinForStop(stop),
            title: 'Hello World!'
        });

        marker.addListener('click', function () {
//            $rootScope.viewStop(stop);
        });

        markers[location._id] = marker;
    }

});