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

    it('extended test, array begin and array end.', function(done) {
        /** Temporary storage for actual values. */
        let actual = [];

        /** Expected array output. */
        let expected = [ 'START: U',
            'START: V',
            'START: W',
            'FINISH: U',
            'FINISH: V',
            'FINISH: W',
            'START: A',
            'FINISH: A',
            'START: B',
            'START: C',
            'START: E',
            'START: F',
            'START: G',
            'START: H',
            'FINISH: B',
            'FINISH: C',
            'FINISH: E',
            'FINISH: F',
            'FINISH: G',
            'FINISH: H',
            'START: I',
            'START: J',
            'START: K',
            'FINISH: I',
            'FINISH: J',
            'FINISH: K',
            'START: L',
            'FINISH: L',
            'START: M',
            'FINISH: M',
            'START: N',
            'START: O',
            'START: P',
            'START: Q',
            'FINISH: N',
            'FINISH: O',
            'FINISH: P',
            'FINISH: Q',
            'START: D',
            'FINISH: D',
            'START: R',
            'START: S',
            'START: T',
            'FINISH: R',
            'FINISH: S',
            'FINISH: T' 
        ];

        /** Dummy asyncOp implementation that matches IAsyncOp interface.
         * @param {*} input the input array.
         * @param {*} callback callback for resolve.
         */
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

        /** Data for testing. */
        let data = [
            ['U', 'V', 'W'],
            'A',
            [ 'B', 'C', 'E', 'F', 'G', 'H' ],
            [ 'I', 'J', 'K'],
            'L',
            'M',
            [ 'N', 'O', 'P', 'Q'],
            'D',
            ['R', 'S', 'T']
        ];

        setTimeout(() => {
            for (var i = 0; i < expected.length; i++ ){
                assert.equal(expected[i], actual[i]);
            }
            done();
        }, 1100);

        problemset.doAsyncWithInterface(data, asyncOp);
    });

});