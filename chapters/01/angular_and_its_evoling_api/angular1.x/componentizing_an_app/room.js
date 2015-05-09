// room.js
var directives = angular.module('app.directives');
directives.directive('room', room);

/**
 * The directive that creates a room, which contains different types of 
 * objects. (i.e. doors, windows, rooms)
 */
function room() {

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
     * The controller for a room
     */
    function roomCtrl() {
        // no logic needed in our room currently
    }
}