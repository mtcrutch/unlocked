// app.js
// live example http://plnkr.co/edit/s24ffSjg7NnLVZXC9xos?p=preview 
var app = angular.module('app', [
    'app.services', 
    'app.directives'
]);

app.controller('appCtrl', appCtrl);

/**
 * The controller for the entire app. This is specific to a room, but could be
 * extended to contain logic for the entire house, neighborhood, city, state
 * and so on. It starts at the smallest piece and grows outward
 **/
function appCtrl() {
    this.doors = [
        {material: 'wood'},
        {material: 'glass'},
        {material: 'metal'}
    ];
}