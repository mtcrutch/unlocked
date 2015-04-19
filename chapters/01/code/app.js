var app = angular.module('app', ['app.services', 
                                 'app.directives']);

app.controller('appCtrl', appCtrl);

/**
 * the controller for the entire app. This is specific to a room, but could 
 * extended to contian logic for the entire house, neighborhood, city, state
 * and so on. It starts at the smallest piece and grows outward'
 **/
function appCtrl() {
    this.doors = [{material: 'wood'},
                  {material: 'glass'},
                  {material: 'metal'}];
}