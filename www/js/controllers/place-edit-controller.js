angular.module('controllers')
    .controller('PlaceEditController', function ($scope, DropinService, $stateParams) {

        $scope.place = $stateParams.place;

        $scope.types = {
            restroom: "Restroom",
            electric: "Power Outlet",
            water: "Drinking Fountain"
        };

        var map;

        var pressPosition, placeholder, pressTimeout;


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

            if ($scope.place) {

                var coords = $scope.place.geometry.coordinates;
                var myLatLng = {
                    lat: coords[0],
                    lng: coords[1]
                };

                map.setCenter(myLatLng);
                map.setZoom(18);

                addPlaceholderMarker($scope.place);

            }
        });


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

    });