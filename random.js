export const majors = [
  'C',
  'F',
  'B&#9837;',
  'E&#9837;',
  'A&#9837;',
  'C&#9839;',
  'F&#9839;',
  'B',
  'E',
  'A',
  'D',
  'G',
]

export const minors = [
  '<b>A</b> min',
  '<b>D</b> min',
  '<b>G</b> min',
  '<b>C</b> min',
  '<b>F</b> min',
  '<b>B&#9837;</b> min',
  '<b>E&#9837;</b> min',
  '<b>A&#9837;</b> min',
  '<b>C&#9839;</b> min',
  '<b>F&#9839;</b> min',
  '<b>B</b> min',
  '<b>E</b> min',
]

function zip(a, b) {
  return a.flatMap((_, i) => [a[i], b[i]])
}

export const all = zip(majors, minors)

function shuffle(a) {
  return a
    .map(key => ({ key, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ key }) => key)
}

export default function random() {
  return zip(shuffle(majors), shuffle(minors))
}

function fill(scales) {
  const ols = [
    ...document
      .getElementById('scales')
      .getElementsByClassName('scale')
  ]

  const chunkSize = scales.length / ols.length
  const chunks = ols.map((ol, i) => scales.slice(i * chunkSize, (i + 1) * chunkSize))
  let value = 1
  for (const [i, ol] of ols.entries()) {
    ol.innerText = ''
    for (const scale of chunks[i]) {
      const li = document.createElement('li')
      li.value = value++
      li.innerHTML = scale
      ol.appendChild(li)
    }
  }
}

function current(but) {
  for (const button of document.getElementsByClassName('is-primary')) {
    button.classList.remove('is-primary')
    button.classList.add('outline')
  }
  but.classList.remove('outline')
  but.classList.add('is-primary')
}

window.addEventListener('load', event => {
  fill(all)

  document.getElementById('generate').addEventListener('click', event => {
    current(event.target)
    fill(random())
  })
  document.getElementById('fourths').addEventListener('click', event => {
    current(event.target)
    fill(all)
  })
  document.getElementById('fifths').addEventListener('click', event => {
    current(event.target)
    const fifths = [...all].reverse()
    fifths.unshift(fifths.pop())
    fill(fifths)
  })
})
