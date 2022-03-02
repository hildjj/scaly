const DISPLAY = {
  'b': '&#9837;',
  '#': '&#9839;',
}
const FILE = {
  'b': '-flat',
  '#': '-sharp',
}

class Key {
  constructor(major, minor, ...alts) {
    this.maj = major
    this.min = minor
    this.major = Key.pretty(major, DISPLAY);
    this.minor = `<b>${Key.pretty(minor, DISPLAY)}</b> min`;
    this.alts = [major, ...alts]
  }

  static pretty(key, map) {
    return key[0] + (map[key[1]] || '')
  }
}

const KEYS = [
  new Key('C', 'A', 'B#'),
  new Key('F', 'D', 'E#'),
  new Key('Bb', 'G', 'A#'),
  new Key('Eb', 'C', 'D#'),
  new Key('Ab', 'F', 'G#'),
  new Key('Db', 'Bb', 'C#'),
  new Key('Gb', 'Eb', 'F#'),
  new Key('B', 'G#', 'Cb'),
  new Key('E', 'C#', 'Fb'),
  new Key('A', 'F#'),
  new Key('D', 'B'),
  new Key('G', 'E'),
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
  const canvas = document.getElementById('keysignature')
  const VF = Vex.Flow;

  const renderer = new VF.Renderer(
    canvas,
    VF.Renderer.Backends.CANVAS
  );

  renderer.resize(150, 120);
  const stave = new VF.Stave(0, 0, 120);
  stave.addClef("treble")
  new VF.KeySignature(ev.target.orig.maj).addToStave(stave)

  stave.setContext(renderer.getContext()).draw();
}

function mouseOut(ev) {
  const canvas = document.getElementById('keysignature')
  const VF = Vex.Flow;

  const renderer = new VF.Renderer(
    canvas,
    VF.Renderer.Backends.CANVAS
  );
  renderer.getContext().clear()
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
