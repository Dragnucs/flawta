fetch("data/syllables.json")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("lexicon");
    const lang = document.documentElement.lang || "en";
    const isAr = lang === "ar";

    data.forEach((s) => {
      const div = document.createElement("div");
      div.className = "syllable";

      const name = isAr ? s.name.ar : s.name.en;
      const description = isAr ? s.description.ar : s.description.en;
      const classLabel = isAr ? s.class.ar : s.class.en;
      const coreLabel = isAr ? "أساسي" : "Core";
      const coreBadge = s.core
        ? `<span class="tag tag-core">${coreLabel}</span>`
        : "";
      const classBadge = classLabel
        ? `<span class="tag">${classLabel}</span>`
        : "";

      const playIcon =
        '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>';
      const pauseIcon =
        '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>';

      div.innerHTML = `
        <h2>${name} <span class="id-label">${s.id}</span></h2>
        <div class="tags">${classBadge}${coreBadge}</div>
        <p>${description}</p>
        <div class="player" dir="ltr">
          <button class="player-btn" aria-label="Play" data-play='${playIcon}' data-pause='${pauseIcon}'>
            ${playIcon}
          </button>
          <div class="player-track">
            <div class="player-progress"></div>
          </div>
          <span class="player-time">0:00 / 0:00</span>
          <audio src="audio/${s.id}.wav" preload="metadata"></audio>
        </div>
        <img src="spectrograms/${s.id}.png" alt="${name} — ${s.id}">
      `;
      container.appendChild(div);
    });

    initPlayers();
  });

function initPlayers() {
  document.querySelectorAll(".player").forEach((player) => {
    const btn = player.querySelector(".player-btn");
    const track = player.querySelector(".player-track");
    const progress = player.querySelector(".player-progress");
    const timeEl = player.querySelector(".player-time");
    const audio = player.querySelector("audio");

    let dragging = false;

    function fmt(t) {
      if (!t || !isFinite(t)) return "0:00";
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return m + ":" + String(s).padStart(2, "0");
    }

    function updateTime() {
      const cur = fmt(audio.currentTime);
      const dur = fmt(audio.duration);
      timeEl.textContent = cur + " / " + dur;
    }

    function updateProgress() {
      if (dragging) return;
      const pct =
        audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
      progress.style.width = pct + "%";
      updateTime();
    }

    function seek(e) {
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = x / rect.width;
      progress.style.width = pct * 100 + "%";
      audio.currentTime = pct * audio.duration;
      updateTime();
    }

    btn.addEventListener("click", () => {
      if (audio.paused) {
        // pause all other players first
        document.querySelectorAll(".player audio").forEach((a) => {
          if (a !== audio && !a.paused) {
            a.pause();
            const otherBtn = a.closest(".player").querySelector(".player-btn");
            otherBtn.innerHTML = otherBtn.dataset.play;
          }
        });
        audio.play();
        btn.innerHTML = btn.dataset.pause;
        btn.setAttribute("aria-label", "Pause");
      } else {
        audio.pause();
        btn.innerHTML = btn.dataset.play;
        btn.setAttribute("aria-label", "Play");
      }
    });

    audio.addEventListener("timeupdate", updateProgress);

    audio.addEventListener("loadedmetadata", updateTime);

    audio.addEventListener("ended", () => {
      btn.innerHTML = btn.dataset.play;
      btn.setAttribute("aria-label", "Play");
      progress.style.width = "0%";
      updateTime();
    });

    // Click to seek
    track.addEventListener("mousedown", (e) => {
      dragging = true;
      seek(e);
    });

    track.addEventListener("touchstart", (e) => {
      dragging = true;
      seek(e.touches[0]);
    });

    document.addEventListener("mousemove", (e) => {
      if (dragging) seek(e);
    });

    document.addEventListener("touchmove", (e) => {
      if (dragging) seek(e.touches[0]);
    });

    document.addEventListener("mouseup", () => {
      dragging = false;
    });

    document.addEventListener("touchend", () => {
      dragging = false;
    });
  });
}
