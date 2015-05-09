// door.js
var directives = angular.module('app.directives', []);
directives.directive('door', door);

/**
 * A directive that creates door object, which contains specific values related to a door.
 */
function door(tools){

    var doorBindObj = {
        material: '='
    };
    
    return {
        restrict: 'E',
        scope: true,
        controllerAs: 'door',
        controller: doorCtrl,
        templateUrl: 'door.html',
        bindToController: doorBindObj
    }
    
    /**
     * the controller for a door
     */
    function doorCtrl() {
        this.state = {locked: true};
        this.unlock = tools.unlock;
        this.lock = tools.lock;
    }
}