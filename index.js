'use strict';

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
const passiveListenerSupported = () => {
  let flag = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        flag = true;
      }
    });

    window.addEventListener('test', options, options);
    window.removeEventListener('test', options, options);
  } catch (x) {}

  return flag
};

const tracker = (agent = document) => {
  // For resetting coords
  const point = [0, 0, 0];

  // Holds actual position, gets updated on pointer move
  let store = point;

  // Holds resulting displacement values
  let score = point;

  // Button pressed: -1/idle, 0/left, 1/middle, 2/right
  let state = -1;

  // Alias `addEventListener`, allows for additional listeners outside of
  // current scope (as opposed to binding handlers inline)
  const track = agent.addEventListener;

  // Extract location data, whether touch or mouse based
  const parse = ({ touches, clientX, clientY }) => {
    if (touches) {
      const x = touches[0].pageX;
      const y = touches[0].pageY;

      // No mouse wheel on touch screens, therefore alias pinch to zoom,
      // evaluating distance squared between the two fingers
      let dsq = 0;

      if (state === 1) {
        const dx = x - touches[1].pageX;
        const dy = y - touches[1].pageY;

        dsq = (dx * dx) + (dy * dy);
      }

      return [x, y, dsq]
    }

    return [clientX, clientY, 0]
  };

  // Calculate differences, save current position for later
  const delta = (e) => {
    const input = parse(e);

    score = store.map((v, i) => input[i] - v);
    store = input;
  };

  // Pointer up
  const reset = () => {
    state = -1;

    agent.removeEventListener('mousemove', delta);
  };

  // Pointer down
  const start = (e) => {
    state = e.touches ? e.touches.length - 1 : e.button;
    store = parse(e);

    track('mousemove', delta);
    track('touchmove', delta);
  };

  // Attach event handlers
  track('touchstart', start);
  track('mousedown', start);
  track('touchend', reset);
  track('mouseup', reset);
  track('wheel', (e) => {
    state = 1;
    score = [0, 0, e.deltaY];
  }, passiveListenerSupported() ? { passive: true } : false);

  // To be called periodically
  return () => {
    const [x, y, z] = score;

    score = point;

    return { x, y, z, state }
  }
};

module.exports = tracker;
