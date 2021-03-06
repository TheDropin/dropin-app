angular.module('controllers')
    .controller('PlacesController', function ($scope, DropinService, $state) {

        $scope.addFormOpen = false;

        var map, markers = {};

        var pressPosition, pressTimeout;

    
        function addPlace() {
            
            var pos = pressPosition.latLng.toJSON();

            $scope.pressPlace = {
                geometry: {
                    coordinates: [pos.lat, pos.lng]
                },
                description: ""
            };
            
            $state.go('place-edit', {place:$scope.pressPlace});           
        }

    
        $scope.$on('MAP_LOADED', function (e, _map) {
            map = _map;
            $scope.map = map;

            map.addListener('mousedown', function (event) {
                clearTimeout(pressTimeout);
                if ($scope.addFormOpen) return;
                pressPosition = event;
                pressTimeout = setTimeout(addPlace, 2000);
            });

            map.addListener('mouseup', function (event) {
                if ($scope.addFormOpen) return;
                clearTimeout(pressTimeout);
            });

            map.addListener('bounds_changed', function () {
                clearTimeout(pressTimeout);
            });

            map.addListener('idle', function () {

                console.log('idle');
                if ($scope.addFormOpen) return;

                var bounds = map.getBounds().toJSON();
                var query = {
                    xmin: bounds['west'],
                    xmax: bounds.east,
                    ymin: bounds.south,
                    ymax: bounds.north
                };
                console.log('will query...');
                console.log(JSON.stringify(query));

                DropinService.getPlacesIn(query)
                    .then(function (places) {
                        mergePlaces(places);
                    }).catch(function(error){
                        console.log(JSON.stringify(error))
                    });
            });

        });


        function mergePlaces(places) {

            var new_siteids = places.map(function (place) {
                return place.id;
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

            places.forEach(function (place) {
                addPlaceMarker(place);
            })
        }


        function addPlaceMarker(place) {

            if (markers[place.id]) {
                return;
            }

            var myLatLng = {
                lat: place.fields.location.geo[1],
                lng: place.fields.location.geo[0]
            };
console.log(JSON.stringify(myLatLng));
            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: place.fields.title,
//                icon: DropinService.placeIcon(place.fields.type)
            });

            marker.addListener('click', function () {
                $state.go('app.place-edit', { place: place });
            });

            markers[place.id] = marker;
        }

    });