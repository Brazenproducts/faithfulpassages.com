// Faithful Passages — app.js

// ─────────────────────────────────────────────
// DAILY VERSE ROTATION
// ─────────────────────────────────────────────
const verses = [
  { text: '"Come to me, all you who are weary and burdened, and I will give you rest."', ref: '— Matthew 11:28' },
  { text: '"The Lord is my shepherd; I shall not want."', ref: '— Psalm 23:1' },
  { text: '"For God so loved the world that he gave his one and only Son."', ref: '— John 3:16' },
  { text: '"I can do all this through him who gives me strength."', ref: '— Philippians 4:13' },
  { text: '"Be still, and know that I am God."', ref: '— Psalm 46:10' },
  { text: '"The steadfast love of the Lord never ceases; his mercies never come to an end."', ref: '— Lamentations 3:22' },
  { text: '"Trust in the Lord with all your heart and lean not on your own understanding."', ref: '— Proverbs 3:5' },
  { text: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."', ref: '— Jeremiah 29:11' },
  { text: '"The Lord is close to the brokenhearted a those who are crushed in spirit."', ref: '— Psalm 34:18' },
  { text: '"Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God."', ref: '— Philippians 4:6' },
  { text: '"Even youths grow tired and weary, but those who hope in the Lord will renew their strength."', ref: '— Isaiah 40:31' },
  { text: '"Cast all your anxiety on him because he cares for you."', ref: '— 1 Peter 5:7' },
  { text: '"The Lord your God is with you, the Mighty Warrior who saves."', ref: '— Zephaniah 3:17' },
  { text: '"My grace is sufficient for you, for my power is made perfect in weakness."', ref: '— 2 Corinthians 12:9' },
];

function setDailyVerse() {
  const el = document.getElementById('verseBlock');
  if (!el) return;
  const day = Math.floor(Date.now() / 86400000);
  const v = verses[day % verses.length];
  el.innerHTML = v.text + '<span class="verse-ref">' + v.ref + '</span>';
}

// ─────────────────────────────────────────────
// EMAIL SIGNUP
// ─────────────────────────────────────────────
function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✓ Check your inbox!';
  btn.style.background = '#7A9E7E';
  btn.disabled = true;
  // TODO: wire up to email provider (ConvertKit / Mailchimp / etc.)
}

// ─────────────────────────────────────────────
// ACCESSIBLE AUDIO ENGINE (Web Speech API)
// Works on all modern browsers — no MP3s needed.
// Reads title + full text aloud with a natural voice.
// ─────────────────────────────────────────────

let activeSpeech = null;       // currently speaking utterance
let activeBtn = null;          // currently active button element
let activeId = null;           // id of currently playing item

function stopActiveSpeech() {
  if (activeSpeech) {
    window.speechSynthesis.cancel();
    activeSpeech = null;
  }
  if (activeBtn) {
    activeBtn.setAttribute('aria-pressed', 'false');
    activeBtn.innerHTML = '<span aria-hidden="true">▶</span> Listen';
    activeBtn.classList.remove('btn-audio--playing');
    activeBtn = null;
  }
  activeId = null;
}

function speakText(id, title, text, btn) {
  // If same item is playing, stop it
  if (activeId === id) {
    stopActiveSpeech();
    return;
  }

  // Stop anything currently playing
  stopActiveSpeech();

  if (!window.speechSynthesis) {
    alert('Audio is not supported in your browser. Please try Chrome, Edge, or Safari.');
    return;
  }

  // Build the full text to speak: title first, then content
  const fullText = title + '. ' + text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

  const utterance = new SpeechSynthesisUtterance(fullText);

  // Pick the best available voice — prefer a warm English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Moira') ||
      v.name.includes('Google US English') ||
      v.name.includes('Microsoft Aria') ||
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Alex')
    )
  );
  if (preferred) utterance.voice = preferred;

  utterance.rate = 0.88;   // slightly slower — easier to follow
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';

  // Update button state
  btn.setAttribute('aria-pressed', 'true');
  btn.innerHTML = '<span aria-hidden="true">⏸</span> Pause';
  btn.classList.add('btn-audio--playing');
  activeBtn = btn;
  activeId = id;
  activeSpeech = utterance;

  utterance.onend = () => {
    stopActiveSpeech();
  };
  utterance.onerror = () => {
    stopActiveSpeech();
  };

  window.speechSynthesis.speak(utterance);
}

// ─────────────────────────────────────────────
// PRAYER PLAYBACK
// Called from: onclick="playPrayer(this, 'anxiety')"
// The card must have data-prayer-title and data-prayer-text attributes,
// OR we walk up the DOM to find .prayer-card and extract them.
// ─────────────────────────────────────────────
function playPrayer(btn, id) {
  // Walk up to find the parent prayer card
  const card = btn.closest('.prayer-card');
  if (!card) { speakText(id, 'Prayer', '', btn); return; }

  const titleEl = card.querySelector('h3');
  const textEl = card.querySelector('p');
  const title = titleEl ? titleEl.textContent.trim() : 'Prayer';
  const text = textEl ? textEl.textContent.trim() : '';

  speakText(id, title, text, btn);
}

// ─────────────────────────────────────────────
// SERMON PLAYBACK
// Called from: onclick="playSermon(this, 'sermon-id')"
// Reads the full sermon text from the nearest .sermon-body element.
// ─────────────────────────────────────────────
function playSermon(btn, id) {
  const card = btn.closest('.sermon-card') || btn.closest('article') || btn.closest('section');
  if (!card) { speakText(id, 'Sermon', '', btn); return; }

  const titleEl = card.querySelector('h1, h2, h3');
  const bodyEl = card.querySelector('.sermon-body');
  const title = titleEl ? titleEl.textContent.trim() : 'Daily Sermon';
  const text = bodyEl ? bodyEl.textContent.trim() : '';

  speakText(id, title, text, btn);
}

// ─────────────────────────────────────────────
// SONG PLAYBACK (lyrics read-along)
// ─────────────────────────────────────────────
function playSong(btn, id) {
  const card = btn.closest('.song-card');
  if (!card) { speakText(id, 'Song', '', btn); return; }

  const titleEl = card.querySelector('h3');
  const lyricsEl = card.querySelector('.song-lyrics');
  const title = titleEl ? titleEl.textContent.trim() : 'Worship Song';
  const text = lyricsEl ? lyricsEl.textContent.trim() : '';

  speakText(id, title, text, btn);
}

// Voices may load async — re-try voice selection when they arrive
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices are now ready; no action needed unless something is mid-speech
  };
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDailyVerse();

  // Stop speech if user navigates away
  window.addEventListener('beforeunload', () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
  });

  // Stop speech if page loses visibility (tab switch)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.speechSynthesis && window.speechSynthesis.cancel();
      stopActiveSpeech();
    }
  });
});
