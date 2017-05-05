var deltaForce = (function () {
'use strict';

var v3 = [0, 0, 0];
var bipolar = function bipolar(x, y, z) {
  var memo = [x, y, z];

  return function (x, y, z) {
    var next = [x, y, z];
    var diff = memo.map(function (v, i) {
      return next[i] - v;
    });

    memo = next;

    return diff;
  };
};

// -1: idle, 0: left, 1: middle, 2: right
var state = -1;
var delta = v3;
var force = v3;

var on = document.addEventListener;
var off = document.removeEventListener;

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

  var dsq = 0;

  if (state === 1) {
    var dx = x - e.touches[1].pageX;
    var dy = y - e.touches[1].pageY;

    dsq = dx * dx + dy * dy;
  }

  return fn(x, y, dsq);
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

var deltaForce = function deltaForce() {
  var x = delta[0];
  var y = delta[1];
  var z = delta[2];

  delta = v3;

  return { x: x, y: y, z: z, code: state };
};

return deltaForce;

}());
//# sourceMappingURL=delta-force.js.map
