import 'cutaway'
import { report, assert } from 'tapeless'
import deltaForce from './index.mjs'

const { equal, ok, notOk } = assert

const tracker = deltaForce()

equal
  .describe('returns lamda on init', 'will return')
  .test(typeof tracker, 'function')

const { state, x, y, z } = tracker()

equal
  .test(state, -1)

notOk
  .describe('nada')
  .test(x)

ok
  .test(x === y)
  .describe(null, 'will report')
  .test(y === z)

report()
