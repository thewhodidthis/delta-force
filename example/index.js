import deltaForce from '../index.es';

const info = document.createElement('pre');
const cube = document.querySelector('.cube');
const move = { x: 0, y: 0 };
const spin = Object.assign({}, move);

let zoom = 1;

const repeat = () => {
  const data = deltaForce();

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
  };

  if (data.state >= 0) {
    info.innerHTML = `
      x: ${data.x},
      y: ${data.y},
      z: ${data.z.toFixed(2)},
      code: ${data.state}
    `;
  }

  cube.style.transform = `
    translate(${move.x}px, ${move.y}px)
    rotateX(${spin.y}deg)
    rotateY(${spin.x}deg)
    scale(${zoom})
  `;

  window.requestAnimationFrame(repeat);
};

document.body.insertBefore(info, cube);
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

window.requestAnimationFrame(repeat);

