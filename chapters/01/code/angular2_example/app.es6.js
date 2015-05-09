import {Component, View, bootstrap} from 'angular2/angular2';
import {Room} from 'room';

/**
 * the controller for the entire app. This is specific to a room, but could 
 * extended to contian logic for the entire house, neighborhood, city, state
 * and so on. It starts at the smallest piece and grows outward'
 **/
@Component({
  selector: 'my-app'
})
@View({
  templateUrl: 'app.html',
  directives: [Room]
})
class App {
    constructor() {
        this.doors = [{material: 'wood'},
            {material: 'glass'},
            {material: 'metal'}];
    } 
}

bootstrap(App);