var directives = angular.module('app.directives', []);
directives.directive('room', room);

/**
 * the directive that creats a room, which contains different types of 
 * objects. ie(doors, windows, rooms)
 * 
 */
function room(){


    var roomBindObj = {
        doors: '='
    };
    
    return {
        restrict: 'E',
        scope: true,
        controllerAs: 'room',
        controller: roomCtrl,
        templateUrl: 'room.html',
        bindToController: roomBindObj
    }
    
    /**
     * the controller for a room
     */
    function roomCtrl() {
        
    }
}