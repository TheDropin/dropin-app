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
                }
            },
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
        })
        /*

            .state('app.browse', {
                    url: '/browse',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/browse.html'
                        }
                    }
                })
                .state('app.playlists', {
                    url: '/playlists',
                    views: {
                        'menuContent': {
                            templateUrl: 'templates/playlists.html',
                            controller: 'PlaylistsCtrl'
                        }
                    }
                })

            .state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        */
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/places');
});


/*
.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

    $stateProvider
        .state('intro', {
            url: '/intro',
            templateUrl: 'templates/intro.html',
            controller: 'IntroController',
            cache: false
        })
    
        .state('places', {
            url: '/places',
            templateUrl: 'templates/places.html',
            controller: 'PlacesController'
        })
        .state('place-edit', {
            url: '/place-edit',
            templateUrl: 'templates/place-edit.html',
            controller: 'PlaceEditController',
            params: {
                place: null
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'AccountController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'AccountController'
        });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/places');
});

*/