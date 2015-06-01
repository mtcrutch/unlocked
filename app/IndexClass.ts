export class IndexController {

    hello: string;

    constructor() {
        this.hello = 'world';
    }

    sayHello(id) {
        alert(id);
    }
}

angular.module('unlockedApp')
    .controller('IndexCtrl', IndexController);
