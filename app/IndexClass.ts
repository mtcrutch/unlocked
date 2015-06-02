export class IndexController {

    hello: string;

    constructor() {
        console.log('hahaha hahahhahahh')
        this.hello = 'world';
    }

    sayHello(id) {
        alert(id);
    }
}

angular.module('unlockedApp')
    .controller('IndexCtrl', IndexController);
