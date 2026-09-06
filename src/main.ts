import './style.css'

type IncomingWord = { word: string; x: number; y: number; speed: number }
type Star = { x: number; y: number; speed: number; size: number; color: string }
type MathOperation = '+' | '−' | '×'
type MathQuestion = { left: number; right: number; operation: MathOperation; answer: number; key: string }

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
    <nav class="game-switcher" aria-label="Choose a game">
      <button class="game-tab is-active" type="button" data-game="word" aria-controls="word-game" aria-pressed="true">Word Siege</button>
      <button class="game-tab" type="button" data-game="math" aria-controls="math-game" aria-pressed="false">Math Rush</button>
    </nav>
  <section class="game-card" id="word-game" aria-label="Word Siege typing game">
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
  </section></main>`

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
const gameTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.game-tab'))
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

let width = 0, height = 0, scale = 1, lastFrame = 0
let active = false, paused = false, wave = 1, waveSize = 1, spawned = 0, cleared = 0, deckIndex = 0, spawnTimer = 0, nextWaveTimer = 0
let deck: string[] = [], incoming: IncomingWord[] = [], stars: Star[] = []
let best = getStoredScore('word-siege-best')
let audioContext: AudioContext | undefined
let mathActive = false, mathLevel = 1, mathScore = 0, mathStartedAt = 0, mathQuestion: MathQuestion | undefined
let background = ctx.createLinearGradient(0, 0, 0, 1)
let selectedGame: 'word' | 'math' = 'word'
let resizeFrame = 0, lastTypeSoundAt = 0
const usedMathQuestions = new Set<string>()
let mathBest = getStoredScore('math-rush-best')
bestEl.textContent = String(best).padStart(3, '0')
mathBestEl.textContent = String(mathBest).padStart(2, '0')

function shuffle<T>(items: T[]) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }
function getStoredScore(key: string) { try { const value = Number(localStorage.getItem(key)); return Number.isFinite(value) && value >= 0 ? value : 0 } catch { return 0 } }
function saveScore(key: string, value: number) { try { localStorage.setItem(key, String(value)) } catch { /* Scores remain available for this run when storage is blocked. */ } }
function makeStar(randomY = false): Star { const alpha = .12 + Math.random() * .42; return { x: Math.random() * width, y: randomY ? Math.random() * height : -5, speed: 10 + Math.random() * 22, size: .5 + Math.random() * 1.4, color: `rgba(255, 237, 215, ${alpha})` } }
function resize() { const rect = canvas.parentElement!.getBoundingClientRect(); scale = Math.min(devicePixelRatio || 1, 1.5); width = Math.max(320, rect.width); height = Math.max(580, Math.min(width * .9, innerHeight * .8)); canvas.width = width * scale; canvas.height = height * scale; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; ctx.setTransform(scale, 0, 0, scale, 0, 0); background = ctx.createLinearGradient(0, 0, 0, height); background.addColorStop(0, 'rgba(255, 255, 255, .08)'); background.addColorStop(.62, 'rgba(16, 9, 4, .12)'); background.addColorStop(1, 'rgba(10, 5, 3, .22)'); stars = Array.from({ length: Math.ceil(width / 16) }, () => makeStar(true)) }
function queueResize() { if (selectedGame !== 'word' || resizeFrame) return; resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resize() }) }
function getAudio() { audioContext ??= new AudioContext(); if (audioContext.state === 'suspended') void audioContext.resume(); return audioContext }
function tone(start: number, duration: number, type: OscillatorType, end: number, volume = .04) { const audio = getAudio(), now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain(); osc.type = type; osc.frequency.setValueAtTime(start, now); osc.frequency.exponentialRampToValueAtTime(end, now + duration); gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(.001, now + duration); osc.connect(gain).connect(audio.destination); osc.start(now); osc.stop(now + duration) }
function typeSound() { const now = performance.now(); if (now - lastTypeSoundAt < 35) return; lastTypeSoundAt = now; tone(420 + Math.random() * 80, .035, 'square', 560, .018) }
function clearSound() { tone(520, .12, 'triangle', 1040, .05) }
function breachSound() { tone(170, .45, 'sawtooth', 48, .07) }
function updateHud() { waveEl.textContent = String(wave).padStart(2, '0'); clearedEl.textContent = `${String(cleared).padStart(3, '0')} / ${totalWords}`; if (cleared > best) { best = cleared; bestEl.textContent = String(best).padStart(3, '0'); saveScore('word-siege-best', best) } }
function updateWaveInfo() { waveInfo.textContent = `Wave ${String(wave).padStart(2, '0')} · ${waveSize} word${waveSize === 1 ? '' : 's'} · ${Math.min(wave, 6)} at a time` }
function beginWave() { waveSize = wave === 1 ? 1 : Math.min(wave * 10, wordBank.length - deckIndex); spawned = 0; spawnTimer = .45; nextWaveTimer = 0; updateHud(); updateWaveInfo(); statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}` }
function startGame() { getAudio(); deck = shuffle(wordBank); deckIndex = 0; wave = 1; cleared = 0; incoming = []; active = true; paused = false; input.disabled = false; input.value = ''; screen.classList.add('hidden'); pauseButton.textContent = 'Ⅱ'; pauseButton.setAttribute('aria-pressed', 'false'); pauseButton.setAttribute('aria-label', 'Pause game'); beginWave(); input.focus() }
function endGame(victory = false) { active = false; input.disabled = true; title.textContent = victory ? 'ALL CLEAR' : 'SHIELD BREACHED'; message.textContent = victory ? `You cleared all ${totalWords} words.` : `You cleared ${cleared} of ${totalWords} words.`; startButton.textContent = victory ? 'New Run' : 'Try Again'; screen.classList.remove('hidden'); statusEl.textContent = victory ? 'VICTORY' : 'GAME OVER' }
function togglePause() { if (!active) return; paused = !paused; pauseButton.textContent = paused ? '▶' : 'Ⅱ'; pauseButton.setAttribute('aria-pressed', String(paused)); pauseButton.setAttribute('aria-label', paused ? 'Resume game' : 'Pause game'); if (paused) { title.textContent = 'PAUSED'; message.textContent = 'Your shield is holding.'; startButton.textContent = 'Resume'; screen.classList.remove('hidden'); input.blur() } else { screen.classList.add('hidden'); input.focus() } }
function spawnWord() { const word = deck[deckIndex++]; const fontSize = width < 520 ? 18 : 22; ctx.font = `500 ${fontSize}px Inter, ui-sans-serif, sans-serif`; const margin = Math.min(width * .15, ctx.measureText(word.toUpperCase()).width / 2 + 16); incoming.push({ word, x: margin + Math.random() * Math.max(1, width - margin * 2), y: -24, speed: 20 + wave * 5 + Math.random() * 11 }) ; spawned++ }
function targetFor(text: string) { let target: IncomingWord | undefined; for (const item of incoming) if (item.word.startsWith(text) && (!target || item.y > target.y)) target = item; return target }
function checkInput() { if (!active || paused) return; const typed = input.value.toLowerCase().replace(/[^a-z]/g, ''); if (typed !== input.value) input.value = typed; if (!typed) { statusEl.textContent = `WAVE ${String(wave).padStart(2, '0')}`; return }; typeSound(); const target = targetFor(typed); if (!target) { input.value = ''; statusEl.textContent = 'NO MATCH'; return }; statusEl.textContent = `${target.word.length - typed.length} LEFT`; if (typed === target.word) { incoming.splice(incoming.indexOf(target), 1); input.value = ''; cleared++; clearSound(); updateHud(); statusEl.textContent = 'WORD CLEARED' } }
function update(dt: number) { if (!active || paused) return; for (const star of stars) { star.y += star.speed * dt; if (star.y > height) Object.assign(star, makeStar()) }; if (nextWaveTimer > 0) { nextWaveTimer -= dt; if (nextWaveTimer <= 0) { wave++; beginWave() }; return }; const limit = Math.min(wave, 6); spawnTimer -= dt; if (spawned < waveSize && incoming.length < limit && spawnTimer <= 0) { spawnWord(); spawnTimer = Math.max(.4, 1.35 - wave * .06) }; for (const item of incoming) item.y += item.speed * dt; if (incoming.some((item) => item.y > height - 150)) { breachSound(); endGame(); return }; if (cleared === wordBank.length) { endGame(true); return }; if (spawned === waveSize && incoming.length === 0) { nextWaveTimer = 1.1; statusEl.textContent = 'WAVE CLEARED' } }
function drawWord(item: IncomingWord) { const typed = input.value; const fontSize = width < 520 ? 18 : 22; ctx.font = `500 ${fontSize}px Inter, ui-sans-serif, sans-serif`; ctx.textAlign = 'center'; const match = typed && item.word.startsWith(typed); ctx.shadowBlur = 0; ctx.fillStyle = match ? '#ffedd7' : '#dc5000'; ctx.fillText(item.word.toUpperCase(), item.x, item.y); if (match) { const left = ctx.measureText(item.word.slice(0, typed.length).toUpperCase()).width; const total = ctx.measureText(item.word.toUpperCase()).width; ctx.strokeStyle = '#ffedd7'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(item.x - total / 2, item.y + 7); ctx.lineTo(item.x - total / 2 + left, item.y + 7); ctx.stroke(); ctx.setLineDash([]) } }
function draw() { ctx.clearRect(0, 0, width, height); ctx.fillStyle = background; ctx.fillRect(0, 0, width, height); for (const star of stars) { ctx.fillStyle = star.color; ctx.fillRect(star.x, star.y, star.size, star.size) }; const shieldY = height - 108; ctx.strokeStyle = 'rgba(64, 55, 46, 1)'; ctx.shadowBlur = 0; ctx.lineWidth = 1; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.arc(width / 2, shieldY + 58, width * .37, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#ffedd7'; ctx.font = '500 12px Inter, ui-sans-serif, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('SHIELD LINE', width / 2, height - 70); incoming.forEach(drawWord) }

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
function selectGame(game: 'word' | 'math') {
  const showMath = game === 'math'
  if (showMath && active && !paused) togglePause()
  wordGame.classList.toggle('is-hidden', showMath)
  mathGame.classList.toggle('is-hidden', !showMath)
  gameTabs.forEach((tab) => {
    const selected = tab.dataset.game === game
    tab.classList.toggle('is-active', selected)
    tab.setAttribute('aria-pressed', String(selected))
  })
  selectedGame = game
  if (!showMath) queueResize()
  if (showMath && mathActive) mathAnswerInput.focus()
}
function frame(now: number) { const dt = Math.min((now - lastFrame) / 1000 || 0, .05); lastFrame = now; if (selectedGame === 'word') { update(dt); draw() }; updateMathTimer(now); requestAnimationFrame(frame) }

input.addEventListener('input', checkInput)
input.addEventListener('keydown', (event) => { if (event.key === 'Escape') togglePause(); if (event.key === ' ') event.preventDefault() })
window.addEventListener('keydown', (event) => { if (selectedGame === 'word' && (event.key === 'p' || event.key === 'Escape') && document.activeElement !== input) togglePause() })
startButton.addEventListener('click', () => active && paused ? togglePause() : startGame())
pauseButton.addEventListener('click', togglePause)
mathAnswerForm.addEventListener('submit', (event) => { event.preventDefault(); submitMathAnswer() })
mathStartButton.addEventListener('click', startMathGame)
gameTabs.forEach((tab) => tab.addEventListener('click', () => selectGame(tab.dataset.game === 'math' ? 'math' : 'word')))
window.addEventListener('resize', queueResize)
resize(); updateHud(); updateWaveInfo(); requestAnimationFrame(frame)
