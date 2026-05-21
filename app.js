// Faithful Passages — app.js

// Daily verses
const verses = [
  { text: '"Come to me, all you who are weary and burdened, and I will give you rest."', ref: '— Matthew 11:28' },
  { text: '"The Lord is my shepherd; I shall not want."', ref: '— Psalm 23:1' },
  { text: '"For God so loved the world that he gave his one and only Son."', ref: '— John 3:16' },
  { text: '"I can do all this through him who gives me strength."', ref: '— Philippians 4:13' },
  { text: '"Be still, and know that I am God."', ref: '— Psalm 46:10' },
  { text: '"The steadfast love of the Lord never ceases; his mercies never come to an end."', ref: '— Lamentations 3:22' },
  { text: '"Trust in the Lord with all your heart and lean not on your own understanding."', ref: '— Proverbs 3:5' },
];

function setDailyVerse() {
  const el = document.getElementById('verseBlock');
  if (!el) return;
  const day = Math.floor(Date.now() / 86400000);
  const v = verses[day % verses.length];
  el.innerHTML = v.text + '<span class="verse-ref">' + v.ref + '</span>';
}

// Email signup
function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✓ Check your inbox!';
  btn.style.background = '#7A9E7E';
  btn.disabled = true;
  // TODO: wire up to email provider (ConvertKit / Mailchimp / etc.)
}

// Audio playback for prayers
const prayerAudio = {};
function playPrayer(id) {
  if (prayerAudio[id]) {
    prayerAudio[id].pause();
    delete prayerAudio[id];
    return;
  }
  // Audio files will live at /audio/prayer-{id}.mp3
  const audio = new Audio('/audio/prayer-' + id + '.mp3');
  audio.play().catch(() => {
    alert('Audio coming soon for this prayer.');
  });
  prayerAudio[id] = audio;
}

// Audio playback for songs
const songAudio = {};
function playSong(id) {
  if (songAudio[id]) {
    songAudio[id].pause();
    delete songAudio[id];
    return;
  }
  const audio = new Audio('/audio/song-' + id + '.mp3');
  audio.play().catch(() => {
    alert('Audio coming soon for this song.');
  });
  songAudio[id] = audio;
}

document.addEventListener('DOMContentLoaded', () => {
  setDailyVerse();
});
