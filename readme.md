## about

Simplifies mouse tracking keeping in mind that `PointerEvent.movementX/Y` might be the more obvious way to go in the near future.

## setup

Fetch the [latest version](https://npm.im/delta-force) from the _npm_ registry:

```sh
# Includes ES and CJS modules
npm install thewhodidthis/delta-force
```

## usage

Initialize with a DOM selector, then call repeatedly for delta values in the form of `{ x, y, z, state }` as for example,

```js
import tracker from 'delta-force'

const update = tracker(/* Some element, document by default */)

setInterval(() => {
  console.table(update())
}, 1000)
```
