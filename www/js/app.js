angular.module('dropin', ['ionic'])

.run(function ($ionicPlatform, DropinService) {
    $ionicPlatform.ready(function () {
        
        DropinService.getLocations();
        
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
