import tracker from '../index.mjs'

const info = document.createElement('pre')
const cube = document.querySelector('.cube')

const move = { x: 0, y: 0 }
const spin = { x: 0, y: 0 }

let zoom = 1

const update = tracker()
const render = () => {
  const data = update()

  switch (data.state) {
  case 0:
    spin.x += data.x
    spin.y += data.y

    break
  case 1:
    zoom += data.z * 0.00005

    break
  case 2:
    move.x += data.x
    move.y += data.y

    break
  default:
    break
  }

  if (data.state >= 0) {
    info.innerHTML = `
      x: ${data.x},
      y: ${data.y},
      z: ${data.z.toFixed(2)},
      state: ${data.state}
    `
  }

  cube.style.transform = `
    translate(${move.x}px, ${move.y}px)
    rotateX(${spin.y}deg)
    rotateY(${spin.x}deg)
    scale(${zoom})
  `

  window.requestAnimationFrame(render)
}

document.body.insertBefore(info, cube)
document.addEventListener('touchstart', (e) => {
  e.preventDefault()
})
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

window.requestAnimationFrame(render)
