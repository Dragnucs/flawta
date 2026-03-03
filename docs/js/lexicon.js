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

      div.innerHTML = `
        <h2>${name} <span class="id-label">${s.id}</span></h2>
        <div class="tags">${classBadge}${coreBadge}</div>
        <p>${description}</p>
        <audio controls src="audio/${s.id}.wav"></audio>
        <img src="spectrograms/${s.id}.png" alt="${name} — ${s.id}">
      `;
      container.appendChild(div);
    });
  });
