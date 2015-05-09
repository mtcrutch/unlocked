import {Component, View} from 'angular2/angular2';

/**
 * the directive that creats a room, which contains different types of 
 * objects. ie(doors, windows, rooms)
 * 
 */
@Component({
  selector: '[door]',
  injectables: []
})
@View({
  templateUrl: 'door.html',
  directives: []
})
export class Door {
  constructor() {
    this.state = {locked: false};
  }
  
  /**
  * unlock the door
  **/
  unlock() {
      this.state.locked = false;
  }
  
  /**
  * lock the door
  **/
  lock() {
      this.state.locked = true;
  }
} 