module unlockedApp {

    'use strict';

    class IndexController {

        hello: string;

        constructor() {
            this.hello = 'world';
        }

        sayHello(id) {
            alert(id);
        }
    }

    angular.module('unlockedApp.controller', [])
        .controller('IndexCtrl', IndexController);
}
