angular.module('dropin', ['ionic', 'ngRoute', 'services', 'controllers', 'directives', 'pascalprecht.translate'])

.run(function ($ionicPlatform, DropinService, Config, googleMapsLoader) {

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

/*
        DropinService.getLocations(44.9, -92.3)
            .then(function (res) {
                console.dir(res);
            })
            .catch(console.error);
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

.config(function ($routeProvider, $urlRouterProvider, $translateProvider) {
/*
    $translateProvider
        .useStaticFilesLoader({
            prefix: 'js/locales/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'es'], {
            'en': 'en',
            'en_GB': 'en',
            'en_US': 'en',
            'es': 'es',
            'es-MX': 'es',
            'es_ES': 'es'
        })
        .preferredLanguage('en')
        .fallbackLanguage('en')
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('escapeParameters');
*/

    $routeProvider
        .when('/add-place', {
            templateUrl: 'templates/add-place.html',
            controller: 'AddPlaceController',
            cache: false
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/add-place');
});

