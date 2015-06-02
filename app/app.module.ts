/// <reference path="../typings/angularjs/angular.d.ts" />
//

((): void => {
    angular.module('unlockedApp', []);

    System.import('js/IndexClass').then(
        function() {
            console.log('hahaha hahahah')
            angular.bootstrap(document, ['unlockedApp']);
        },
        function(a, b, c) {
            console.log('\na:', a, '\nb:', b, '\nc:', c);
        }
    );
})();
