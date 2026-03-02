fetch('data/syllables.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('lexicon');
    data.forEach(s => {
      const div = document.createElement('div');
      div.className = 'syllable';
      div.innerHTML = `
        <h2>${s.arabic} (${s.id})</h2>
        <p>${s.description_en || ''}</p>
        <p>${s.description_ar || ''}</p>
        <p><strong>Class:</strong> ${s.class}</p>
        <p><strong>Core:</strong> ${s.core ? "Yes" : "No"}</p>
        <audio controls src="audio/${s.id}.wav"></audio>
        <br>
        <img src="spectrograms/${s.id}.png" style="max-width:100%; margin-top:10px;">
      `;
      container.appendChild(div);
    });
  });
