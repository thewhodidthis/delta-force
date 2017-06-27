const v3 = [0, 0, 0];
const bipolar = (a, b, c) => {
  let memo = [a, b, c];

  return (x, y, z) => {
    const next = [x, y, z];
    const diff = memo.map((v, i) => next[i] - v);

    memo = next;

    return diff;
  };
};

// -1: idle, 0: left, 1: middle, 2: right
let state = -1;
let delta = v3;
let force = v3;

const off = document.removeEventListener;

const mouseMove = (e) => {
  delta = force(e.clientX, e.clientY, 0);
};

const mouseUp = () => {
  state = -1;

  off('mouseup', mouseUp);
  off('mousemove', mouseMove);
};

const on = document.addEventListener;

on('mousedown', (e) => {
  state = e.button;
  force = bipolar(e.clientX, e.clientY, 0);

  on('mouseup', mouseUp);
  on('mousemove', mouseMove);
});

const handleTouch = (e, fn) => {
  const x = e.touches[0].pageX;
  const y = e.touches[0].pageY;

  let dsq = 0;

  if (state === 1) {
    const dx = x - e.touches[1].pageX;
    const dy = y - e.touches[1].pageY;

    dsq = (dx * dx) + (dy * dy);
  }

  return fn(x, y, dsq);
};

on('touchstart', (e) => {
  state = e.touches.length - 1;
  force = handleTouch(e, bipolar);
});

on('touchmove', (e) => {
  // Can't rely on viewport meta tag no more
  // https://twitter.com/thomasfuchs/status/742531231007559680
  e.preventDefault();

  delta = handleTouch(e, force);
});

on('touchend', () => {
  state = -1;
});

on('wheel', (e) => {
  state = 1;
  delta = [0, 0, e.deltaY];
}, { passive: true });

const deltaForce = () => {
  const x = delta[0];
  const y = delta[1];
  const z = delta[2];

  delta = v3;

  return { x, y, z, code: state };
};

export default deltaForce;

