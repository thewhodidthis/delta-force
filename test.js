import 'cutaway'
import { report, assert } from 'tapeless'

import deltaForce from './index.es'

const { equal } = assert

equal(typeof deltaForce, 'function', 'returns lamda on init', 'will return')

const data = deltaForce()

equal(data.code, -1, 'nada', 'will report')

report()
