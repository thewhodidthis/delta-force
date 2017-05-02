(function () {
'use strict';

// Helps report differences
var bipolar = function bipolar() {
  for (var _len = arguments.length, prev = Array(_len), _key = 0; _key < _len; _key++) {
    prev[_key] = arguments[_key];
  }

  // Reset
  var memo = prev;

  return function () {
    for (var _len2 = arguments.length, next = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      next[_key2] = arguments[_key2];
    }

    // Calculate deltas
    var diff = memo.map(function (v, i) {
      return next[i] - v;
    });

    // Save for later
    memo = next;

    // Array of deltas
    return diff;
  };
};

var deltaForce = function () {
  var on = document.addEventListener;
  var off = document.removeEventListener;

  // -1: idle, 0: left, 1: middle, 2: right
  var state = -1;
  var delta = [0, 0, 0];
  var force = bipolar();

  var onMouseMove = function onMouseMove(e) {
    delta = force(e.clientX, e.clientY, 0);
  };

  var onMouseUp = function onMouseUp() {
    state = -1;

    off('mouseup', onMouseUp);
    off('mousemove', onMouseMove);
  };

  on('mousedown', function (e) {
    state = e.button;
    force = bipolar(e.clientX, e.clientY, 0);

    on('mouseup', onMouseUp);
    on('mousemove', onMouseMove);
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

var info = document.createElement('pre');
var cube = document.querySelector('.cube');
var move = { x: 0, y: 0 };
var spin = Object.assign({}, move);

var zoom = 1;

var repeat = function repeat() {
  var data = deltaForce();

  switch (data.state) {
    case 0:
      spin.x += data.x;
      spin.y += data.y;

      break;
    case 1:
      zoom += data.z * 0.01;

      break;
    case 2:
      move.x += data.x;
      move.y += data.y;

      break;
  }

  if (data.state >= 0) {
    info.innerHTML = '\n      x: ' + data.x + ',\n      y: ' + data.y + ',\n      z: ' + data.z.toFixed(2) + ',\n      code: ' + data.state + '\n    ';
  }

  cube.style.transform = '\n    translate(' + move.x + 'px, ' + move.y + 'px)\n    rotateX(' + spin.y + 'deg)\n    rotateY(' + spin.x + 'deg)\n    scale(' + zoom + ')\n  ';

  window.requestAnimationFrame(repeat);
};

document.body.insertBefore(info, cube);
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

window.requestAnimationFrame(repeat);

}());
