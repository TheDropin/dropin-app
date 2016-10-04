angular.module('dropin', ['ionic', 'services', 'controllers', 'directives'])

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
    
});

