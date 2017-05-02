'use strict';

var bipolar = require('bipolar');

var deltaForce = function () {
  var on = document.addEventListener;
  var off = document.removeEventListener;

  // -1: idle, 0: left, 1: middle, 2: right
  var state = -1;
  var delta = [0, 0, 0];
  var force = bipolar();

  var mouseMove = function mouseMove(e) {
    delta = force(e.clientX, e.clientY, 0);
  };

  var mouseUp = function mouseUp() {
    state = -1;

    off('mouseup', mouseUp);
    off('mousemove', mouseMove);
  };

  on('mousedown', function (e) {
    state = e.button;
    force = bipolar(e.clientX, e.clientY, 0);

    on('mouseup', mouseUp);
    on('mousemove', mouseMove);
  });

  var handleTouch = function handleTouch(e, fn) {
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;

    var distance = 0;

    if (state === 1) {
      var dx = x - e.touches[1].pageX;
      var dy = y - e.touches[1].pageY;

      distance = Math.sqrt(dx * dx + dy * dy);
    }

    return fn(x, y, distance);
  };

  on('touchstart', function (e) {
    state = e.touches.length - 1;
    force = handleTouch(e, bipolar);
  });

  on('touchmove', function (e) {
    // Can't rely on viewport meta tag no more
    // https://twitter.com/thomasfuchs/status/742531231007559680
    e.preventDefault();

    delta = handleTouch(e, force);
  });

  on('touchend', function () {
    state = -1;
  });

  on('wheel', function (e) {
    e.preventDefault();
    e.stopPropagation();

    state = 1;
    delta = [0, 0, e.deltaY];
  });

  return function () {
    var x = delta[0];
    var y = delta[1];
    var z = delta[2];

    // Reset
    delta = [0, 0, 0];

    return { x: x, y: y, z: z, state: state };
  };
}();

module.exports = deltaForce;
