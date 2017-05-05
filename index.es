import bipolar from 'bipolar';

const deltaForce = (() => {
  // -1: idle, 0: left, 1: middle, 2: right
  let state = -1;
  let delta = [0, 0, 0];
  let force = bipolar();

  const on = document.addEventListener;
  const off = document.removeEventListener;

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

  const mouseMove = (e) => {
    delta = force(e.clientX, e.clientY, 0);
  };

  const mouseUp = () => {
    state = -1;

    off('mouseup', mouseUp);
    off('mousemove', mouseMove);
  };

  on('mousedown', (e) => {
    state = e.button;
    force = bipolar(e.clientX, e.clientY, 0);

    on('mouseup', mouseUp);
    on('mousemove', mouseMove);
  });

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
    e.preventDefault();
    e.stopPropagation();

    state = 1;
    delta = [0, 0, e.deltaY];
  });

  return () => {
    const x = delta[0];
    const y = delta[1];
    const z = delta[2];

    // Reset
    delta = [0, 0, 0];

    return { x, y, z, state };
  };
})();

export default deltaForce;
