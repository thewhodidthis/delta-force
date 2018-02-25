import 'cutaway'
import { report, assert } from 'tapeless'
import deltaForce from './index.mjs'

const { equal, ok, notOk } = assert

const tracker = deltaForce()

equal(typeof tracker, 'function', 'returns lamda on init', 'will return')

const { state, x, y, z } = tracker()

equal(state, -1, 'nada', 'will report')
notOk(x)

ok(x === y)
ok(y === z)

report()
