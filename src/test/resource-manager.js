import { ResourceManager } from '../solutions/ResourceManager'
import * as assert from 'assert';

describe('Expanded cycle test for Resource Manager', function () {
    it('correct sequence of events in default test.', (done2) => {
        let actual2 = [];
        setTimeout(() => {
            //console.log(actual2);
            assert.equal(actual2[0], "1");
            assert.equal(actual2[1], "2");
            assert.equal(actual2[2], "3");
            assert.equal(actual2[3] >= 500 && actual2[3] <= 600, true);
            done2();
        }, 650);

        let timestamp2 = Date.now();
        let pool2 = new ResourceManager(2);

        pool2.borrow((res2) => {
            actual2.push('1');

            setTimeout(() => {
                res2.release();
            }, 500);
        });

        pool2.borrow((res2) => {
            actual2.push('2');
        });

        pool2.borrow((res2) => {
            actual2.push('3');
            actual2.push(Date.now() - timestamp2);
        });
    });

    it('correct sequence of events in expanded test.', (done) => {
         let correct = [
            [ 1, 'SRT', 0  , 100],
            [ 2, 'SRT', 0  , 100],
            [ 1, 'FIN', 100, 200],
            [ 3, 'SRT', 100, 200],
            [ 3, 'FIN', 200, 300],
            [ 4, 'SRT', 200, 300],
            [ 4, 'FIN', 300, 400],
            [ 5, 'SRT', 300, 400],
            [ 5, 'FIN', 400, 500],
            [ 6, 'SRT', 400, 500],
            [ 6, 'FIN', 500, 600],
        ];
        let actual = [];

        /**
         * Final Checks. This will happen 650ms after initial run. This will check if the actual data (in actual array)
         * are the same as in correct array. The correct array's last 2 columns are the error tolerance. The 3rd column
         * on actual array is the actual time when the output was written to the array. The actual array's 3rd column
         * must be within the range of correct array's 2 last columns.
         */
        setTimeout(() => {
            // console.log(actual);
            // console.log(correct);
            for (var i = 0; i < correct.length; i++ ){
                assert.equal(correct[i][0], actual[i][0]);
                assert.equal(correct[i][1], actual[i][1]);
                assert.equal(correct[i][2] <= actual[i][2] && correct[i][3] >= actual[i][2], true);
            }
            done();
        }, 650);

        let timestamp = Date.now();
        let pool = new ResourceManager(2);

        pool.borrow((res) => {
            actual.push([1, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([1, 'FIN', (Date.now() - timestamp)]);
                res.release();
            }, 100);
        });

        pool.borrow((res) => {
            actual.push([2, 'SRT', (Date.now() - timestamp)]);
        });

        pool.borrow((res) => {
            actual.push([3, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([3, 'FIN', (Date.now() - timestamp)]);
                res.release();
            }, 100);
        });

        pool.borrow((res) => {
            actual.push([4, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([4, 'FIN', (Date.now() - timestamp)]);
                res.release();
            }, 100);
        });

        pool.borrow((res) => {
            actual.push([5, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([5, 'FIN', (Date.now() - timestamp)]);
                res.release();
            }, 100);
        });

        pool.borrow((res) => {
            actual.push([6, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([6, 'FIN', (Date.now() - timestamp)]);
            }, 100);
        });

        pool.borrow((res) => {
            actual.push([7, 'SRT', (Date.now() - timestamp)]);
            setTimeout(() => {
                actual.push([7, 'FIN', (Date.now() - timestamp)]);
                res.release();
            }, 100);
        });
    });
});