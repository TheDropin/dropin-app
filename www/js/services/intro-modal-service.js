angular.module('services').factory('IntroModalService', function ($rootScope, $ionicModal) {
    
    var modal;
    
    var $scope = $rootScope.$new();
    
    var promise = $ionicModal.fromTemplateUrl('templates/intro.html', {
        animation: 'slide-in-up',
        scope: $scope
    });
    
    promise.then(function (_modal) {
        modal = _modal;
    });
    
    $scope.closeModal = function() {
        modal.hide();
    };
    
    
    return {
        show: function(){
            promise.then(function(m){ m.show(); });
        },
        hide: function(){
            promise.then(function(m){ m.hide(); });
        }
    };
});