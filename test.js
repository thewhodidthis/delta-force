import 'cutaway'
import { report, assert } from 'tapeless'
import deltaForce from './index.es'

const { equal, ok, notOk } = assert

equal(typeof deltaForce, 'function', 'returns lamda on init', 'will return')

const { code, x, y, z } = deltaForce()

equal(code, -1, 'nada', 'will report')
notOk(x)
ok(x === y)
ok(y === z)

report()
