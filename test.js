const kpow = require('kpow')
const test = require('tape')
const deltaForce = require('./')

kpow()

test('will return', (t) => {
  t.equal(typeof deltaForce, 'function', 'returns lamda on init')
  t.end()
})

test('will report', (t) => {
  const data = deltaForce()

  t.equal(data.code, -1, 'nothing')
  t.end()
})
