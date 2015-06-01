export class Test {
    import {IndexClass} from 'dist/js/IndexClass';

    describe('Index Class', function () {

        let app;

        beforeEach(()=>{
            app = new IndexClass();
        });

        it('should create a new app object', ()=>{
            expect(app).not.to.Equal(undefined);
        });

        it('should contian a hello variable', ()=>{
            expect(app.hello).to.Equal('world');
        });

    });
}
