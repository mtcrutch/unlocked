import {Component, View, Parent, Ancestor} from 'angular2/angular2';
import {For} from 'angular2/directives'
import {Door} from 'door'

/**
 * the directive that creats a room, which contains different types of 
 * objects. ie(doors, windows, rooms)
 * 
 */
@Component({
  selector: '[room]',
  properties: {
    doors: 'doors'
  }
})
@View({
  templateUrl: 'room.html',
  directives: [Door, For]
})
export class Room {
  constructor() {
    console.log(this.doors)
  }
} 

