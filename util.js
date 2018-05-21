// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
export const passiveListenerSupported = () => {
  let flag = false

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        flag = true
      }
    })

    window.addEventListener('test', options, options)
    window.removeEventListener('test', options, options)
  } catch (x) {}

  return flag
}
