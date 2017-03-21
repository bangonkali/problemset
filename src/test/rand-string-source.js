import { RandStringSource } from '../solutions/RandStringSource';
import { RandStream } from '../lib/lib';
import * as assert from 'assert';
import * as stream from 'stream';

describe('RandStringSource tests', () => {

    /** DefiniteStream creates a readable stream that is pre arranged. 
     * This is only used for testing other StreamReaders.
     */
    class DefiniteStream extends stream.Readable {

        /**
         * Constructor for DefiniteStream. Needs an array of string.
         * @param {*} series List of strings.
         */
        constructor (series) {
            super ({
                encoding: 'utf8',
                objectMode: false
            });

            this.current = 0;
            this.series = series;
            // console.log(series);

            this.generatorSequence = this.sequence();
            this.generate();
        }
        
        /** The current index for the iterable. */
        current = 0;

        /** Series data defined at constructor. */
        series = null;

        /** The class wide Generator Sequence Instance. */
        generatorSequence = null;

        /** A simple generators iterable implementation. */
        *sequence() {
            while (true) {
                // console.log(`SEQ: ${this.current}/${this.series.length} ${this.series[this.current]}`);
                yield this.series[this.current];
                this.current++;
            }
        }

        _read () {}

        /** Patterned after source. But this one uses generatorSequence. */
        generate () {
            let chunk = this.generatorSequence.next().value;
            if (chunk != null) {
                // console.log(`CHUNK: ${chunk}`);
                this.push(chunk, 'utf8');        
                setTimeout(() => {
                    this.generate();
                }, 100);
            } else {
                // console.log('REC NULL');
            }
        }
    }

    it('base test.', function (done) {
        let actuals = [];
        let expected = [
            "gh82Ad",
            "AJK092shLKmblkg",
            "6294fjsk",
            "5",
            "642ksLMMD0gkms",
            "zenoan",
        ];

        /** Tests the RandStringSource using a modified Stream that has definite data. */
        let source = new RandStringSource(new DefiniteStream([
            'gh82Ad.AJK092shLKmb',
            'lkg.6294fjsk.5..642ksLMMD0g',
            'kms.zenoan.',
        ]));

        /** Pushes the actual responses to an array for checking. */
        source.on('data', (data) => {
            // console.log(data);
            actuals.push(data);
        });

        /** Terminates the test at the right time. */
        setTimeout(() => {
            assert.equal(actuals.length, expected.length);
            for (let i = 0; i < actuals.length; i++){
                assert.equal(actuals[i], expected[i]);
            }
            done();
        }, 500);
    });


    it('expanded test.', function (done) {
        let actuals = [];
        let expected = [
            // "CHUNK: aaaaa.aaaaaa.aaa",
            "aaaaa",
            "aaaaaa",
            // "CHUNK: ....",
            "aaa",
            // "CHUNK: a.a.a.a",
            "a",
            "a",
            "a",
            // "CHUNK: a.a.a.a",
            "aa",
            "a",
            "a"
        ];

        /** Tests the RandStringSource using a modified Stream that has definite data. */
        let source = new RandStringSource(new DefiniteStream([
            'aaaaa.aaaaaa.aaa',
            '....',
            'a.a.a.a',
            'a.a.a.a',
        ]));

        /** Pushes the actual responses to an array for checking. */
        source.on('data', (data) => {
            // console.log(data);
            actuals.push(data);
        });

        /** Terminates the test at the right time. */
        setTimeout(() => {
            assert.equal(actuals.length, expected.length);
            for (let i = 0; i < actuals.length; i++){
                assert.equal(actuals[i], expected[i]);
            }
            done();
        }, 500);
    });
});