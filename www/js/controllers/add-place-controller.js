angular.module('controllers')
.controller('AddPlaceController', function ($scope, DropinService) {

    $scope.addFormOpen = false;

    var map, markers = {};

    var pressPosition, placeholder, pressTimeout;

    function addPlace() {

        document.getElementById("map").style.height = "250px";

        google.maps.event.trigger(map, 'resize');

        map.setCenter(pressPosition.latLng);
        map.setZoom(18);

        var pos = pressPosition.latLng.toJSON();

        $scope.pressPlace = {
            geometry: {
                coordinates: [pos.lat, pos.lng]
            },
            description: ""
        };

        addPlaceholderMarker($scope.pressPlace);

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

        $scope.pressPlace = null;
    };

    $scope.commitPlaceToServer = function () {

        DropinService.postPlace($scope.pressPlace)
            .then(function (res) {
                console.log('saved');
                $scope.closeForm();
            })
            .catch(function (err) {
                console.error(JSON.stringify(err));
            });
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
            console.log(JSON.stringify(query));

            DropinService.getPlacesIn(query)
                .then(function (places) {
                    mergePlaces(places);
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


    function addPlaceholderMarker(place) {

        var myLatLng = {
            lat: place.geometry.coordinates[0],
            lng: place.geometry.coordinates[1]
        };

        placeholder = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true,
            //            icon: PaletteService.getMapPinForStop(stop),
            title: 'Hello World!'
        });

    }


    function addPlaceMarker(place) {

        if (markers[place.id]) {
            return;
        }

        var myLatLng = {
            lat: place.geometry.coordinates[0],
            lng: place.geometry.coordinates[1]
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

        markers[place.id] = marker;
    }

});