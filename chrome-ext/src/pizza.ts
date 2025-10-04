export function setupPizza(element: HTMLButtonElement) {
  if (!element) return

  let slices = 1
  const setLabel = (n: number) => {
    element.innerHTML = `🍕 ${n} slice${n === 1 ? '' : 's'}`
  }

  element.addEventListener('click', () => {
    slices += 1
    setLabel(slices)
    // tiny confetti-like effect: toggle a class to animate
    element.classList.add('pop')
    setTimeout(() => element.classList.remove('pop'), 250)
  })

  setLabel(slices)
}
