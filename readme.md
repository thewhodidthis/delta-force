> For now and keeping in mind that `PointerEvent.movementX/Y` might be the more obvious way to go in the near future.

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/delta-force
```

### Usage
```js
import tracker from 'delta-force'

const update = tracker(/* some element, document by default */)

setInterval(() => {
    console.table(update())
}, 1000)
```
