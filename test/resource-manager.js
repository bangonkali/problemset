var ResourceManager = require('../built').ResourceManager,
    assert = require('assert');

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
});