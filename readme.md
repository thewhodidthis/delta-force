> At least until pointer events come about

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/delta-force
```

### Usage
```js
import tracker from 'delta-force'

setInterval(() => {
  console.table(tracker())
}, 1000)
```
