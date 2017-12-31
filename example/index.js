(function () {
'use strict';

var tracker = function (agent) {
  if ( agent === void 0 ) agent = document;

  // For resetting coords
  var point = [0, 0, 0];

  // Holds actual position, gets updated on pointer move
  var store = point;

  // Holds resulting displacement values
  var score = point;

  // Button pressed: -1/idle, 0/left, 1/middle, 2/right
  var state = -1;

  // Alias `addEventListener`, allows for additional listeners outside of
  // current scope (as opposed to binding handlers inline)
  var track = agent.addEventListener;

  // Extract location data, whether touch or mouse based
  var parse = function (ref) {
    var touches = ref.touches;
    var clientX = ref.clientX;
    var clientY = ref.clientY;

    if (touches) {
      var x = touches[0].pageX;
      var y = touches[0].pageY;

      // No mouse wheel on touch screens, therefore alias pinch to zoom,
      // evaluating distance squared between the two fingers
      var dsq = 0;

      if (state === 1) {
        var dx = x - touches[1].pageX;
        var dy = y - touches[1].pageY;

        dsq = (dx * dx) + (dy * dy);
      }

      return [x, y, dsq]
    }

    return [clientX, clientY, 0]
  };

  // Calculate differences, save current position for later
  var delta = function (e) {
    var input = parse(e);

    score = store.map(function (v, i) { return input[i] - v; });
    store = input;
  };

  // Pointer up
  var reset = function () {
    state = -1;

    agent.removeEventListener('mousemove', delta);
  };

  // Pointer down
  var start = function (e) {
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
  track('wheel', function (e) {
    state = 1;
    score = [0, 0, e.deltaY];
  });

  // To be called periodically
  return function () {
    var x = score[0];
    var y = score[1];
    var z = score[2];

    score = point;

    return { x: x, y: y, z: z, state: state }
  }
};

var info = document.createElement('pre');
var cube = document.querySelector('.cube');

var move = { x: 0, y: 0 };
var spin = { x: 0, y: 0 };

var zoom = 1;

var update = tracker();
var render = function () {
  var data = update();

  switch (data.state) {
  case 0:
    spin.x += data.x;
    spin.y += data.y;

    break
  case 1:
    zoom += data.z * 0.00005;

    break
  case 2:
    move.x += data.x;
    move.y += data.y;

    break
  default:
    break
  }

  if (data.state >= 0) {
    info.innerHTML = "\n      x: " + (data.x) + ",\n      y: " + (data.y) + ",\n      z: " + (data.z.toFixed(2)) + ",\n      state: " + (data.state) + "\n    ";
  }

  cube.style.transform = "\n    translate(" + (move.x) + "px, " + (move.y) + "px)\n    rotateX(" + (spin.y) + "deg)\n    rotateY(" + (spin.x) + "deg)\n    scale(" + zoom + ")\n  ";

  window.requestAnimationFrame(render);
};

document.body.insertBefore(info, cube);
document.addEventListener('touchstart', function (e) {
  e.preventDefault();
});
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

window.requestAnimationFrame(render);

}());

