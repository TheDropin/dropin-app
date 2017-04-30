angular.module('controllers')
    .controller('PlaceEditController', function ($scope, DropinService, $stateParams, $state) {

        $scope.place = $stateParams.place;

        $scope.types = {
            restroom: "Restroom",
            electric: "Power Outlet",
            water: "Drinking Fountain"
        };

        var map, placeholder, pressTimeout;


        $scope.commitPlaceToServer = function () {

            if (placeholder) {
                var pos = placeholder.getPosition().toJSON();
                $scope.place.geometry.coordinates = [pos.lat, pos.lng];
            }            

            var promise;

            if ($scope.place._id) {
                promise = DropinService.updatePlace($scope.place)
            } else {
                promise = DropinService.postPlace($scope.place)
            }

            promise
                .then(function (res) {
                    console.log('saved');
                    $state.go('places');
                })
                .catch(function (err) {
                    console.error(JSON.stringify(err));
                });
        }

        $scope.$on('MAP_LOADED', function (e, _map) {
            map = _map;
            $scope.map = map;

            if ($scope.place) {

                placeholder = addPlaceholderMarker($scope.place);
                map.setCenter(placeholder.getPosition());
                map.setZoom(18);

                placeholder.addListener('dragend', function (pos) {
                    map.panTo(placeholder.getPosition());
                });

            }
        });


        function addPlaceholderMarker(place) {
            
            var myLatLng = {
                lat: place.fields.location.geo[1],
                lng: place.fields.location.geo[0]
            };

            var pin = new google.maps.Marker({
                position: myLatLng,
                map: map,
                draggable: true,
                //            icon: PaletteService.getMapPinForStop(stop),
                title: 'Hello World!'
            });

            $scope.$watch('place.type', function (value) {
                console.log(value);

                var iconUrl = DropinService.placeIcon(place.type);
                placeholder.setIcon(iconUrl);
            });

            return pin;
        }


        $scope.cancel = function () {
            $state.go('places');
        };

        $scope.delete = function () {
            if (navigator.notification.confirm('Really delete this place?')) {
                DropinService.deletePlace($scope.place._id)
                    .then(function(){
                        $state.go('places');
                    })
                    .catch(console.log);
            }
        };

    });