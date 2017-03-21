import { asyncOp } from './lib/lib';

/**
 * Interface for asyncOp so that tests can be implemented using
 * rigged implementation of asyncOp.
 */
interface IAsyncOp {
    (input: any, callback : any): Promise<any>;
};

/**
 * A simple Async Class with DoAsync and QueueNode implementation.
 * The underlying asyncOp operator can be replaced by instantiating
 * with another IAsyncOp interface compatible asyncOp operation.
 */
class Async {

    /**
     * The internal definition of IAsyncOp. Assumes the default 
     * dependency if nothing is defined in the constructor.
     */
    private iAsyncOp : IAsyncOp;

    /**
     * Allows for replacement of IAsyncOp for testing purposes.
     * @param iAsyncOp optional paramter. Can be replaced with own
     * implementation of IAsyncOp for testing purposes.
     */
    constructor (iAsyncOp : IAsyncOp = null) {
        // Use the asyncOp library when none is instantiated.
        if (iAsyncOp == null)
            this.iAsyncOp = asyncOp; 
        else
            this.iAsyncOp = iAsyncOp;
    }

    /**
     * Resolves sub-arrays in parallel and for each array item 
     * in series.
     * @param data The hierarchical array of data.
     */
    private QueueNode(data : any) : Promise<any> 
    {
        if (Array.isArray(data) && data.length > 0) 
        {
            var promises : any = [];
            data.forEach(e => {
                let promise = new Promise<any>((resolve, reject) => {
                    this.iAsyncOp(e, resolve);
                });
                promises.push(promise);
            });
            return Promise.all(promises);
        } else {
            return new Promise((resolve, reject) => {
                this.iAsyncOp(data, () => {
                        resolve();
                });
            });
        }
    }

    /**
     * Accepts the input before sending to QueueNode. Checks if 
     * input is an array or just a single data which can be resolved
     * immediately.
     */
    public DoAsync(data : any) {
        if (Array.isArray(data) && data.length > 0) 
        {
            let node = data.shift();
            this.QueueNode(node).then(() => {
                this.DoAsync(data);
            });
        } else if (data != null && data != "") {
            this.QueueNode(data).then();
        }
    }
}

/**
 * Solution for doAsync Problem.
 * @param data The hierarchical array of data.
 */
export function doAsync(data : any) {
    let manager = new Async();
    manager.DoAsync(data);
}

/**
 * Solution for doAsync Problem but with the ability to change the underlying
 * asyncOp operation. This is so that tests can be implemented on this library
 * using a rigged version of asyncOp that will help provide more consistent 
 * predictable results.
 * @param data The hierarchical array of data.
 * @param iAsyncOp must be compatible with IAsyncOp interface.
 */
export function doAsyncWithInterface(data : any, iAsyncOp : IAsyncOp) {
    let manager = new Async(iAsyncOp);
    manager.DoAsync(data);
}