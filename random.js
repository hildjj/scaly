const DISPLAY = {
  'b': '&#9837;',
  '#': '&#9839;',
}
const FILE = {
  'b': '-flat',
  '#': '-sharp',
}

class Key {
  constructor(major, minor, url, ...alts) {
    this.major = Key.pretty(major, DISPLAY);
    this.minor = `<b>${Key.pretty(minor, DISPLAY)}</b> min`;
    this.url = url
    this.alts = [major, ...alts]
  }

  static pretty(key, map) {
    return key[0] + (map[key[1]] || '')
  }
}

const P = 'https://upload.wikimedia.org/wikipedia/commons/'
const KEYS = [
  new Key('C', 'A', `${P}3/33/C-major_a-minor.svg`, 'B#'),
  new Key('F', 'D', `${P}b/b4/F-major_d-minor.svg`, 'E#'),
  new Key('Bb', 'G', `${P}f/fe/B-flat-major_g-minor.svg`, 'A#'),
  new Key('Eb', 'C', `${P}c/cf/E-flat-major_c-minor.svg`, 'D#'),
  new Key('Ab', 'F', `${P}0/0b/A-flat-major_f-minor.svg`, 'G#'),
  // https://upload.wikimedia.org/wikipedia/commons/2/2d/C-sharp-major_a-sharp-minor.svg
  new Key('Db', 'Bb', `${P}8/87/D-flat-major_b-flat-minor.svg`, 'C#'),
  // https://upload.wikimedia.org/wikipedia/commons/3/3d/F-sharp-major_d-sharp-minor.svg
  new Key('Gb', 'Eb', `${P}7/76/G-flat-major_e-flat-minor.svg`, 'F#'),
  new Key('B', 'G#', `${P}6/65/B-major_g-sharp-minor.svg`, 'Cb'),
  new Key('E', 'C#', `${P}f/f3/E-major_c-sharp-minor.svg`, 'Fb'),
  new Key('A', 'F#', `${P}8/84/A-major_f-sharp-minor.svg`),
  new Key('D', 'B', `${P}d/d3/D-major_b-minor.svg`),
  new Key('G', 'E', `${P}1/13/G-major_e-minor.svg`),
]

export const majors = KEYS.map(orig => ({key: orig.major, orig}))
export const minors = KEYS.map(orig => ({key: orig.minor, orig}))

function zip(a, b) {
  return a.flatMap((_, i) => [a[i], b[i]])
}

export const all = zip(majors, minors)

function shuffle(a) {
  return a
    .map(({key, orig}) => ({ key, orig, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
}

export default function random() {
  return zip(shuffle(majors), shuffle(minors))
}

function mouseIn(ev) {
  const img = document.getElementById('keysignature')
  img.src = ev.target.orig.url
  ev.target.classList.add('has-text-info')
}

function mouseOut(ev) {
  const img = document.getElementById('keysignature')
  img.src = ''
  ev.target.classList.remove('has-text-info')
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
    for (const {key, orig} of chunks[i]) {
      const li = document.createElement('li')
      li.value = value++
      li.innerHTML = key
      li.onmouseenter = mouseIn
      li.onmouseleave = mouseOut
      li.orig = orig
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
