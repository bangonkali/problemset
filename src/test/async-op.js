import * as problemset from '../Async'
import * as assert from 'assert';

describe('Cycle test for AsyncOp', function() {
    
    it('default base test. included in sample.', function(done) {
        let actual = [];
        let expected = [ 
            "START: A",
            "FINISH: A",
            "START: B",
            "START: C",
            "FINISH: B",
            "FINISH: C",
            "START: D",
            "FINISH: D"
        ];

        let asyncOp = (input, callback) => {
            actual.push(`START: ${input}`);

            let prom = new Promise(function(resolve) {
                setTimeout(() => {
                    actual.push(`FINISH: ${input}`);
                resolve();
            }, 100);
            });

            if(!callback) {
                return prom;
            }

            prom.then(callback);
        };

        let data = [
            'A',
            [ 'B', 'C' ],
            'D'
        ];

        setTimeout(() => {
            for (var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], actual[i]);
            }
            done();
        }, 500);

        problemset.doAsyncWithInterface(data, asyncOp);
    });


});