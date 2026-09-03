import './style.css'

type IncomingWord = { word: string; x: number; y: number; speed: number }
type Star = { x: number; y: number; speed: number; size: number; alpha: number }

// Standalone words only: no generated compounds, repeated stems, or near-identical variants.
const wordBank = [
  'anchor', 'apricot', 'archway', 'armadillo', 'astronaut', 'avalanche', 'backpack', 'badger', 'balcony', 'balloon',
  'bamboo', 'banquet', 'barometer', 'basilisk', 'beacon', 'beetle', 'bellflower', 'bicycle', 'blueprint', 'bonfire',
  'bookcase', 'bramble', 'brass', 'breadfruit', 'breeze', 'brickwork', 'butterfly', 'cabin', 'cactus', 'calendar',
  'camel', 'campfire', 'canary', 'candlestick', 'caravan', 'cardinal', 'carpenter', 'carousel', 'cashew', 'cathedral',
  'cauldron', 'cavern', 'cello', 'chameleon', 'chestnut', 'chimney', 'citadel', 'clarinet', 'clover', 'cobblestone',
  'compass', 'constellation', 'coral', 'cottage', 'cricket', 'crown', 'crystal', 'cumulus', 'cupboard', 'cypress',
  'daffodil', 'dandelion', 'daybreak', 'dewdrop', 'diamond', 'dolphin', 'domino', 'dragonfly', 'driftwood', 'drumbeat',
  'eclipse', 'egret', 'elm', 'ember', 'emerald', 'envelope', 'falcon', 'fanfare', 'feather', 'fern',
  'ibex', 'hearthstone', 'fjord', 'flamingo', 'flint', 'flute', 'fountain', 'foxglove', 'freckle', 'fresco',
  'galaxy', 'galleon', 'gardenia', 'gazelle', 'gecko', 'giraffe', 'glacier', 'goblet', 'goldfinch', 'granite',
  'grapefruit', 'greenhouse', 'guitar', 'harbor', 'harvest', 'hedgehog', 'heirloom', 'horizon', 'hummingbird', 'hyacinth',
  'iceberg', 'iguana', 'inkwell', 'iris', 'island', 'jasmine', 'jellyfish', 'jigsaw', 'jupiter', 'kestrel',
  'keyhole', 'kingfisher', 'kiosk', 'kiwi', 'ladder', 'lagoon', 'lantern', 'lavender', 'leopard', 'lighthouse',
  'lilac', 'lobster', 'locket', 'lullaby', 'lunar', 'lychee', 'fulcrum', 'magnolia', 'mandolin', 'maple',
  'marble', 'marigold', 'meadow', 'mercury', 'meteor', 'midnight', 'minnow', 'mistletoe', 'moccasin', 'monarch',
  'moonbeam', 'mosaic', 'mountain', 'mushroom', 'narwhal', 'nebula', 'nectarine', 'nest', 'nightingale', 'notebook',
  'oasis', 'obsidian', 'octopus', 'olive', 'opal', 'orchard', 'origami', 'osprey', 'otter', 'paddle',
  'pagoda', 'palette', 'panther', 'papaya', 'parachute', 'parrot', 'peacock', 'pebble', 'pelican', 'peppermint',
  'periscope', 'piano', 'picnic', 'pinecone', 'pioneer', 'planetarium', 'plum', 'pocketwatch', 'pomegranate', 'porcupine',
  'prairie', 'prism', 'puffin', 'pumpkin', 'quartz', 'quill', 'quokka', 'raccoon', 'rainbow', 'raspberry',
  'raven', 'redwood', 'relic', 'rhinoceros', 'ripple', 'robin', 'rocket', 'rosemary', 'saffron', 'sailboat',
  'sapphire', 'satchel', 'saturn', 'scarecrow', 'seahorse', 'sequoia', 'shamrock', 'sherbet', 'shipwreck', 'shoreline',
  'opossum', 'pastry', 'songbird', 'sparrow', 'sphinx', 'spiderweb', 'squirrel', 'starlight', 'strawberry', 'dahlia',
  'vortex', 'citron', 'swan', 'tangerine', 'telescope', 'thimble', 'thistle', 'thunder', 'tiger', 'topaz',
  'toucan', 'treasure', 'trumpet', 'tulip', 'turbine', 'turtle', 'umbrella', 'unicorn', 'valley', 'velvet',
  'violin', 'volcano', 'walnut', 'waterfall', 'weasel', 'whale', 'whisper', 'willow', 'windmill', 'winter',
  'woodpecker', 'wren', 'yacht', 'yarrow', 'zebra', 'zephyr'
]
const totalWords = wordBank.length

if (new Set(wordBank).size !== totalWords) throw new Error('The word deck contains duplicate entries.')

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <main class="game-shell"><section class="game-card" aria-label="Word Siege typing game">
    <header class="hud"><div class="brand"><span>✦</span> WORD SIEGE</div><div class="stat"><span>Wave</span><strong id="wave">01</strong></div><div class="stat"><span>Cleared</span><strong id="cleared">000 / ${totalWords}</strong></div><div class="stat"><span>Best</span><strong id="best">000</strong></div></header>
    <div class="game-area"><canvas id="game" aria-label="Incoming words game field"></canvas>
      <div class="screen" id="screen"><div class="screen-content"><p class="eyebrow">TYPE TO SURVIVE</p><h1 id="screen-title">WORD SIEGE</h1><p id="screen-message">Destroy each incoming word before it reaches the shield.</p><button id="start" type="button">Start Run</button><p class="help">Type an incoming word exactly. No Enter required.</p></div></div>
      <div class="typing-bar"><span class="prompt">›</span><input id="typing" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type the incoming words" placeholder="type here…" disabled><span id="type-status">READY</span></div>
    </div>
    <footer class="footer"><span id="wave-info">Wave 01 · 1 word · 1 at a time</span><span>Sound on · Local ${totalWords}-word deck</span><button id="pause" type="button" aria-label="Pause game">Ⅱ</button></footer>
  </section></main>`

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
const ctx = canvas.getContext('2d')!
const input = document.querySelector<HTMLInputElement>('#typing')!
const screen = document.querySelector<HTMLElement>('#screen')!
const title = document.querySelector<HTMLElement>('#screen-title')!
const message = document.querySelector<HTMLElement>('#screen-message')!
const startButton = document.querySelector<HTMLButtonElement>('#start')!
const pauseButton = document.querySelector<HTMLButtonElement>('#pause')!
const waveEl = document.querySelector<HTMLElement>('#wave')!
const clearedEl = document.querySelector<HTMLElement>('#cleared')!
const bestEl = document.querySelector<HTMLElement>('#best')!
const waveInfo = document.querySelector<HTMLElement>('#wave-info')!
const statusEl = document.querySelector<HTMLElement>('#type-status')!

let width = 0, height = 0, scale = 1, lastFrame = 0
let active = false, paused = false, wave = 1, waveSize = 1, spawned = 0, cleared = 0, deckIndex = 0, spawnTimer = 0, nextWaveTimer = 0
let deck: string[] = [], incoming: IncomingWord[] = [], stars: Star[] = []
let best = Number(localStorage.getItem('word-siege-best') ?? 0)
let audioContext: AudioContext | undefined
bestEl.textContent = String(best).padStart(3, '0')

function shuffle<T>(items: T[]) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }
function makeStar(randomY = false): Star { return { x: Math.random() * width, y: randomY ? Math.random() * height : -5, speed: 14 + Math.random() * 34, size: .5 + Math.random() * 1.7, alpha: .2 + Math.random() * .6 } }
function resize() { const rect = canvas.parentElement!.getBoundingClientRect(); scale = Math.min(devicePixelRatio || 1, 2); width = Math.max(320, rect.width); height = Math.max(580, Math.min(width * .9, innerHeight * .8)); canvas.width = width * scale; canvas.height = height * scale; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(scale, 0, 0, scale, 0, 0); stars = Array.from({ length: Math.ceil(width / 11) }, () => makeStar(true)) }
function getAudio() { audioContext ??= new AudioContext(); if (audioContext.state === 'suspended') void audioContext.resume(); return audioContext }
function tone(start: number, duration: number, type: OscillatorType, end: number, volume = .04) { const audio = getAudio(), now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain(); osc.type = type; osc.frequency.setValueAtTime(start, now); osc.frequency.exponentialRampToValueAtTime(end, now + duration); gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration); osc.connect(gain).connect(audio.destination); osc.start(now); osc.stop(now + duration) }
function typeSound() { tone(420 + Math.random() * 80, .035, 'square', 560, .018) }
function clearSound() { tone(520, .12, 'triangle', 1040, .05) }
function breachSound() { tone(170, .45, 'sawtooth', 48, .07) }
function updateHud() { waveEl.textContent = String(wave).padStart(2, '0'); clearedEl.textContent = `${String(cleared).padStart(3, '0')} / ${totalWords}`; if (cleared > best) { best = cleared; bestEl.textContent = String(best).padStart(3, '0'); localStorage.setItem('word-siege-best', String(best)) } }
function updateWaveInfo() { waveInfo.textContent = `Wave ${String(wave).padStart(2, '0')} · ${waveSize} word${waveSize === 1 ? '' : 's'} · ${Math.min(wave, 6)} at a time` }
function beginWave() { waveSize = wave === 1 ? 1 : Math.min(wave * 10, wordBank.length - deckIndex); spawned = 0; spawnTimer = .45; nextWaveTimer = 0; updateHud(); updateWaveInfo(); statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}` }
function startGame() { getAudio(); deck = shuffle(wordBank); deckIndex = 0; wave = 1; cleared = 0; incoming = []; active = true; paused = false; input.disabled = false; input.value = ''; screen.classList.add('hidden'); pauseButton.textContent = 'Ⅱ'; beginWave(); input.focus() }
function endGame(victory = false) { active = false; input.disabled = true; title.textContent = victory ? 'ALL CLEAR' : 'SHIELD BREACHED'; message.textContent = victory ? `You cleared all ${totalWords} words.` : `You cleared ${cleared} of ${totalWords} words.`; startButton.textContent = victory ? 'New Run' : 'Try Again'; screen.classList.remove('hidden'); statusEl.textContent = victory ? 'VICTORY' : 'GAME OVER' }
function togglePause() { if (!active) return; paused = !paused; pauseButton.textContent = paused ? '▶' : 'Ⅱ'; if (paused) { title.textContent = 'PAUSED'; message.textContent = 'Your shield is holding.'; startButton.textContent = 'Resume'; screen.classList.remove('hidden'); input.blur() } else { screen.classList.add('hidden'); input.focus() } }
function spawnWord() { const word = deck[deckIndex++]; const fontSize = width < 520 ? 18 : 22; ctx.font = `700 ${fontSize}px ui-monospace, monospace`; const margin = Math.min(width * .15, ctx.measureText(word).width / 2 + 16); incoming.push({ word, x: margin + Math.random() * Math.max(1, width - margin * 2), y: -24, speed: 20 + wave * 5 + Math.random() * 11 }) ; spawned++ }
function targetFor(text: string) { return incoming.filter((item) => item.word.startsWith(text)).sort((a, b) => b.y - a.y)[0] }
function checkInput() { if (!active || paused) return; const typed = input.value.toLowerCase().replace(/[^a-z]/g, ''); if (typed !== input.value) input.value = typed; if (!typed) { statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}`; return }; typeSound(); const target = targetFor(typed); if (!target) { input.value = ''; statusEl.textContent = 'NO MATCH'; return }; statusEl.textContent = `${target.word.length - typed.length} LEFT`; if (typed === target.word) { incoming.splice(incoming.indexOf(target), 1); input.value = ''; cleared++; clearSound(); updateHud(); statusEl.textContent = 'WORD CLEARED' } }
function update(dt: number) { for (const star of stars) { star.y += star.speed * dt; if (star.y > height) Object.assign(star, makeStar()) }; if (!active || paused) return; if (nextWaveTimer > 0) { nextWaveTimer -= dt; if (nextWaveTimer <= 0) { wave++; beginWave() }; return }; const limit = Math.min(wave, 6); spawnTimer -= dt; if (spawned < waveSize && incoming.length < limit && spawnTimer <= 0) { spawnWord(); spawnTimer = Math.max(.4, 1.35 - wave * .06) }; for (const item of incoming) item.y += item.speed * dt; if (incoming.some((item) => item.y > height - 150)) { breachSound(); endGame(); return }; if (cleared === wordBank.length) { endGame(true); return }; if (spawned === waveSize && incoming.length === 0) { nextWaveTimer = 1.1; statusEl.textContent = 'WAVE CLEARED' } }
function drawWord(item: IncomingWord) { const typed = input.value; const fontSize = width < 520 ? 18 : 22; ctx.font = `700 ${fontSize}px ui-monospace, monospace`; ctx.textAlign = 'center'; const match = typed && item.word.startsWith(typed); ctx.shadowBlur = match ? 18 : 11; ctx.shadowColor = match ? '#a8fbff' : '#fa6aa3'; ctx.fillStyle = match ? '#d9fdff' : '#ff91bd'; ctx.fillText(item.word, item.x, item.y); if (match) { const left = ctx.measureText(item.word.slice(0, typed.length)).width; const total = ctx.measureText(item.word).width; ctx.strokeStyle = '#82f8ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(item.x - total / 2, item.y + 7); ctx.lineTo(item.x - total / 2 + left, item.y + 7); ctx.stroke() } }
function draw() { const bg = ctx.createLinearGradient(0, 0, 0, height); bg.addColorStop(0, '#1a1036'); bg.addColorStop(.62, '#081a32'); bg.addColorStop(1, '#04101d'); ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height); for (const star of stars) { ctx.fillStyle = `rgba(185, 235, 255, ${star.alpha})`; ctx.fillRect(star.x, star.y, star.size, star.size) }; const shieldY = height - 108; ctx.strokeStyle = 'rgba(98, 244, 255, .5)'; ctx.shadowBlur = 14; ctx.shadowColor = '#66f8ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(width / 2, shieldY + 58, width * .37, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = '#87f9ff'; ctx.font = '700 12px ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.fillText('SHIELD LINE', width / 2, height - 70); incoming.forEach(drawWord) }
function frame(now: number) { const dt = Math.min((now - lastFrame) / 1000 || 0, .05); lastFrame = now; update(dt); draw(); requestAnimationFrame(frame) }

input.addEventListener('input', checkInput)
input.addEventListener('keydown', (event) => { if (event.key === 'Escape') togglePause(); if (event.key === ' ') event.preventDefault() })
window.addEventListener('keydown', (event) => { if ((event.key === 'p' || event.key === 'Escape') && document.activeElement !== input) togglePause() })
startButton.addEventListener('click', () => active && paused ? togglePause() : startGame())
pauseButton.addEventListener('click', togglePause)
window.addEventListener('resize', resize)
resize(); updateHud(); updateWaveInfo(); requestAnimationFrame(frame)
