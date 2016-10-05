angular.module('controllers')
    .controller('AddLocationController', function ($scope, DropinService) {

        $scope.addFormOpen = false;

        var map, markers = {};

        var pressPosition, placeholder, pressTimeout;

        function addLocation() {

            document.getElementById("map").style.height = "250px";

            google.maps.event.trigger(map, 'resize');

            map.setCenter(pressPosition.latLng);
            map.setZoom(18);

            var pos = pressPosition.latLng.toJSON();

            $scope.pressLocation = {
                geometry: {
                    coordinates: [pos.lat, pos.lng]
                },
                description: ""
            };

            addPlaceholderLocationMarker($scope.pressLocation);

            $scope.addFormOpen = true;
            $scope.$apply();
        }

        $scope.closeForm = function () {
            
            placeholder.setMap(null);

            $scope.addFormOpen = false;

            document.getElementById("map").style.height = "100%";
            google.maps.event.trigger(map, 'resize');

            map.setCenter(pressPosition.latLng);
            map.setZoom(16);

            $scope.pressLocation = null;
        };

        $scope.commitLocationToServer = function () {

            DropinService.postLocation($scope.pressLocation)
                .then(function (res) {
                    console.log('saved');
                    $scope.closeForm();
                })
                .catch(console.error);
        }

        $scope.$on('MAP_LOADED', function (e, _map) {
            map = _map;
            $scope.map = map;

            map.addListener('mousedown', function (event) {
                clearTimeout(pressTimeout);
                if ($scope.addFormOpen) return;
                pressPosition = event;
                pressTimeout = setTimeout(addLocation, 2000);
            });

            map.addListener('mouseup', function (event) {
                if ($scope.addFormOpen) return;
                clearTimeout(pressTimeout);
            });

            map.addListener('bounds_changed', function () {
                console.log('bounds_changed');
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
                console.log(JSON.stringify(query));

                DropinService.getLocationsIn(query)
                    .then(function (locations) {
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




        function addPlaceholderLocationMarker(location) {

            var myLatLng = {
                lat: location.geometry.coordinates[0],
                lng: location.geometry.coordinates[1]
            };

            placeholder = new google.maps.Marker({
                position: myLatLng,
                map: map,
                draggable: true,
                //            icon: PaletteService.getMapPinForStop(stop),
                title: 'Hello World!'
            });

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