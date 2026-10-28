/**
 * Draws the sample artwork used by the seed (illustrated safari scenes, 1600x900 JPEG).
 * Replace these with real photographs in the admin when you have them.
 * Usage: node scripts/generate-sample-media.mjs
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'

const W = 1600
const H = 900
const INK = '#201E1F'
mkdirSync('content/media', { recursive: true })

const grad = (id, stops, vertical = true) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`

const svg = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`
const sky = (id, a, b) => `<rect width="${W}" height="${H}" fill="url(#${id})"/>`
const ground = (y, color = INK) => `<path d="M0 ${y} Q${W * 0.25} ${y - 26} ${W * 0.5} ${y} T${W} ${y - 6} V${H} H0Z" fill="${color}"/>`
const sun = (x, y, r, color = '#FFF3A0', op = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${op}"/><circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="${color}" opacity="${op * 0.18}"/>`
const tree = (x, y, s = 1, c = INK) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M0 0V-110M0 -60l-44 -34M0 -70l50 -36" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cy="-118" rx="120" ry="24"/><ellipse cx="-62" cy="-100" rx="60" ry="17"/><ellipse cx="66" cy="-98" rx="52" ry="15"/></g>`
const elephant = (x, y, s = 1, c = INK, flip = 1) =>
  `<g transform="translate(${x} ${y - 28 * s}) scale(${s * flip} ${s})" fill="${c}"><ellipse cx="0" cy="-60" rx="82" ry="48"/><circle cx="-86" cy="-74" r="34"/><ellipse cx="-70" cy="-78" rx="22" ry="34"/><path d="M-110 -58c-20 24 -16 52 -4 72" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="-60" y="-26" width="22" height="64"/><rect x="-18" y="-26" width="22" height="64"/><rect x="26" y="-26" width="22" height="64"/><rect x="58" y="-26" width="22" height="64"/><path d="M80 -70q36 6 32 42" stroke="${c}" stroke-width="7" fill="none"/></g>`
const giraffe = (x, y, s = 1, c = INK) =>
  `<g transform="translate(${x} ${y - 30 * s}) scale(${s})" fill="${c}"><ellipse cx="0" cy="-90" rx="58" ry="32"/><path d="M40 -104L96 -250" stroke="${c}" stroke-width="22" stroke-linecap="round"/><ellipse cx="106" cy="-262" rx="28" ry="14" transform="rotate(-24 106 -262)"/><path d="M96 -276l-4 -22M110 -278l4 -22" stroke="${c}" stroke-width="5"/><rect x="-44" y="-66" width="12" height="106"/><rect x="-20" y="-66" width="12" height="106"/><rect x="18" y="-66" width="12" height="106"/><rect x="42" y="-66" width="12" height="106"/></g>`
const gnu = (x, y, s = 1, c = INK, flip = 1) =>
  `<g transform="translate(${x} ${y - 24 * s}) scale(${s * flip} ${s})" fill="${c}"><ellipse rx="34" ry="20"/><ellipse cx="-34" cy="-6" rx="16" ry="13"/><path d="M-44 -16l-8 -12M-34 -18l-2 -14" stroke="${c}" stroke-width="4"/><rect x="-22" y="8" width="6" height="26"/><rect x="-8" y="8" width="6" height="26"/><rect x="10" y="8" width="6" height="26"/><rect x="22" y="8" width="6" height="26"/></g>`
const hills = (y, color, amp = 60) => `<path d="M0 ${y} Q${W * 0.18} ${y - amp} ${W * 0.4} ${y - 10} T${W * 0.8} ${y - amp * 0.7} T${W} ${y - 20} V${H} H0Z" fill="${color}"/>`
const car = (x, y, s = 1, c = INK, ramp = false) =>
  `<g transform="translate(${x} ${y - 36 * s}) scale(${s})" fill="${c}"><path d="M-170 -20h330v-60l-26 -22h-170l-44 40h-90z"/><rect x="-190" y="-30" width="370" height="42" rx="12"/><circle cx="-110" cy="16" r="32"/><circle cx="110" cy="16" r="32"/><circle cx="-110" cy="16" r="14" fill="#fff" opacity=".35"/><circle cx="110" cy="16" r="14" fill="#fff" opacity=".35"/><rect x="-148" y="-118" width="250" height="14" rx="6"/>${ramp ? `<path d="M180 12l70 22h-72z" fill="${c}"/>` : ''}</g>`
const tent = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-120 0L0 -130L120 0Z" fill="#FF7302"/><path d="M0 -130L120 0H30Z" fill="#E05A00"/><path d="M-28 0L0 -62L28 0Z" fill="${INK}"/></g>`
const fire = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 0c-26 -22 -10 -48 0 -70c18 24 30 40 0 70z" fill="#FFB000"/><path d="M0 0c-12 -12 -4 -26 0 -38c10 14 16 22 0 38z" fill="#FFF3A0"/></g>`
const palm = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0Q-14 -140 14 -250" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>${[-70, -30, 10, 50, 90].map((r) => `<ellipse cx="14" cy="-252" rx="86" ry="14" fill="#1E6B3E" transform="rotate(${r} 14 -252)"/>`).join('')}</g>`
const dhow = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-130 0h260l-36 34h-190z" fill="${INK}"/><path d="M0 -4V-210" stroke="${INK}" stroke-width="7"/><path d="M6 -206L140 -12H6z" fill="#FF7302"/><path d="M-6 -150L-100 -12H-6z" fill="#FFF3A0"/></g>`
const star = (n) => Array.from({ length: n }, (_, i) => `<circle cx="${(i * 197) % W}" cy="${(i * 83) % 420}" r="${1 + (i % 3)}" fill="#fff" opacity="${0.4 + (i % 5) * 0.1}"/>`).join('')
const rows = (fn, n, x0, x1, y, s) => Array.from({ length: n }, (_, i) => fn(x0 + ((x1 - x0) * i) / n + ((i * 37) % 30), y + ((i * 13) % 20), s * (0.85 + (i % 3) * 0.12), INK, i % 2 ? -1 : 1)).join('')
const balloon = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="58" ry="70" fill="${c}"/><path d="M-58 0h116" stroke="#fff" stroke-width="5" opacity=".5"/><rect x="-16" y="84" width="32" height="22" fill="${INK}"/><path d="M-30 58L-14 84M30 58L14 84" stroke="${INK}" stroke-width="3"/></g>`
const peak = (x, y, w, h, c, snow = true) => `<path d="M${x - w / 2} ${y}L${x} ${y - h}L${x + w / 2} ${y}Z" fill="${c}"/>${snow ? `<path d="M${x} ${y - h}l-${w * 0.09} ${h * 0.2}l${w * 0.06} -${h * 0.05}l${w * 0.03} ${h * 0.09}l${w * 0.04} -${h * 0.09}l${w * 0.06} ${h * 0.05}z" fill="#fff"/>` : ''}`

const scenes = {
  'mara-sunset': svg(grad('g', [[0, '#FF5E00'], [0.6, '#FFA21F'], [1, '#FFDD00']]), sky('g') + sun(1020, 520, 150) + hills(640, '#E05A00') + ground(760) + tree(300, 764, 1.5) + tree(1280, 768, 1) + tree(780, 770, 0.6) + rows(gnu, 6, 420, 1100, 774, 1.1)),
  'amboseli-elephants': svg(grad('g', [[0, '#FF8A1F'], [1, '#FFE27A']]), sky('g') + sun(1250, 250, 90, '#FFF8C8') + peak(560, 640, 900, 430, '#B84500') + hills(670, '#8A3A00', 30) + ground(760) + elephant(560, 770, 1.9) + elephant(930, 776, 1.3) + elephant(1190, 780, 0.9, INK, -1) + tree(1470, 768, 0.9)),
  'nakuru-giraffes': svg(grad('g', [[0, '#FF7302'], [1, '#FFF0A0']]), sky('g') + sun(1180, 330, 110, '#FFF8C8') + hills(650, '#E8700A', 40) + ground(770) + tree(220, 774, 1.3) + giraffe(640, 780, 2) + giraffe(1000, 784, 1.5) + giraffe(1300, 788, 1.05) + tree(1520, 776, 0.8)),
  'camp-night': svg(grad('g', [[0, '#0B1E3A'], [1, '#6B3E5E']]), sky('g') + star(90) + sun(1300, 200, 46, '#FFF8C8', 0.9) + hills(660, '#1A1530', 50) + ground(760, '#120F1C') + `<circle cx="1180" cy="720" r="130" fill="#FFB000" opacity=".14"/>` + tent(520, 790, 1.7) + tent(900, 800, 1.2) + fire(1180, 800) + tree(1430, 770, 1.1, '#120F1C')),
  'migration-river': svg(grad('g', [[0, '#FF9A3D'], [1, '#FFE9A8']]), sky('g') + sun(800, 380, 120) + hills(560, '#D2691E', 30) + `<rect y="580" width="${W}" height="150" fill="#8A5A2B"/><path d="M0 650Q400 630 800 658T1600 640V730H0Z" fill="#5C8DA3" opacity=".9"/>` + ground(790) + rows(gnu, 16, 80, 1500, 760, 1.25) + rows(gnu, 12, 200, 1400, 700, 0.8) + tree(1480, 600, 0.8)),
  'gorilla-forest': svg(grad('g', [[0, '#1E6B3E'], [1, '#CFE8A8']]), sky('g') + `<g fill="#0F4A2A" opacity=".55">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="${i * 150}" cy="${260 + (i % 4) * 40}" rx="170" ry="120"/>`).join('')}</g>` + peak(400, 640, 800, 380, '#2F7D4D', false) + peak(1150, 640, 900, 440, '#256B40', false) + ground(760, '#0F3820') + `<g fill="${INK}"><ellipse cx="800" cy="690" rx="130" ry="100"/><circle cx="800" cy="560" r="58"/><ellipse cx="715" cy="700" rx="32" ry="84"/><ellipse cx="885" cy="700" rx="32" ry="84"/></g><circle cx="782" cy="554" r="8" fill="#fff"/><circle cx="820" cy="554" r="8" fill="#fff"/>`),
  'coast-dhow': svg(grad('g', [[0, '#00C2D1'], [1, '#FFF1A8']]), sky('g') + sun(800, 470, 130, '#FFDD00') + `<rect y="480" width="${W}" height="260" fill="#00A9BC"/><path d="M0 520Q400 500 800 520T1600 510" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>` + dhow(640, 620, 1.7) + dhow(1100, 575, 0.9) + `<path d="M0 760Q500 720 1000 760T1600 740V900H0Z" fill="#FFD27A"/>` + palm(1400, 810, 1.4) + palm(220, 830, 1.1)),
  'vehicle-landcruiser': svg(grad('g', [[0, '#FF7302'], [1, '#FFDD00']]), sky('g') + sun(1200, 420, 120) + hills(620, '#E05A00') + ground(760) + tree(300, 766, 1.2) + car(760, 800, 2.1)),
  'vehicle-van': svg(grad('g', [[0, '#FF8A1F'], [1, '#FFF0A0']]), sky('g') + sun(400, 400, 100) + hills(640, '#E8700A', 40) + ground(760) + tree(1350, 770, 1.2) + car(820, 800, 2)),
  'vehicle-accessible': svg(grad('g', [[0, '#FFDD00'], [1, '#FFF6C8']]), sky('g') + sun(1300, 300, 90, '#FFFFFF', 0.8) + hills(640, '#F0A000', 40) + ground(760) + car(720, 800, 2.1, INK, true) + `<g transform="translate(1320 640)" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"><circle cx="0" cy="-60" r="14" fill="${INK}"/><path d="M0 -40V10h46l16 40M0 -14h34"/><path d="M-22 4a40 40 0 1 0 44 48"/></g>`),
  'lions-savanna': svg(grad('g', [[0, '#FF5E00'], [1, '#FFC93D']]), sky('g') + sun(480, 500, 140) + hills(640, '#D2691E') + ground(770) + tree(1200, 774, 1.5) + `<g fill="${INK}" transform="translate(860 728)"><ellipse rx="86" ry="38"/><circle cx="-96" cy="-14" r="34"/><circle cx="-96" cy="-14" r="48" opacity=".9"/><rect x="-62" y="12" width="14" height="44"/><rect x="-26" y="12" width="14" height="44"/><rect x="26" y="12" width="14" height="44"/><rect x="58" y="12" width="14" height="44"/><path d="M86 -6q60 -20 70 30" stroke="${INK}" stroke-width="10" fill="none"/></g>`),
  'balloons-mara': svg(grad('g', [[0, '#FF9A3D'], [1, '#FFEFA0']]), sky('g') + sun(1100, 560, 120) + hills(700, '#E05A00', 30) + ground(790) + balloon(420, 260, 1.7, '#FF7302') + balloon(800, 180, 1.3, '#FFDD00') + balloon(1150, 300, 1.6, '#B34A00') + balloon(1400, 150, 0.9, '#FF5E00') + tree(1350, 794, 1)),
  'mount-kenya': svg(grad('g', [[0, '#3E7CB1'], [1, '#FFE7B0']]), sky('g') + peak(800, 700, 1200, 520, '#5C6B8A') + peak(300, 720, 700, 260, '#3E5D8A', false) + peak(1300, 720, 800, 300, '#46678F', false) + hills(740, '#2F7D4D', 40) + ground(800, '#1B4A2C') + tree(300, 810, 1, '#0F3820')),
  'samburu-reticulated': svg(grad('g', [[0, '#FF6A00'], [1, '#FFD070']]), sky('g') + sun(1250, 480, 130) + hills(620, '#B84500', 70) + hills(690, '#8A3A00', 30) + ground(770) + elephant(520, 780, 1.4) + gnu(900, 782, 1.8) + tree(1400, 774, 1.2)),
}

for (const [name, s] of Object.entries(scenes)) {
  await sharp(Buffer.from(s)).jpeg({ quality: 82, mozjpeg: true }).toFile(`content/media/${name}.jpg`)
  console.log('wrote', name)
}
writeFileSync('content/media/README.txt', 'Sample artwork drawn by scripts/generate-sample-media.mjs. Replace with real photos in the admin.\n')
