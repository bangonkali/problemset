import * as Events from 'events';
import * as Stream from 'stream';

export class RandStringSource extends Events.EventEmitter {

    private stream : Stream.Readable;
    private cache : string = "";

    public constructor (stream : Stream.Readable) {
        super();
        this.stream = stream;
        this.filter();
    }

    private filter() {
        this.stream.on('data', (chunk : string) => {
            for (var g : number = 0; g < chunk.length; g++) {
                if (chunk[g] != '.')
                {
                    this.cache = this.cache.concat(chunk[g]);
                } else {
                    if (this.cache.length > 0)
                    {
                        this.emit('data', this.cache);
                    }
                    this.cache = "";
                }
            }
        });
    }
}