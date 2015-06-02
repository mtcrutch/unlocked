export function main() {
    describe('Index Ctrl', function() {
        var $controller,
            scope;

        beforeEach(module('unlockedApp'));

        beforeEach(inject(function($injector) {
            scope = {};
            $controller = $injector.get('$controller')('IndexCtrl', { $scope: scope });
        }));

        it('should create a new app object', () => {
            expect(Object.keys(scope).length).not.to.Equal(0);
        });

        it('should contian a hello variable', () => {
            expect(scope.hello).to.Equal('world');
        });
    });
}

