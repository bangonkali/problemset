export class ResourceManager {
    public index : number = 0;
    public max : number = 0;
    public current : number = 0;
    public resources : Resource[] = [];

    public constructor(max : number) {
        this.max = max;
        this.current = 0;
    }

    public resolve() : void {
        this.current--;
        this.accumulate();
    }

    public accumulate() {
        if (this.resources.length > 0) {
            if (this.max > this.current)
            {
                this.current++;
                let next = this.resources.shift();
                next.exec();
            }
        }
    }

    public borrow(callback: ResourceCallback) : void {
        let res = new Resource(this, callback);
        this.resources.push(res);
        this.index++;
        this.accumulate();
    }
}

export type ResourceCallback = (res: Resource) => void;

export class Resource {

    private manager : ResourceManager;
    private promise : Promise<any>;
    private callback : ResourceCallback;
    private resolve : any;

    public constructor(manager : ResourceManager, callback : ResourceCallback) {
        this.manager = manager;
        this.callback = callback;
    }

    public exec() : void {
        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
            this.callback(this);
        });
        this.promise.then();
    }

    public release() : void {
        this.resolve();
        this.manager.resolve();
    }
}
