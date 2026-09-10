import './style.css'

type IncomingWord = { word: string; x: number; y: number; speed: number }
type Star = { x: number; y: number; speed: number; size: number; color: string }
type SpeedBurst = { x: number; y: number; wpm: number; age: number }
type MathOperation = '+' | '−' | '×'
type MathQuestion = { left: number; right: number; operation: MathOperation; answer: number; key: string }
type CoinSide = 'heads' | 'tails'

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
  <main class="game-shell">
    <video class="sky-video" autoplay muted loop playsinline aria-hidden="true">
      <source src="/media/sky-background.mp4" type="video/mp4">
    </video>
    <div class="sky-overlay" aria-hidden="true"></div>
    <div class="sky-grain" aria-hidden="true"></div>
    <nav class="ps5-menu" aria-label="Choose a game">
      <div class="ps5-scroll-container">
        <button class="ps5-game-card" type="button" data-game="word" aria-controls="word-game" aria-pressed="false">
          <div class="ps5-icon">✦</div>
          <div class="ps5-title">Word Siege</div>
        </button>
        <button class="ps5-game-card" type="button" data-game="math" aria-controls="math-game" aria-pressed="false">
          <div class="ps5-icon">±</div>
          <div class="ps5-title">Math Rush</div>
        </button>
        <button class="ps5-game-card" type="button" data-game="flappy" aria-controls="flappy-game" aria-pressed="false">
          <div class="ps5-icon ps5-bird-icon" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false"><path d="M13 35c3-14 14-22 27-18 6 2 10 7 11 13 5 0 9 1 12 4-4 5-9 8-15 8-3 9-11 14-21 14-10 0-17-7-17-16 0-2 1-4 3-5Z"/><path d="M24 37c6-7 14-7 20-2-7 1-12 5-16 10" class="bird-wing"/><circle cx="40" cy="27" r="2.4" class="bird-eye"/><path d="m52 32 8-3-6 7" class="bird-beak"/></svg></div>
          <div class="ps5-title">Sky Flap</div>
        </button>
        <button class="ps5-game-card" type="button" data-game="coin" aria-controls="coin-game" aria-pressed="false">
          <div class="ps5-icon">🪙</div>
          <div class="ps5-title">Coin Toss</div>
        </button>
        <button class="ps5-game-card" type="button" data-game="dice" aria-controls="dice-game" aria-pressed="false">
          <div class="ps5-icon">🎲</div>
          <div class="ps5-title">Dice Roll</div>
        </button>
      </div>
    </nav>
  <div class="game-container is-empty">
  <section class="game-card is-hidden" id="word-game" aria-label="Word Siege typing game">
    <header class="hud"><div class="brand"><span>✦</span> WORD SIEGE</div><div class="stat"><span>Wave</span><strong id="wave">01</strong></div><div class="stat"><span>Cleared</span><strong id="cleared">000 / ${totalWords}</strong></div><div class="stat"><span>Best</span><strong id="best">000</strong></div></header>
    <div class="game-area"><canvas id="game" aria-label="Incoming words game field"></canvas>
      <div class="screen" id="screen"><div class="screen-content"><p class="eyebrow">TYPE TO SURVIVE</p><h1 id="screen-title">WORD SIEGE</h1><p id="screen-message">Destroy each incoming word before it reaches the shield.</p><button id="start" type="button">Start Run</button><p class="help">Type an incoming word exactly. No Enter required.</p></div></div>
      <div class="typing-bar"><span class="prompt" aria-hidden="true">›</span><input id="typing" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type the incoming words" placeholder="type here…" disabled><span id="type-status" aria-live="polite">READY</span></div>
    </div>
    <footer class="footer"><span id="wave-info">Wave 01 · 1 word · 1 at a time</span><span>Sound on · Local ${totalWords}-word deck</span><button id="pause" type="button" aria-label="Pause game" aria-pressed="false">Ⅱ</button></footer>
  </section>
  <section class="game-card math-card is-hidden" id="math-game" aria-label="Math Rush solving game">
    <header class="math-hud">
      <div class="brand"><span>✦</span> MATH RUSH</div>
      <div class="stat"><span>Time</span><strong id="math-time">1:00</strong></div>
      <div class="stat"><span>Level</span><strong id="math-level">01</strong></div>
      <div class="stat"><span>Score</span><strong id="math-score">00</strong></div>
      <div class="stat"><span>Best</span><strong id="math-best">00</strong></div>
    </header>
    <div class="math-area">
      <div class="math-glow math-glow-one"></div><div class="math-glow math-glow-two"></div>
      <p class="math-kicker" id="math-kicker">60-SECOND SPRINT</p>
      <div class="math-question" id="math-question" aria-live="polite">READY?</div>
      <p class="math-rule" id="math-rule">Addition, subtraction, and multiplication. Every correct answer raises the level.</p>
      <form class="math-answer-form" id="math-answer-form">
        <label class="sr-only" for="math-answer">Your answer</label>
        <input id="math-answer" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="answer" disabled>
        <button id="math-submit" type="submit" disabled>Check</button>
      </form>
      <p class="math-status" id="math-status" aria-live="polite">PRESS START WHEN YOU'RE READY</p>
      <div class="math-progress" aria-hidden="true"><span id="math-progress-fill"></span></div>
    </div>
    <footer class="math-footer"><span>Questions never repeat during this session.</span><button id="math-start" type="button">Start 1-Minute Run</button></footer>
  </section>
  <section class="game-card flappy-card is-hidden" id="flappy-game" aria-label="Sky Flap flying game">
    <header class="flappy-hud">
      <div class="brand"><span>◒</span> SKY FLAP</div>
      <div class="stat"><span>Score</span><strong id="flappy-score">00</strong></div>
      <div class="stat"><span>Best</span><strong id="flappy-best">00</strong></div>
    </header>
    <div class="flappy-area">
      <canvas id="flappy-canvas" aria-label="Sky Flap game field"></canvas>
      <div class="flappy-screen" id="flappy-screen"><div class="screen-content"><p class="eyebrow">KEEP YOUR WINGS UP</p><h1 id="flappy-title">SKY FLAP</h1><p id="flappy-message">Fly through the garden gates. Click, tap, or press Space to flap.</p><button id="flappy-start" type="button">Start Flight</button><p class="help">One tap lifts the bird. Each gate is one point.</p></div></div>
    </div>
    <footer class="flappy-footer"><span>Click, tap, or press Space to flap.</span><span id="flappy-status" aria-live="polite">READY TO FLY</span></footer>
  </section>
  <section class="game-card coin-card is-hidden" id="coin-game" aria-label="Coin Toss game">
    <header class="hud">
      <div class="brand"><span>✦</span> COIN TOSS</div>
      <div class="stat"><span>Heads</span><strong id="coin-heads-count">0</strong></div>
      <div class="stat"><span>Tails</span><strong id="coin-tails-count">0</strong></div>
      <div class="stat"><span>Streak</span><strong id="coin-streak">0</strong></div>
      <div class="stat"><span>Best</span><strong id="coin-best">0</strong></div>
    </header>
    <div class="coin-area">
      <div class="coin-glow coin-glow-one"></div><div class="coin-glow coin-glow-two"></div>
      <p class="coin-status" id="coin-status">PICK A SIDE AND FLIP</p>
      <div class="coin-scene">
        <div class="coin-body" id="coin-body">
          <div class="coin-face coin-heads">✦</div>
          <div class="coin-face coin-tails">◈</div>
        </div>
      </div>
      <div class="coin-result" id="coin-result"></div>
      <div class="coin-pick-row">
        <button class="coin-pick-btn" type="button" data-pick="heads" id="pick-heads">Heads</button>
        <button class="coin-pick-btn" type="button" data-pick="tails" id="pick-tails">Tails</button>
      </div>
    </div>
    <footer class="footer coin-footer"><span>Pick a side, then flip the coin.</span><span id="coin-total">Total flips: 0</span></footer>
  </section>
  <section class="game-card dice-card is-hidden" id="dice-game" aria-label="Dice Roll game">
    <header class="hud">
      <div class="brand"><span>✦</span> DICE ROLL</div>
      <div class="stat"><span>Rolls</span><strong id="dice-rolls-count">0</strong></div>
      <div class="stat"><span>Last</span><strong id="dice-last">—</strong></div>
      <div class="stat"><span>Best 6-Streak</span><strong id="dice-best">0</strong></div>
    </header>
    <div class="dice-area">
      <div class="dice-glow dice-glow-one"></div><div class="dice-glow dice-glow-two"></div>
      <p class="dice-status" id="dice-status">PRESS ROLL TO START</p>
      <div class="dice-scene">
        <div class="dice-cube" id="dice-cube">
          <div class="dice-face dice-face-1"><div class="dice-pip"></div></div>
          <div class="dice-face dice-face-2"><div class="dice-pip"></div><div class="dice-pip"></div></div>
          <div class="dice-face dice-face-3"><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div></div>
          <div class="dice-face dice-face-4"><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div></div>
          <div class="dice-face dice-face-5"><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div></div>
          <div class="dice-face dice-face-6"><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div><div class="dice-pip"></div></div>
        </div>
      </div>
      <div class="dice-value" id="dice-value"></div>
      <button class="dice-roll-btn" type="button" id="dice-roll-btn">Roll Dice</button>
      <div class="dice-history" id="dice-history"><span class="dice-history-label">History</span></div>
    </div>
    <footer class="footer dice-footer"><span>Roll the dice and test your luck.</span><span id="dice-total-status" aria-live="polite">READY</span></footer>
  </section>
  </div></main>`

const canvas = document.querySelector<HTMLCanvasElement>('#game')!
const ctx = canvas.getContext('2d', { alpha: true })!
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
const wordGame = document.querySelector<HTMLElement>('#word-game')!
const mathGame = document.querySelector<HTMLElement>('#math-game')!
const flappyGame = document.querySelector<HTMLElement>('#flappy-game')!
const gameTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.ps5-game-card'))
const mathTimeEl = document.querySelector<HTMLElement>('#math-time')!
const mathLevelEl = document.querySelector<HTMLElement>('#math-level')!
const mathScoreEl = document.querySelector<HTMLElement>('#math-score')!
const mathBestEl = document.querySelector<HTMLElement>('#math-best')!
const mathQuestionEl = document.querySelector<HTMLElement>('#math-question')!
const mathKickerEl = document.querySelector<HTMLElement>('#math-kicker')!
const mathRuleEl = document.querySelector<HTMLElement>('#math-rule')!
const mathAnswerForm = document.querySelector<HTMLFormElement>('#math-answer-form')!
const mathAnswerInput = document.querySelector<HTMLInputElement>('#math-answer')!
const mathSubmitButton = document.querySelector<HTMLButtonElement>('#math-submit')!
const mathStatusEl = document.querySelector<HTMLElement>('#math-status')!
const mathProgressFill = document.querySelector<HTMLElement>('#math-progress-fill')!
const mathStartButton = document.querySelector<HTMLButtonElement>('#math-start')!
const flappyCanvas = document.querySelector<HTMLCanvasElement>('#flappy-canvas')!
const flappyCtx = flappyCanvas.getContext('2d', { alpha: true })!
const flappyScreen = document.querySelector<HTMLElement>('#flappy-screen')!
const flappyTitle = document.querySelector<HTMLElement>('#flappy-title')!
const flappyMessage = document.querySelector<HTMLElement>('#flappy-message')!
const flappyStartButton = document.querySelector<HTMLButtonElement>('#flappy-start')!
const flappyScoreEl = document.querySelector<HTMLElement>('#flappy-score')!
const flappyBestEl = document.querySelector<HTMLElement>('#flappy-best')!
const flappyStatusEl = document.querySelector<HTMLElement>('#flappy-status')!
const coinGame = document.querySelector<HTMLElement>('#coin-game')!
const coinBody = document.querySelector<HTMLElement>('#coin-body')!
const coinResultEl = document.querySelector<HTMLElement>('#coin-result')!
const coinStatusEl = document.querySelector<HTMLElement>('#coin-status')!
const coinHeadsCountEl = document.querySelector<HTMLElement>('#coin-heads-count')!
const coinTailsCountEl = document.querySelector<HTMLElement>('#coin-tails-count')!
const coinStreakEl = document.querySelector<HTMLElement>('#coin-streak')!
const coinBestEl = document.querySelector<HTMLElement>('#coin-best')!
const coinTotalEl = document.querySelector<HTMLElement>('#coin-total')!
const pickHeadsBtn = document.querySelector<HTMLButtonElement>('#pick-heads')!
const pickTailsBtn = document.querySelector<HTMLButtonElement>('#pick-tails')!
const diceGame = document.querySelector<HTMLElement>('#dice-game')!
const diceCube = document.querySelector<HTMLElement>('#dice-cube')!
const diceValueEl = document.querySelector<HTMLElement>('#dice-value')!
const diceStatusEl = document.querySelector<HTMLElement>('#dice-status')!
const diceRollsCountEl = document.querySelector<HTMLElement>('#dice-rolls-count')!
const diceLastEl = document.querySelector<HTMLElement>('#dice-last')!
const diceBestEl = document.querySelector<HTMLElement>('#dice-best')!
const diceRollBtn = document.querySelector<HTMLButtonElement>('#dice-roll-btn')!
const diceHistoryEl = document.querySelector<HTMLElement>('#dice-history')!
const diceTotalStatusEl = document.querySelector<HTMLElement>('#dice-total-status')!

let width = 0, height = 0, scale = 1, lastFrame = 0
let active = false, paused = false, wave = 1, waveSize = 1, spawned = 0, cleared = 0, deckIndex = 0, spawnTimer = 0, nextWaveTimer = 0
let deck: string[] = [], incoming: IncomingWord[] = [], stars: Star[] = [], speedBursts: SpeedBurst[] = []
let wordTypeStartedAt = 0
let best = getStoredScore('word-siege-best')
let audioContext: AudioContext | undefined
let mathActive = false, mathLevel = 1, mathScore = 0, mathStartedAt = 0, mathQuestion: MathQuestion | undefined
let background = ctx.createLinearGradient(0, 0, 0, 1)
let selectedGame: 'word' | 'math' | 'flappy' | 'coin' | 'dice' | null = null
let resizeFrame = 0, lastTypeSoundAt = 0
const usedMathQuestions = new Set<string>()
let mathBest = getStoredScore('math-rush-best')
let flappyWidth = 0, flappyHeight = 0, flappyScale = 1, flappyActive = false, flappyScore = 0, flappyBest = getStoredScore('sky-flap-best')
let flappyBird = { y: 0, velocity: 0 }, flappyPipes: { x: number; gapY: number; counted: boolean }[] = [], flappySpawnTimer = 0
let coinFlipping = false, coinPick: CoinSide | null = null, coinHeadsCount = 0, coinTailsCount = 0, coinStreak = 0, coinBestStreak = getStoredScore('coin-toss-best')
let diceRolling = false, diceRollCount = 0, diceSixStreak = 0, diceBestSixStreak = getStoredScore('dice-roll-best'), diceHistory: number[] = []
bestEl.textContent = String(best).padStart(3, '0')
mathBestEl.textContent = String(mathBest).padStart(2, '0')
flappyBestEl.textContent = String(flappyBest).padStart(2, '0')
coinBestEl.textContent = String(coinBestStreak)

function shuffle<T>(items: T[]) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }
function getStoredScore(key: string) { try { const value = Number(localStorage.getItem(key)); return Number.isFinite(value) && value >= 0 ? value : 0 } catch { return 0 } }
function saveScore(key: string, value: number) { try { localStorage.setItem(key, String(value)) } catch { /* Scores remain available for this run when storage is blocked. */ } }
function makeStar(randomY = false): Star { const alpha = .12 + Math.random() * .42; return { x: Math.random() * width, y: randomY ? Math.random() * height : -5, speed: 10 + Math.random() * 22, size: .5 + Math.random() * 1.4, color: `rgba(255, 237, 215, ${alpha})` } }
function resize() { const rect = canvas.parentElement!.getBoundingClientRect(); scale = Math.min(devicePixelRatio || 1, 1.5); width = Math.max(320, rect.width); height = Math.max(580, Math.min(width * .9, innerHeight * .8)); canvas.width = width * scale; canvas.height = height * scale; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(scale, 0, 0, scale, 0, 0); background = ctx.createLinearGradient(0, 0, 0, height); background.addColorStop(0, 'rgba(255, 255, 255, .08)'); background.addColorStop(.62, 'rgba(16, 9, 4, .12)'); background.addColorStop(1, 'rgba(10, 5, 3, .22)'); stars = Array.from({ length: Math.ceil(width / 16) }, () => makeStar(true)) }
function queueResize() { if (selectedGame !== 'word' || resizeFrame) return; resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resize() }) }
function resizeFlappy() {
  const parent = flappyCanvas.parentElement!
  flappyScale = Math.min(devicePixelRatio || 1, 1.5)
  flappyWidth = Math.max(320, parent.clientWidth)
  // Use actual container height when the card is visible (>100px), fall back to a
  // computed value when the card is hidden/collapsed inside the grid animation.
  const measuredH = parent.clientHeight
  flappyHeight = measuredH > 100 ? measuredH : Math.max(380, Math.min(flappyWidth * .72, innerHeight * .68))
  flappyCanvas.width = flappyWidth * flappyScale
  flappyCanvas.height = flappyHeight * flappyScale
  flappyCanvas.style.width = `${flappyWidth}px`
  flappyCanvas.style.height = `${flappyHeight}px`
  flappyCtx.setTransform(flappyScale, 0, 0, flappyScale, 0, 0)
  if (!flappyActive) flappyBird.y = flappyHeight * .48
}
// Double-RAF: first frame commits the flex layout, second frame has real measurements.
function queueFlappyResize() { if (selectedGame !== 'flappy' || resizeFrame) return; resizeFrame = requestAnimationFrame(() => { requestAnimationFrame(() => { resizeFrame = 0; resizeFlappy(); drawFlappy() }) }) }
function getAudio() { audioContext ??= new AudioContext(); if (audioContext.state === 'suspended') void audioContext.resume(); return audioContext }
function tone(start: number, duration: number, type: OscillatorType, end: number, volume = .04) { const audio = getAudio(), now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain(); osc.type = type; osc.frequency.setValueAtTime(start, now); osc.frequency.exponentialRampToValueAtTime(end, now + duration); gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration); osc.connect(gain).connect(audio.destination); osc.start(now); osc.stop(now + duration) }
function typeSound() {
  const nowPerf = performance.now()
  if (nowPerf - lastTypeSoundAt < 28) return
  lastTypeSoundAt = nowPerf
  const audio = getAudio()
  const now = audio.currentTime
  const duration = .07
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * duration), audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6)
  const noise = audio.createBufferSource()
  noise.buffer = buffer
  const filter = audio.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 800 + Math.random() * 160
  filter.Q.value = 0.7
  const noiseGain = audio.createGain()
  noiseGain.gain.setValueAtTime(.012, now)
  noiseGain.gain.exponentialRampToValueAtTime(.001, now + duration)
  noise.connect(filter).connect(noiseGain).connect(audio.destination)
  noise.start(now)
  const osc = audio.createOscillator()
  const oscGain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(260 + Math.random() * 20, now)
  oscGain.gain.setValueAtTime(.004, now)
  oscGain.gain.exponentialRampToValueAtTime(.001, now + .06)
  osc.connect(oscGain).connect(audio.destination)
  osc.start(now)
  osc.stop(now + .06)
}
function clearSound() { tone(420, .16, 'sine', 680, .018) }
function breachSound() { tone(170, .45, 'sawtooth', 48, .07) }
function updateHud() { waveEl.textContent = String(wave).padStart(2, '0'); clearedEl.textContent = `${String(cleared).padStart(3, '0')} / ${totalWords}`; if (cleared > best) { best = cleared; bestEl.textContent = String(best).padStart(3, '0'); saveScore('word-siege-best', best) } }
function updateWaveInfo() { waveInfo.textContent = `Wave ${String(wave).padStart(2, '0')} · ${waveSize} word${waveSize === 1 ? '' : 's'} · ${Math.min(wave, 6)} at a time` }
function beginWave() { waveSize = wave === 1 ? 1 : Math.min(wave * 10, wordBank.length - deckIndex); spawned = 0; spawnTimer = .45; nextWaveTimer = 0; updateHud(); updateWaveInfo(); statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}` }
function startGame() { getAudio(); deck = shuffle(wordBank); deckIndex = 0; wave = 1; cleared = 0; incoming = []; speedBursts = []; wordTypeStartedAt = 0; active = true; paused = false; input.disabled = false; input.value = ''; screen.classList.add('hidden'); pauseButton.textContent = 'Ⅱ'; pauseButton.setAttribute('aria-pressed', 'false'); pauseButton.setAttribute('aria-label', 'Pause game'); beginWave(); input.focus() }
function endGame(victory = false) { active = false; input.disabled = true; title.textContent = victory ? 'ALL CLEAR' : 'SHIELD BREACHED'; message.textContent = victory ? `You cleared all ${totalWords} words.` : `You cleared ${cleared} of ${totalWords} words.`; startButton.textContent = victory ? 'New Run' : 'Try Again'; screen.classList.remove('hidden'); statusEl.textContent = victory ? 'VICTORY' : 'GAME OVER' }
function togglePause() { if (!active) return; paused = !paused; pauseButton.textContent = paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-pressed', String(paused)); pauseButton.setAttribute('aria-label', paused ? 'Resume game' : 'Pause game'); if (paused) { title.textContent = 'PAUSED'; message.textContent = 'Your shield is holding.'; startButton.textContent = 'Resume'; screen.classList.remove('hidden'); input.blur() } else { screen.classList.add('hidden'); input.focus() } }
function spawnWord() { const word = deck[deckIndex++]; const fontSize = width < 520 ? 23 : 29; ctx.font = `700 ${fontSize}px Inter, ui-sans-serif, sans-serif`; const margin = Math.min(width * .15, ctx.measureText(word.toUpperCase()).width / 2 + 34); incoming.push({ word, x: margin + Math.random() * Math.max(1, width - margin * 2), y: -24, speed: 20 + wave * 5 + Math.random() * 11 }) ; spawned++ }
function targetFor(text: string) { let target: IncomingWord | undefined; for (const item of incoming) if (item.word.startsWith(text) && (!target || item.y > target.y)) target = item; return target }
function checkInput() {
  if (!active || paused) return
  const typed = input.value.toLowerCase().replace(/[^a-z]/g, '')
  if (typed !== input.value) input.value = typed
  if (!typed) {
    wordTypeStartedAt = 0
    statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}`
    return
  }
  if (typed.length === 1) wordTypeStartedAt = performance.now()
  typeSound()
  const target = targetFor(typed)
  if (!target) {
    wordTypeStartedAt = 0
    input.value = ''
    statusEl.textContent = 'NO MATCH'
    return
  }
  statusEl.textContent = `${target.word.length - typed.length} LEFT`
  if (typed === target.word) {
    const elapsed = Math.max(.08, (performance.now() - (wordTypeStartedAt || performance.now())) / 1000)
    const wpm = Math.max(1, Math.round((target.word.length / 5) * 60 / elapsed))
    speedBursts.push({ x: target.x, y: target.y, wpm, age: 0 })
    incoming.splice(incoming.indexOf(target), 1)
    input.value = ''
    wordTypeStartedAt = 0
    cleared++
    clearSound()
    updateHud()
    statusEl.textContent = 'WORD CLEARED'
  }
}
function update(dt: number) {
  if (!active || paused) return
  for (const burst of speedBursts) burst.age += dt
  speedBursts = speedBursts.filter((burst) => burst.age < 1)
  for (const star of stars) { star.y += star.speed * dt; if (star.y > height) Object.assign(star, makeStar()) }
  if (nextWaveTimer > 0) { nextWaveTimer -= dt; if (nextWaveTimer <= 0) { wave++; beginWave() }; return }
  const limit = Math.min(wave, 6)
  spawnTimer -= dt
  if (spawned < waveSize && incoming.length < limit && spawnTimer <= 0) { spawnWord(); spawnTimer = Math.max(.4, 1.35 - wave * .06) }
  for (const item of incoming) item.y += item.speed * dt
  if (incoming.some((item) => item.y > height - 150)) { breachSound(); endGame(); return }
  if (cleared === wordBank.length && speedBursts.length === 0) { endGame(true); return }
  if (spawned === waveSize && incoming.length === 0 && cleared < wordBank.length) { nextWaveTimer = 1.1; statusEl.textContent = 'WAVE CLEARED' }
}
function drawWord(item: IncomingWord) {
  const fontSize = width < 520 ? 23 : 29
  const text = item.word.toUpperCase()
  ctx.font = `700 ${fontSize}px Inter, ui-sans-serif, sans-serif`
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffedd7'
  ctx.fillText(text, item.x, item.y)
}
function drawSpeedBurst(burst: SpeedBurst) {
  const alpha = Math.max(0, 1 - burst.age)
  const fontSize = width < 520 ? 13 : 15
  ctx.font = `500 ${fontSize}px Inter, ui-sans-serif, sans-serif`
  ctx.textAlign = 'center'
  ctx.fillStyle = `rgba(74, 74, 74, ${alpha})`
  ctx.fillText(`${burst.wpm} WPM`, burst.x, burst.y)
}
function draw() {
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)
  for (const star of stars) { ctx.fillStyle = star.color; ctx.fillRect(star.x, star.y, star.size, star.size) }
  const shieldY = height - 108
  ctx.strokeStyle = 'rgba(64, 55, 46, 1)'
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
  ctx.setLineDash([6, 6])
  ctx.beginPath()
  ctx.arc(width / 2, shieldY + 58, width * .37, Math.PI * 1.15, Math.PI * 1.85)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#ffedd7'
  ctx.font = '500 12px Inter, ui-sans-serif, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SHIELD LINE', width / 2, height - 70)
  incoming.forEach(drawWord)
  speedBursts.forEach(drawSpeedBurst)
}

function randomInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function formatMathTime(seconds: number) { return `0:${String(Math.max(0, seconds)).padStart(2, '0')}` }
function mathKey(left: number, right: number, operation: MathOperation) {
  return operation === '−' ? `${left}${operation}${right}` : `${Math.min(left, right)}${operation}${Math.max(left, right)}`
}
function createMathQuestion(): MathQuestion {
  const operations: MathOperation[] = mathLevel < 3 ? ['+', '−'] : ['+', '−', '×']
  const base = mathLevel * 3

  for (let attempt = 0; attempt < 400; attempt++) {
    const operation = operations[randomInt(0, operations.length - 1)]
    const span = 5 + mathLevel * 3
    let left: number
    let right: number

    if (operation === '+') {
      left = base + randomInt(1, span)
      right = base + randomInt(1, span)
    } else if (operation === '−') {
      right = base + randomInt(1, span)
      left = right + base + randomInt(1, span)
    } else {
      const factorBase = Math.max(2, Math.floor(mathLevel / 2) + 1)
      const factorSpan = Math.min(14, 3 + Math.floor(mathLevel / 3))
      left = factorBase + randomInt(0, factorSpan)
      right = factorBase + randomInt(0, factorSpan)
    }

    const key = mathKey(left, right, operation)
    if (!usedMathQuestions.has(key)) {
      usedMathQuestions.add(key)
      const answer = operation === '+' ? left + right : operation === '−' ? left - right : left * right
      return { left, right, operation, answer, key }
    }
  }

  // A deterministic fallback keeps the no-repeat promise intact even in an unusually long session.
  const left = 10000 + usedMathQuestions.size * 11 + mathLevel
  const right = mathLevel
  const key = mathKey(left, right, '+')
  usedMathQuestions.add(key)
  return { left, right, operation: '+', answer: left + right, key }
}
function updateMathHud(remainingSeconds = 60) {
  mathTimeEl.textContent = formatMathTime(remainingSeconds)
  mathLevelEl.textContent = String(mathLevel).padStart(2, '0')
  mathScoreEl.textContent = String(mathScore).padStart(2, '0')
  mathProgressFill.style.width = `${Math.max(0, Math.min(100, (remainingSeconds / 60) * 100))}%`
  if (mathScore > mathBest) {
    mathBest = mathScore
    mathBestEl.textContent = String(mathBest).padStart(2, '0')
    saveScore('math-rush-best', mathBest)
  }
}
function showMathQuestion() {
  mathQuestion = createMathQuestion()
  mathQuestionEl.textContent = `${mathQuestion.left} ${mathQuestion.operation} ${mathQuestion.right} = ?`
}
function animateMathQuestion(state: 'is-correct' | 'is-wrong') {
  mathQuestionEl.classList.remove('is-correct', 'is-wrong')
  void mathQuestionEl.offsetWidth
  mathQuestionEl.classList.add(state)
}
function startMathGame() {
  getAudio()
  mathActive = true
  mathLevel = 1
  mathScore = 0
  mathStartedAt = performance.now()
  mathKickerEl.textContent = '60-SECOND SPRINT'
  mathRuleEl.textContent = 'Solve fast: each correct answer moves you up one level.'
  mathStatusEl.textContent = 'GO!'
  mathAnswerInput.value = ''
  mathAnswerInput.disabled = false
  mathSubmitButton.disabled = false
  mathStartButton.textContent = 'Running…'
  mathStartButton.disabled = true
  showMathQuestion()
  updateMathHud()
  mathAnswerInput.focus()
}
function finishMathGame() {
  if (!mathActive) return
  mathActive = false
  mathAnswerInput.disabled = true
  mathSubmitButton.disabled = true
  mathQuestionEl.textContent = 'TIME!'
  mathKickerEl.textContent = 'RUN COMPLETE'
  mathRuleEl.textContent = `You solved ${mathScore} ${mathScore === 1 ? 'question' : 'questions'} and reached level ${mathLevel}.`
  mathStatusEl.textContent = mathScore > 0 ? 'NICE RUN — READY FOR ANOTHER?' : 'START AGAIN AND SET YOUR PACE.'
  mathProgressFill.style.width = '0%'
  mathStartButton.textContent = 'Play Again'
  mathStartButton.disabled = false
  updateMathHud(0)
}
function updateMathTimer(now: number) {
  if (!mathActive) return
  const remainingMilliseconds = 60000 - (now - mathStartedAt)
  if (remainingMilliseconds <= 0) {
    finishMathGame()
    return
  }
  updateMathHud(Math.ceil(remainingMilliseconds / 1000))
}
function submitMathAnswer() {
  if (!mathActive || !mathQuestion) return
  const value = mathAnswerInput.value.trim()
  if (!/^-?\d+$/.test(value)) {
    mathStatusEl.textContent = 'ENTER A WHOLE NUMBER'
    animateMathQuestion('is-wrong')
    return
  }
  if (Number(value) !== mathQuestion.answer) {
    mathStatusEl.textContent = 'NOT QUITE — TRY AGAIN'
    mathAnswerInput.select()
    animateMathQuestion('is-wrong')
    return
  }
  mathScore++
  mathLevel++
  clearSound()
  mathStatusEl.textContent = 'CORRECT! NEXT LEVEL'
  mathAnswerInput.value = ''
  animateMathQuestion('is-correct')
  showMathQuestion()
  updateMathHud(Math.ceil(Math.max(0, 60000 - (performance.now() - mathStartedAt)) / 1000))
}

function updateFlappyHud() {
  flappyScoreEl.textContent = String(flappyScore).padStart(2, '0')
  if (flappyScore > flappyBest) {
    flappyBest = flappyScore
    flappyBestEl.textContent = String(flappyBest).padStart(2, '0')
    saveScore('sky-flap-best', flappyBest)
  }
}
function startFlappyGame() {
  getAudio()
  flappyActive = true
  flappyScore = 0
  flappyBird = { y: flappyHeight * .48, velocity: -315 }
  flappyPipes = []
  flappySpawnTimer = .85
  flappyStatusEl.textContent = 'FLYING'
  flappyScreen.classList.add('hidden')
  updateFlappyHud()
}
function endFlappyGame() {
  if (!flappyActive) return
  flappyActive = false
  breachSound()
  flappyTitle.textContent = 'FLIGHT OVER'
  flappyMessage.textContent = `You passed ${flappyScore} ${flappyScore === 1 ? 'gate' : 'gates'}. Tap start to fly again.`
  flappyStartButton.textContent = 'Fly Again'
  flappyStatusEl.textContent = 'READY TO RETRY'
  flappyScreen.classList.remove('hidden')
}
function flap() {
  if (!flappyActive) return
  flappyBird.velocity = -315
  tone(340, .09, 'sine', 510, .016)
}
function updateFlappy(dt: number) {
  if (!flappyActive) return
  const birdRadius = Math.max(14, Math.min(19, flappyWidth * .025))
  const pipeWidth = Math.max(66, flappyWidth * .09)
  const gap = Math.max(148, Math.min(190, flappyHeight * .34))
  const speed = 150 + Math.min(flappyScore * 4, 55)
  flappyBird.velocity += 890 * dt
  flappyBird.y += flappyBird.velocity * dt
  flappySpawnTimer -= dt
  if (flappySpawnTimer <= 0) {
    const pad = gap / 2 + 50
    flappyPipes.push({ x: flappyWidth + pipeWidth, gapY: randomInt(Math.ceil(pad), Math.floor(flappyHeight - pad)), counted: false })
    flappySpawnTimer = Math.max(1.12, 1.55 - flappyScore * .012)
  }
  for (const pipe of flappyPipes) {
    pipe.x -= speed * dt
    if (!pipe.counted && pipe.x + pipeWidth < flappyWidth * .28 - birdRadius) {
      pipe.counted = true
      flappyScore++
      clearSound()
      updateFlappyHud()
    }
  }
  flappyPipes = flappyPipes.filter((pipe) => pipe.x + pipeWidth > -8)
  const birdX = flappyWidth * .28
  const collided = flappyBird.y - birdRadius < 0 || flappyBird.y + birdRadius > flappyHeight || flappyPipes.some((pipe) => {
    const overlapsX = birdX + birdRadius > pipe.x && birdX - birdRadius < pipe.x + pipeWidth
    return overlapsX && (flappyBird.y - birdRadius < pipe.gapY - gap / 2 || flappyBird.y + birdRadius > pipe.gapY + gap / 2)
  })
  if (collided) endFlappyGame()
}
function drawFlappyCloud(x: number, y: number, size: number) {
  flappyCtx.beginPath()
  flappyCtx.arc(x, y, size * .32, Math.PI, 0)
  flappyCtx.arc(x + size * .32, y - size * .14, size * .38, Math.PI, 0)
  flappyCtx.arc(x + size * .7, y, size * .28, Math.PI, 0)
  flappyCtx.lineTo(x + size, y + size * .26)
  flappyCtx.lineTo(x, y + size * .26)
  flappyCtx.closePath()
  flappyCtx.fill()
}
function drawFlappy() {
  if (!flappyWidth || !flappyHeight) return
  const ctx = flappyCtx, birdX = flappyWidth * .28
  const birdRadius = Math.max(14, Math.min(19, flappyWidth * .025))
  const pipeWidth = Math.max(66, flappyWidth * .09)
  const gap = Math.max(148, Math.min(190, flappyHeight * .34))
  const sky = ctx.createLinearGradient(0, 0, 0, flappyHeight)
  sky.addColorStop(0, 'rgba(255, 237, 215, .22)')
  sky.addColorStop(.55, 'rgba(169, 197, 183, .16)')
  sky.addColorStop(1, 'rgba(56, 36, 22, .32)')
  ctx.clearRect(0, 0, flappyWidth, flappyHeight)
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, flappyWidth, flappyHeight)
  ctx.fillStyle = 'rgba(255, 255, 255, .11)'
  drawFlappyCloud(flappyWidth * .12, flappyHeight * .18, 90)
  drawFlappyCloud(flappyWidth * .67, flappyHeight * .31, 70)
  ctx.fillStyle = 'rgba(16, 9, 4, .18)'
  ctx.fillRect(0, flappyHeight - 19, flappyWidth, 19)
  for (const pipe of flappyPipes) {
    const upperHeight = pipe.gapY - gap / 2
    const lowerY = pipe.gapY + gap / 2
    ctx.fillStyle = '#596744'
    ctx.fillRect(pipe.x, 0, pipeWidth, upperHeight)
    ctx.fillRect(pipe.x, lowerY, pipeWidth, flappyHeight - lowerY)
    ctx.fillStyle = 'rgba(255, 237, 215, .24)'
    ctx.fillRect(pipe.x + 8, 0, 6, upperHeight)
    ctx.fillRect(pipe.x + 8, lowerY, 6, flappyHeight - lowerY)
    ctx.fillStyle = '#788658'
    ctx.fillRect(pipe.x - 7, upperHeight - 17, pipeWidth + 14, 17)
    ctx.fillRect(pipe.x - 7, lowerY, pipeWidth + 14, 17)
  }
  ctx.save()
  ctx.translate(birdX, flappyBird.y)
  ctx.rotate(Math.max(-.42, Math.min(.72, flappyBird.velocity / 620)))
  ctx.fillStyle = '#dc5000'
  ctx.beginPath(); ctx.arc(0, 0, birdRadius, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffedd7'
  ctx.beginPath(); ctx.ellipse(-birdRadius * .2, birdRadius * .25, birdRadius * .78, birdRadius * .42, -.35, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#382416'
  ctx.beginPath(); ctx.arc(birdRadius * .35, -birdRadius * .32, birdRadius * .15, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffcf75'
  ctx.beginPath(); ctx.moveTo(birdRadius * .8, 0); ctx.lineTo(birdRadius * 1.48, birdRadius * .18); ctx.lineTo(birdRadius * .82, birdRadius * .36); ctx.closePath(); ctx.fill()
  ctx.restore()
  if (flappyActive) {
    ctx.fillStyle = 'rgba(255, 237, 215, .92)'
    ctx.font = '500 38px Inter, ui-sans-serif, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(flappyScore), flappyWidth / 2, 62)
  }
}

// ── Coin Toss ──
function coinFlipSound() {
  const audio = getAudio(), now = audio.currentTime
  // Metallic ping
  const osc = audio.createOscillator(), gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, now)
  osc.frequency.exponentialRampToValueAtTime(2400, now + .06)
  osc.frequency.exponentialRampToValueAtTime(800, now + .15)
  gain.gain.setValueAtTime(.03, now)
  gain.gain.exponentialRampToValueAtTime(.001, now + .2)
  osc.connect(gain).connect(audio.destination)
  osc.start(now); osc.stop(now + .2)
  // Whoosh
  const dur = .35
  const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3)
  const noise = audio.createBufferSource()
  noise.buffer = buf
  const filter = audio.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 600
  const noiseGain = audio.createGain()
  noiseGain.gain.setValueAtTime(.015, now)
  noiseGain.gain.exponentialRampToValueAtTime(.001, now + dur)
  noise.connect(filter).connect(noiseGain).connect(audio.destination)
  noise.start(now)
}
function coinLandSound(won: boolean) {
  const audio = getAudio(), now = audio.currentTime
  if (won) {
    // Cheerful chime
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = audio.createOscillator(), gain = audio.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * .08)
      gain.gain.setValueAtTime(.025, now + i * .08)
      gain.gain.exponentialRampToValueAtTime(.001, now + i * .08 + .2)
      osc.connect(gain).connect(audio.destination)
      osc.start(now + i * .08); osc.stop(now + i * .08 + .22)
    })
  } else {
    // Dull thud
    tone(180, .25, 'sine', 80, .03)
  }
}
function updateCoinHud() {
  coinHeadsCountEl.textContent = String(coinHeadsCount)
  coinTailsCountEl.textContent = String(coinTailsCount)
  coinStreakEl.textContent = String(coinStreak)
  coinTotalEl.textContent = `Total flips: ${coinHeadsCount + coinTailsCount}`
  if (coinStreak > coinBestStreak) {
    coinBestStreak = coinStreak
    coinBestEl.textContent = String(coinBestStreak)
    saveScore('coin-toss-best', coinBestStreak)
  }
}
function selectCoinPick(side: CoinSide) {
  if (coinFlipping) return
  coinPick = side
  pickHeadsBtn.classList.toggle('is-selected', side === 'heads')
  pickTailsBtn.classList.toggle('is-selected', side === 'tails')
  coinStatusEl.textContent = `YOU PICKED ${side.toUpperCase()} — CLICK AGAIN TO FLIP`
}
function flipCoin() {
  if (coinFlipping || !coinPick) return
  coinFlipping = true
  getAudio()
  coinFlipSound()
  pickHeadsBtn.disabled = true
  pickTailsBtn.disabled = true
  coinResultEl.classList.remove('is-visible', 'is-win', 'is-loss')
  coinStatusEl.textContent = 'FLIPPING…'

  const result: CoinSide = Math.random() < .5 ? 'heads' : 'tails'

  // Reset animation
  coinBody.classList.remove('is-flipping', 'is-flipping-tails')
  void coinBody.offsetWidth
  coinBody.classList.add(result === 'heads' ? 'is-flipping' : 'is-flipping-tails')

  setTimeout(() => {
    coinFlipping = false
    pickHeadsBtn.disabled = false
    pickTailsBtn.disabled = false

    if (result === 'heads') coinHeadsCount++
    else coinTailsCount++

    const won = result === coinPick
    if (won) {
      coinStreak++
      coinLandSound(true)
      coinResultEl.textContent = `${result.toUpperCase()} — YOU WIN!`
      coinResultEl.classList.add('is-win')
      coinStatusEl.textContent = `🔥 STREAK: ${coinStreak}`
    } else {
      coinStreak = 0
      coinLandSound(false)
      coinResultEl.textContent = `${result.toUpperCase()} — YOU LOSE`
      coinResultEl.classList.add('is-loss')
      coinStatusEl.textContent = 'STREAK RESET — TRY AGAIN'
    }
    coinResultEl.classList.add('is-visible')
    updateCoinHud()
  }, 1150)
}

// ── Dice Roll ──
function diceRollSound() {
  const audio = getAudio(), now = audio.currentTime
  // Rattling rumble
  for (let i = 0; i < 4; i++) {
    const t = now + i * .08
    const dur = .12
    const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate)
    const data = buf.getChannelData(0)
    for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / data.length, 4)
    const noise = audio.createBufferSource()
    noise.buffer = buf
    const filter = audio.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500 + i * 200
    const g = audio.createGain()
    g.gain.setValueAtTime(.02, t)
    g.gain.exponentialRampToValueAtTime(.001, t + dur)
    noise.connect(filter).connect(g).connect(audio.destination)
    noise.start(t)
  }
  // Tonal knock
  const osc = audio.createOscillator(), gain = audio.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(220, now)
  osc.frequency.exponentialRampToValueAtTime(110, now + .25)
  gain.gain.setValueAtTime(.018, now)
  gain.gain.exponentialRampToValueAtTime(.001, now + .3)
  osc.connect(gain).connect(audio.destination)
  osc.start(now); osc.stop(now + .32)
}
function diceLandSound() {
  const audio = getAudio(), now = audio.currentTime
  // Solid thud
  const osc = audio.createOscillator(), gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(160, now)
  osc.frequency.exponentialRampToValueAtTime(60, now + .12)
  gain.gain.setValueAtTime(.05, now)
  gain.gain.exponentialRampToValueAtTime(.001, now + .15)
  osc.connect(gain).connect(audio.destination)
  osc.start(now); osc.stop(now + .16)
  // Impact noise
  const dur = .08
  const buf = audio.createBuffer(1, Math.floor(audio.sampleRate * dur), audio.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 8)
  const noise = audio.createBufferSource()
  noise.buffer = buf
  const noiseGain = audio.createGain()
  noiseGain.gain.setValueAtTime(.025, now)
  noiseGain.gain.exponentialRampToValueAtTime(.001, now + dur)
  noise.connect(noiseGain).connect(audio.destination)
  noise.start(now)
}
function updateDiceHud() {
  diceRollsCountEl.textContent = String(diceRollCount)
}
function addDiceHistoryItem(value: number) {
  diceHistory.push(value)
  if (diceHistory.length > 10) diceHistory.shift()
  // Rebuild history display
  const label = diceHistoryEl.querySelector('.dice-history-label')!
  diceHistoryEl.innerHTML = ''
  diceHistoryEl.appendChild(label)
  const pips = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
  for (const v of diceHistory) {
    const el = document.createElement('span')
    el.className = 'dice-mini'
    el.textContent = pips[v]
    diceHistoryEl.appendChild(el)
  }
}
function rollDice() {
  if (diceRolling) return
  diceRolling = true
  getAudio()
  diceRollSound()
  diceRollBtn.disabled = true
  diceStatusEl.textContent = 'ROLLING…'
  diceValueEl.textContent = ''

  const result = randomInt(1, 6)

  // Reset and apply animation
  diceCube.className = 'dice-cube'
  void diceCube.offsetWidth
  const animClass = result === 1 ? 'is-rolling' : `is-rolling-${result}`
  diceCube.classList.add(animClass)

  setTimeout(() => {
    diceRolling = false
    diceRollBtn.disabled = false
    diceRollCount++
    diceLandSound()

    diceValueEl.textContent = `YOU ROLLED A ${result}`
    diceLastEl.textContent = String(result)

    if (result === 6) {
      diceSixStreak++
      clearSound()
      diceStatusEl.textContent = `🔥 SIX STREAK: ${diceSixStreak}`
      if (diceSixStreak > diceBestSixStreak) {
        diceBestSixStreak = diceSixStreak
        diceBestEl.textContent = String(diceBestSixStreak)
        saveScore('dice-roll-best', diceBestSixStreak)
      }
    } else {
      diceSixStreak = 0
      diceStatusEl.textContent = result >= 4 ? 'NICE ROLL!' : 'BETTER LUCK NEXT TIME'
    }

    diceTotalStatusEl.textContent = `${diceRollCount} ROLLS`
    updateDiceHud()
    addDiceHistoryItem(result)
  }, 1250)
}

function selectGame(game: 'word' | 'math' | 'flappy' | 'coin' | 'dice') {
  if (selectedGame === game) {
    if (active && !paused) togglePause()
    wordGame.classList.add('is-hidden')
    mathGame.classList.add('is-hidden')
    flappyGame.classList.add('is-hidden')
    coinGame.classList.add('is-hidden')
    diceGame.classList.add('is-hidden')
    gameTabs.forEach((tab) => {
      tab.classList.remove('is-active')
      tab.setAttribute('aria-pressed', 'false')
    })
    document.querySelector('.game-container')?.classList.add('is-empty')
    selectedGame = null
    return
  }

  const showWord = game === 'word'
  const showMath = game === 'math'
  const showFlappy = game === 'flappy'
  const showCoin = game === 'coin'
  const showDice = game === 'dice'
  if (!showWord && active && !paused) togglePause()
  wordGame.classList.toggle('is-hidden', !showWord)
  mathGame.classList.toggle('is-hidden', !showMath)
  flappyGame.classList.toggle('is-hidden', !showFlappy)
  coinGame.classList.toggle('is-hidden', !showCoin)
  diceGame.classList.toggle('is-hidden', !showDice)
  gameTabs.forEach((tab) => {
    const selected = tab.dataset.game === game
    tab.classList.toggle('is-active', selected)
    tab.setAttribute('aria-pressed', String(selected))
  })
  document.querySelector('.game-container')?.classList.remove('is-empty')
  selectedGame = game
  if (showWord) queueResize()
  if (showMath && mathActive) mathAnswerInput.focus()
  if (showFlappy) { requestAnimationFrame(() => { requestAnimationFrame(() => { resizeFlappy(); drawFlappy() }) }) }
}
function frame(now: number) { const dt = Math.min((now - lastFrame) / 1000 || 0, .05); lastFrame = now; if (selectedGame === 'word') { update(dt); draw() }; if (selectedGame === 'flappy') { updateFlappy(dt); drawFlappy() }; updateMathTimer(now); requestAnimationFrame(frame) }

input.addEventListener('input', checkInput)
input.addEventListener('keydown', (event) => { if (event.key === 'Escape') togglePause(); if (event.key === ' ') event.preventDefault() })
window.addEventListener('keydown', (event) => { if (selectedGame === 'word' && (event.key === 'p' || event.key === 'Escape') && document.activeElement !== input) togglePause() })
startButton.addEventListener('click', () => active && paused ? togglePause() : startGame())
pauseButton.addEventListener('click', togglePause)
mathAnswerForm.addEventListener('submit', (event) => { event.preventDefault(); submitMathAnswer() })
mathStartButton.addEventListener('click', startMathGame)
flappyStartButton.addEventListener('click', startFlappyGame)
flappyCanvas.addEventListener('pointerdown', (event) => { event.preventDefault(); flap() })
pickHeadsBtn.addEventListener('click', () => {
  if (coinPick === 'heads') flipCoin()
  else selectCoinPick('heads')
})
pickTailsBtn.addEventListener('click', () => {
  if (coinPick === 'tails') flipCoin()
  else selectCoinPick('tails')
})
diceRollBtn.addEventListener('click', rollDice)
gameTabs.forEach((tab) => tab.addEventListener('click', () => {
  const game = tab.dataset.game as 'word' | 'math' | 'flappy' | 'coin' | 'dice'
  if (game === 'word' || game === 'math' || game === 'flappy' || game === 'coin' || game === 'dice') selectGame(game)
}))
window.addEventListener('keydown', (event) => {
  if (selectedGame === 'flappy' && event.code === 'Space') { event.preventDefault(); flap() }
  if (selectedGame === 'dice' && event.code === 'Space') { event.preventDefault(); rollDice() }
})
window.addEventListener('resize', () => { queueResize(); queueFlappyResize() })
resize(); resizeFlappy(); updateHud(); updateWaveInfo(); updateFlappyHud(); requestAnimationFrame(frame)
