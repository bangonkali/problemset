## Additional Developer Notes

### Usage

* Upon download, do a `npm install`.
* Run `npm test` to run the tests.

### Repl tests

```
  node
  > .load ./repl/doasync.js
  # <ctrl+c+c> when done
```

```
  node
  > .load ./repl/randstream.js
  # <ctrl+c+c> when done
```

```
  node
  > .load ./repl/resourcemanager.js
  # <ctrl+c+c> when done
```

### Notes

* Solutions are written in _Typescript_ and are saved in `src/solutions/*.ts`.
* The tests are written in _ES6_ and are saved in `src/test/*.js`.
* Solution implementations are exported by `src/index.ts` and are built to `built/index.js`.
* In order to compile just do a `npm start`. It will try to compile, run tests, and run anything that's stored at `built/index.js`.
* The build output dir is at `built`.
* The main index.js can be used after building, which is `built/index.js`.
* Most of the _async_ functionality are implemented with the use of `Promises`.
* The use of a _generator_ is implemented in one test case `src/test/rand-string-source.js`.
* Most of the implementation is done throught the uses of _Typescript classes_.
* Developer is more familiar with _C#_ but only moderately adept at writing _iterator_/_iterable_ classes.

## Original notes

The use of [**ES6**](https://nodejs.org/en/docs/es6/) features especially _Promises_, _Generators_ and _Classes_ are highly encouraged. Using a transpiler/compiler will be optional but [babeljs](https://babeljs.io/) is recommended.

The candidate should review his answers as this will assess the candidate's development style and adherence to best practices (readability, correctness and testability) in NodeJS.

Before starting the project, the candidate should fork this repository and apply his changes to that forked version accordingly (the link to this forked repository should be submitted). Commit messages should follow [angularjs's commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).

Any third party `npm` modules may be used as long it is added as `dependency` in the `package.json` file.

Solutions to the programming challenges should be put on `index.js`.


## Environment
* NodeJS `v5.7.1` or later

## Library (lib.js)

* `asyncOp` - Mocks an asynchronous IO operation. Accepts a value `input` which is printed before and after the asynchronous operation.
* `RandStream` - Extends `stream.Readable`. Generates a stream of random characters from the following character set:
```
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.
```

### 1. Asynchronous Operations

Create a function `doAsync` which accepts an array `arr` as input. Each element in the array can be either of type `String` or `[String]`.

#### Example Input
```js
[
  'A',
  [ 'B', 'C', 'D', 'E' ],
  'F',
  'G',
  [ 'H', 'I' ]
]
```

`doAsync` should apply `asyncOp` for all elements in `arr`. Each application of `asyncOp` should be either executed in series or parallel with each other depending on how they are arranged. If the elements are bundled together in an array, then `asyncOp` will be applied in parallel.

##### Example Usage
```js
let input = [
  'A',
  [ 'B', 'C' ],
  'D'
]

doAsync(input);
```

##### Example Output
```
START: A
FINISH: A
START: B
START: C
FINISH: C
FINISH: B
START: D
FINISH: D
```

### 2. Streams

Create a class `RandStringSource` which accepts an instance of the class `RandStream` as input. `RandStringSource` should be a subclass of `events.EventEmitter`.

Given the stream of random characters generated by `RandStream`, `RandStringSource` should emit an event `data` whenever a string enclosed by `.` is  detected. The enclosed string should be used as payload in the `data` event.

##### Example Usage
```js
let source = new RandStringSource(new RandStream());

source.on('data', (data) => {
  console.log(data);
})
```

##### Example Output
```batch
CHUNK: gh82Ad.AJK092shLKmb
gh82Ad
CHUNK: lkg.6294fjsk.5..642ksLMMD0g
AJK092shLKmblkg
6294fjsk
5
CHUNK: kms.zenoan.
642ksLMMD0gkms
zenoan
```

### 3. Resource Pooling

Create a class `ResourceManager` which accepts an integer `count` as input. `ResourceManager` should manage a limited number of `resource` objects. The maximum number of `resource` objects that can be created is determined by `count`.

`ResourceManager` should implement a function `borrow` which accepts a callback as parameter. The `borrow` function should *reserve* a resource object and pass it to the caller through the callback. A `resource` object can never be acquired by other `borrowers` until the `release` function in the `resource` object is called.

##### Example Usage
```js
let pool = new ResourceManager(2);
console.log('START');

let timestamp = Date.now();

pool.borrow((res) => {
  console.log('RES: 1');

  setTimeout(() => {
    res.release();
  }, 500);
});

pool.borrow((res) => {
  console.log('RES: 2');
});

pool.borrow((res) => {
  console.log('RES: 3');
  console.log('DURATION: ' + (Date.now() - timestamp));
});
```

##### Example Output
```batch
START
RES: 1
RES: 2
RES: 3
DURATION: 514
```
