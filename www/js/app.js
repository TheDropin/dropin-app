angular.module('dropin', ['ionic', 'ngRoute', 'services', 'controllers', 'directives', 'pascalprecht.translate', 'DropinService'])

.run(function ($ionicPlatform, DropinService, Config, googleMapsLoader, $state) {

    DropinService.setBowerPath('lib/');
    //    var SERVER_URL = "http://localhost:3000";
    var SERVER_URL = "http://the-dropin.herokuapp.com";
    DropinService.setUrl(SERVER_URL);

    function ready() {
        console.log('ready')

        Config.load
            .then(function (config) {
                console.log(config.google_maps.api_key);
                googleMapsLoader.init(config.google_maps.api_key);
            })
            .catch(function (err) {
                console.error('could not load config');
            });

        var storage = window.localStorage;
        var runNumber = storage.getItem('runNumber');
        if (!runNumber) {
            runNumber = 1;
        } else {
            runNumber++;
        }
        storage.setItem('runNumber', runNumber);
        /*
                if (true || runNumber == 1) {
                    console.log('going to intro')
                    $state.go('intro');
                }
        */
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    };

    if (window.cordova) {
        console.log('window.cordova')
        $ionicPlatform.ready(ready);
    } else {
        ready();
    }

})


.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        //        controller: 'AppCtrl'
    })

    .state('app.places', {
            url: '/places',
            views: {
                'menuContent': {
                    templateUrl: 'templates/places.html',
                    controller: 'PlacesController'
                }
            }
        })
        .state('app.place-edit', {
            url: '/place-edit',
            views: {
                'menuContent': {
                    templateUrl: 'templates/place-edit.html',
                    controller: 'PlaceEditController',
                },
            },
            cache: false,
            params: {
                place: null
            }
        })
        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html'
                }
            }
        });

    $urlRouterProvider.otherwise('/app/places');
});

