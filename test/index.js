const test = require('tape');
const DeltaForce = require('../');

// Add favicon
const linkTag = document.createElement('link');

linkTag.href = 'data:;base64,iVBORw0KGgo=';
linkTag.rel = 'icon';

document.head.appendChild(linkTag);

test('will return', (t) => {
  const deltaForce = DeltaForce();

  t.equal(typeof deltaForce, 'function', 'returns lamda on init');
  t.end();
});

