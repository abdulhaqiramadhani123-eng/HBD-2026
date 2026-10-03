/**
 * ==========================================================================
 * INTERACTIVE BIRTHDAY GREETING - JAVASCRIPT LOGIC
 * Features:
 *  1. Floating Hearts & Flower Petals background animation
 *  2. Sweet Music Box (Web Audio API Synthesizer - Happy Birthday melody)
 *  3. Interactive Landing Page transition
 *  4. Interactive Cake with blowable candle flame & canvas-confetti
 *  5. Greeting Card interactions & personalization
 * ==========================================================================
 */

// Global State
const appState = {
  isMusicPlaying: false,
  isCandleLit: true,
  recipientName: "Sahabat Terbaikku 💕",
  audioCtx: null,
  musicTimer: null,
  musicNoteIndex: 0,
  pageTransitionTimer: null, // [PENYEMPURNAAN] Tambahan state untuk mengontrol timer pindah halaman
};

// DOM Elements
const musicBtn = document.getElementById("musicBtn");
const musicStatusText = document.getElementById("musicStatusText");
const heroSection = document.getElementById("heroSection");
const experienceWrapper = document.getElementById("experienceWrapper");
const openSurpriseBtn = document.getElementById("openSurpriseBtn");
const giftBoxOpener = document.getElementById("giftBoxOpener");
const cakeCard = document.getElementById("cakeCard");
const gallerySection = document.getElementById("gallerySection");
const continueToLetterBtn = document.getElementById("continueToLetterBtn");
const greetingSection = document.getElementById("greetingSection");

const candleWrapper = document.getElementById("candleWrapper");
const cakeStage = document.getElementById("cakeStage");
const wishBanner = document.getElementById("wishBanner");

const recipientNameEl = document.getElementById("recipientName");
const editNameBtn = document.getElementById("editNameBtn");
const hugBtn = document.getElementById("hugBtn");
const miniCards = document.querySelectorAll(".mini-feature-item");

/* ==========================================================================
   1. FLOATING PARTICLES (HEARTS & BLOSSOMS)
   ========================================================================== */
const particlesContainer = document.getElementById("particles-container");
const particleIcons = ["🌸", "🌷", "💖", "💕", "✨", "💐", "💗", "🎀", "⭐"];

function createFloatingParticle() {
  if (!particlesContainer) return;

  const particle = document.createElement("div");
  particle.className = "floating-particle";
  particle.textContent =
    particleIcons[Math.floor(Math.random() * particleIcons.length)];

  // Random horizontal positioning and size
  const startX = Math.random() * 100;
  const size = Math.floor(Math.random() * 16) + 14; // 14px to 30px
  const duration = (Math.random() * 4 + 6).toFixed(1); // 6s to 10s
  const opacity = (Math.random() * 0.4 + 0.5).toFixed(2); // 0.5 to 0.9

  particle.style.left = `${startX}vw`;
  particle.style.fontSize = `${size}px`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.opacity = opacity;

  particlesContainer.appendChild(particle);

  // Clean up when animation finishes to prevent memory leak
  particle.addEventListener("animationend", () => {
    particle.remove();
  });
}

// [PENYEMPURNAAN] Optimasi Performa dengan Page Visibility API
let particleInterval = setInterval(createFloatingParticle, 700);

// Hentikan partikel saat tab tidak aktif (user pindah tab), jalankan lagi saat tab aktif
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(particleInterval);
  } else {
    particleInterval = setInterval(createFloatingParticle, 700);
  }
});

// Seed initial particles
for (let i = 0; i < 8; i++) {
  setTimeout(createFloatingParticle, i * 250);
}

/* ==========================================================================
   2. WEB AUDIO API SYNTHESIZER (MUSIC BOX - HAPPY BIRTHDAY MELODY)
   ========================================================================== */
// Notes frequencies in Hz (Gentle Music Box / Kalimba Tuning)
const NOTE_FREQS = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
};

// "Happy Birthday" melody score (Note + duration in beats)
const birthdayScore = [
  { note: "G4", duration: 0.75 },
  { note: "G4", duration: 0.25 },
  { note: "A4", duration: 1.0 },
  { note: "G4", duration: 1.0 },
  { note: "C5", duration: 1.0 },
  { note: "B4", duration: 2.0 },
  { note: "G4", duration: 0.75 },
  { note: "G4", duration: 0.25 },
  { note: "A4", duration: 1.0 },
  { note: "G4", duration: 1.0 },
  { note: "D5", duration: 1.0 },
  { note: "C5", duration: 2.0 },
  { note: "G4", duration: 0.75 },
  { note: "G4", duration: 0.25 },
  { note: "G5", duration: 1.0 },
  { note: "E5", duration: 1.0 },
  { note: "C5", duration: 1.0 },
  { note: "B4", duration: 1.0 },
  { note: "A4", duration: 1.5 },
  { note: "F5", duration: 0.75 },
  { note: "F5", duration: 0.25 },
  { note: "E5", duration: 1.0 },
  { note: "C5", duration: 1.0 },
  { note: "D5", duration: 1.0 },
  { note: "C5", duration: 2.5 },
];

function initAudioContext() {
  if (!appState.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      appState.audioCtx = new AudioContextClass();
    }
  }
  if (appState.audioCtx && appState.audioCtx.state === "suspended") {
    appState.audioCtx.resume();
  }
}

// Plays a gentle chime bell tone
function playBellTone(freq, durationSec = 1.0) {
  if (!appState.audioCtx) return;
  const ctx = appState.audioCtx;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Gentle sine wave with soft bell harmonics
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  // Soft envelope (chime decay)
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  // Gentle low-pass filter to sound warm and mellow
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, now);

  osc.connect(gain);
  gain.connect(filter);
  filter.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec);
}

// Sequence player for background music box
function stepMusicBox() {
  if (!appState.isMusicPlaying) return;

  const currentItem = birthdayScore[appState.musicNoteIndex];
  if (currentItem && NOTE_FREQS[currentItem.note]) {
    playBellTone(NOTE_FREQS[currentItem.note], currentItem.duration * 0.7);
  }

  // Calculate delay before next note (tempo ~ 1 beat = 480ms)
  const beatDurationMs = 480;
  const nextDelay = (currentItem ? currentItem.duration : 1.0) * beatDurationMs;

  appState.musicNoteIndex =
    (appState.musicNoteIndex + 1) % birthdayScore.length;
  appState.musicTimer = setTimeout(stepMusicBox, nextDelay);
}

function startMusic() {
  initAudioContext();
  appState.isMusicPlaying = true;
  musicBtn.classList.add("playing");
  musicStatusText.textContent = "Musik: Putar";
  clearTimeout(appState.musicTimer);
  stepMusicBox();
}

function stopMusic() {
  appState.isMusicPlaying = false;
  musicBtn.classList.remove("playing");
  musicStatusText.textContent = "Musik: Jeda";
  clearTimeout(appState.musicTimer);
}

function toggleMusic() {
  if (appState.isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

if (musicBtn) {
  musicBtn.addEventListener("click", toggleMusic);
}

/* ==========================================================================
   3. LANDING PAGE INTERACTION (FEATURE 3a)
   ========================================================================== */
function showPage(page) {
  const pages = [heroSection, cakeCard, gallerySection, greetingSection].filter(
    Boolean,
  );

  // [PENYEMPURNAAN] Logika transisi yang memanfaatkan 'page-leaving' dari CSS Anda
  pages.forEach((el) => {
    if (el.classList.contains("page-active")) {
      el.classList.remove("page-active");
      el.classList.add("page-leaving"); // Geser ke kiri dengan cantik
    }
  });

  if (page === "hero") {
    heroSection.classList.remove("hidden-section");
    return;
  }

  heroSection.classList.add("hidden-section");

  // Beri sedikit jeda agar animasi leaving bisa terlihat sebelum elemen baru masuk
  setTimeout(() => {
    if (page === "cake" && cakeCard) {
      cakeCard.classList.remove("page-leaving");
      cakeCard.classList.add("page-active");
    } else if (page === "gallery" && gallerySection) {
      gallerySection.classList.remove("page-leaving");
      gallerySection.classList.add("page-active");
    } else if (page === "greeting" && greetingSection) {
      greetingSection.classList.remove("page-leaving");
      greetingSection.classList.add("page-active");
    }
  }, 50);
}

function triggerOpeningSurprise() {
  initAudioContext();
  playBellTone(523.25, 0.4);
  setTimeout(() => playBellTone(659.25, 0.5), 120);
  setTimeout(() => playBellTone(783.99, 0.7), 240);

  fireConfettiShower();

  if (!appState.isMusicPlaying) {
    startMusic();
  }

  experienceWrapper.classList.add("visible-section");
  showPage("cake");
}

if (openSurpriseBtn) {
  openSurpriseBtn.addEventListener("click", triggerOpeningSurprise);
}
if (giftBoxOpener) {
  giftBoxOpener.addEventListener("click", triggerOpeningSurprise);
}

if (continueToLetterBtn) {
  continueToLetterBtn.addEventListener("click", () => {
    showPage("greeting");
  });
}

/* ==========================================================================
   4. INTERACTIVE CAKE & CANDLE BLOW (FEATURE 3b)
   ========================================================================== */
function extinguishCandle() {
  if (!appState.isCandleLit) return;
  appState.isCandleLit = false;

  candleWrapper.classList.add("extinguished");

  initAudioContext();
  playBellTone(880, 0.8);
  setTimeout(() => playBellTone(1046.5, 1.2), 150);

  fireGrandBirthdayConfetti();

  wishBanner.classList.add("active");

  // [PENYEMPURNAAN] Simpan timer di appState dan perpanjang waktu bacanya menjadi 4 detik
  appState.pageTransitionTimer = setTimeout(() => {
    showPage("gallery");
  }, 10000);
}
if (cakeStage) {
  cakeStage.addEventListener("click", () => {
    if (appState.isCandleLit) {
      extinguishCandle();
    }
  });
}

/* ==========================================================================
   CONFETTI UTILITIES (USING CDN canvas-confetti)
   ========================================================================== */
function fireConfettiShower() {
  if (typeof confetti !== "function") return;

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.6 },
    colors: ["#ffd6e0", "#ffb7c5", "#e9d5ff", "#fff2e2", "#c084fc"],
  });
}

function fireGrandBirthdayConfetti() {
  if (typeof confetti !== "function") return;

  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
    colors: [
      "#ff8fa3",
      "#e76f8e",
      "#c084fc",
      "#8b5cf6",
      "#ffd6e0",
      "#fff2e2",
      "#ffd166",
    ],
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      }),
    );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

/* ==========================================================================
   5. GREETING CARD INTERACTIONS & PERSONALIZATION (FEATURE 3c)
   ========================================================================== */
const savedName = localStorage.getItem("birthday_bestie_name");
if (savedName && recipientNameEl) {
  recipientNameEl.textContent = savedName;
  appState.recipientName = savedName;
}

function handleEditName() {
  const current = appState.recipientName.replace(" 💕", "");
  const newName = prompt("Masukkan nama panggilan sahabatmu:", current);
  if (newName && newName.trim() !== "") {
    const formattedName = `${newName.trim()} 💕`;
    appState.recipientName = formattedName;
    recipientNameEl.textContent = formattedName;
    localStorage.setItem("birthday_bestie_name", formattedName);

    initAudioContext();
    playBellTone(783.99, 0.4);
    if (typeof confetti === "function") {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }
  }
}

if (editNameBtn) {
  editNameBtn.addEventListener("click", handleEditName);
}
if (recipientNameEl) {
  recipientNameEl.addEventListener("click", handleEditName);
}

/*if (hugBtn) {
  hugBtn.addEventListener("click", async () => {
    // ==============================
    // KONFIGURASI FONNTE
    // ==============================
    const FONNTE_TOKEN = "5d8UWd6cof2KgUdeju3C";
    const NOMOR_TUJUAN = "62895403043830";

    // Ambil nama sahabat dari data yang sudah ada
    const friendName = appState.recipientName.replace(" 💕", "").trim();

    // Pesan yang akan dikirim
    const message =
      `Hai ${friendName} 💕\n\n` +
      `Selamat ulang tahun! 🎉🎂\n` +
      ` 🤗💖\n\n` +
      `— Dari sahabatmu 💕`;

    // ==============================
    // ANIMASI YANG SUDAH ADA
    // ==============================
    initAudioContext();
    playBellTone(659.25, 0.5);
    setTimeout(() => playBellTone(880, 0.7), 150);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ["#ff8fa3", "#e76f8e", "#ffccd5"],
      });
    }

    const originalHTML = hugBtn.innerHTML;

    hugBtn.innerHTML = "<span>💖 Harapan sedang dikirim...</span>";

    hugBtn.style.background = "#e76f8e";
    hugBtn.style.color = "#ffffff";

    // ==============================
    // KIRIM MELALUI FONNTE
    // ==============================
    try {
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: FONNTE_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: NOMOR_TUJUAN,
          message: message,
        }),
      });

      const result = await response.json();

      console.log("Respons Fonnte:", result);

      if (result.status === true) {
        hugBtn.innerHTML = "<span>💖 Harapan Berhasil Terkirim!</span>";
      } else {
        hugBtn.innerHTML = "<span>⚠️ Pesan gagal dikirim</span>";

        console.error("Fonnte:", result);
      }
    } catch (error) {
      console.error("Error Fonnte:", error);

      hugBtn.innerHTML = "<span>⚠️ Terjadi kesalahan koneksi</span>";
    }

    // Kembalikan tombol seperti semula
    setTimeout(() => {
      hugBtn.innerHTML = originalHTML;
      hugBtn.style.background = "";
      hugBtn.style.color = "";
    }, 3000);
  });
}*/

miniCards.forEach((card) => {
  card.addEventListener("click", () => {
    initAudioContext();
    playBellTone(783.99, 0.3);

    if (typeof confetti === "function") {
      confetti({
        particleCount: 15,
        spread: 45,
        origin: { y: 0.75 },
        colors: ["#ffd6e0", "#c084fc", "#ff8fa3"],
      });
    }

    card.style.transform = "scale(1.06) rotate(1deg)";
    setTimeout(() => {
      card.style.transform = "";
    }, 300);
  });
});
