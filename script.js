// ── intersection observer: fade slides in ──
const slides = document.querySelectorAll('.slide');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
slides.forEach(s => io.observe(s));

// ── audio player ──
const audio     = document.getElementById('audio');
const playBtn   = document.getElementById('playBtn');
const iconPlay  = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const progFill  = document.getElementById('progFill');
const tCur      = document.getElementById('tCur');
const tTot      = document.getElementById('tTot');
const volSlider = document.getElementById('volSlider');
const notice    = document.getElementById('notice');

audio.volume = 0.8;

function fmt(s) {
  const m = Math.floor(s / 60);
  return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

function setPlaying(playing) {
  iconPlay.style.display  = playing ? 'none' : '';
  iconPause.style.display = playing ? ''     : 'none';
}

// ── autoplay setelah interaksi pertama ──
function startOnFirstInteraction() {
  audio.play().then(() => {
    setPlaying(true);
    notice.classList.add('hidden');
  }).catch(() => {});
  document.removeEventListener('click', startOnFirstInteraction);
  document.removeEventListener('keydown', startOnFirstInteraction);
  document.removeEventListener('scroll', startOnFirstInteraction);
}

document.addEventListener('click', startOnFirstInteraction);
document.addEventListener('keydown', startOnFirstInteraction);
document.addEventListener('scroll', startOnFirstInteraction, { passive: true });

// ── tombol play/pause ──
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    setPlaying(true);
    notice.classList.add('hidden');
  } else {
    audio.pause();
    setPlaying(false);
  }
});

// ── progress bar & waktu ──
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  progFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
  tCur.textContent = fmt(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  tTot.textContent = fmt(audio.duration);
});

audio.addEventListener('ended', () => setPlaying(false));

// ── volume ──
volSlider.addEventListener('input', () => {
  audio.volume = volSlider.value;
});
