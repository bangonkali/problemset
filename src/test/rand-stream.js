import { RandStream } from '../lib/lib'
import * as assert from 'assert';

describe('Sample RandStream test', function () {
    it('should pass if stream is readable', function (done) {

        var stream = new RandStream();
        assert(stream.readable);

        setTimeout(() => {
            stream = null;
            done();
        }, 200);
    });
});