export class ResourceManager {
    private _max : number = 0;
    private _resources : Resource[] = [];
    private _callbackQueue : ResourceCallback[] = [];

    public constructor(max : number) {
        this._max = max;
    }

    public accumulate() {
        if (this._callbackQueue.length > 0) {
            /** find a usable resource. Only returns first res not busy.*/
            var res = this._resources.find(res => res.Busy == false);

            /** 
             * create a new resource if none found. This modification makes
             * only _max number of resources but the _callbackQueue is still 
             * solved on after another make sure all queued ResourceCallback's 
             * are going to be resolved.
             */
            if (res == null && this._resources.length < this._max) {
                res = new Resource(this);
                this._resources.push(res);
            }

            /** Only unshift next operation if there is indeed an available res. */
            if (res != null) {
                let next = this._callbackQueue.shift();
                res.exec(next);
            }
        }
    }

    /** Borrow's a resource. Only issues resources that are not busy. */
    public borrow(callback: ResourceCallback) : void {
        this._callbackQueue.push(callback);
        this.accumulate();
    }
}

export type ResourceCallback = (res: Resource) => void;

export class Resource {

    private _manager : ResourceManager;
    private _promise : Promise<any>;
    private _callback : ResourceCallback;
    private _resolve : any;
    private _busy : boolean = false;

    /** Creates the resource and assigns ResourceManager. */
    public constructor(manager : ResourceManager) {
        this._manager = manager;
    }

    /** Sets the callback of the resource. */
    private set Callback(callback : ResourceCallback){
        this._callback = callback;
    }

    /** Gets the busy flag. True if the resource is busy. */
    public get Busy() : boolean {
        return this._busy;
    }

    /** Executes the call back within the resource. */
    public exec(callback : ResourceCallback) : void {
        this.Callback = callback;
        this._busy = true;
        this._promise = new Promise((resolve) => {
            this._resolve = resolve;
            this._callback(this);
        });
        this._promise.then();
    }

    /** Informs the ResourceManager that this resource is Done. */
    public release() : void {
        this._busy = false;
        this._resolve();
        this._manager.accumulate();
    }
}
