
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;

  const controls = document.createElement('div');
  controls.id = 'controls';
  controls.innerHTML = `
    <button id="toggle-theme">Dark Mode</button>
    <label>Font:
      <select id="font-family">
        <option value="'Georgia', serif">Georgia</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Arial', sans-serif">Arial</option>
        <option value="'Courier New', monospace">Courier New</option>
      </select>
    </label>
    <label>Size:
      <select id="font-size">
        <option value="16px">Small</option>
        <option value="18px" selected>Medium</option>
        <option value="20px">Large</option>
        <option value="24px">Extra Large</option>
      </select>
    </label>
    <label id="chapter-label" style="display:none;">Jump to Chapter:
      <select id="chapter-jump"></select>
    </label>
  `;
  document.body.prepend(controls);

  const settings = JSON.parse(localStorage.getItem('reader-settings') || '{}');

  function applySetting(name, value) {
    if (name === 'theme') {
      if (value === 'dark') {
        root.style.setProperty('--bg-color', '#0f0f0f');
        root.style.setProperty('--text-color', '#eeeeee');
        root.style.setProperty('--link-color', '#80cbc4');
        document.getElementById('toggle-theme').textContent = 'Light Mode';
      } else {
        root.style.setProperty('--bg-color', '#eee2cc');
        root.style.setProperty('--text-color', '#111111');
        root.style.setProperty('--link-color', '#0645AD');
        document.getElementById('toggle-theme').textContent = 'Dark Mode';
      }
    } else {
      root.style.setProperty(`--${name}`, value);
    }
  }

  function saveSetting(key, val) {
    settings[key] = val;
    localStorage.setItem('reader-settings', JSON.stringify(settings));
  }

  for (const [key, val] of Object.entries(settings)) {
    applySetting(key, val);
    const input = document.querySelector(`#${key.replace('-', '_')}`) || document.querySelector(`#${key}`);
    if (input) input.value = val;
  }

  document.getElementById('toggle-theme').addEventListener('click', () => {
    const theme = settings.theme === 'light' ? 'dark' : 'light';
    applySetting('theme', theme);
    saveSetting('theme', theme);
  });

  document.getElementById('font-size').addEventListener('change', (e) => {
    applySetting('font-size', e.target.value);
    saveSetting('font-size', e.target.value);
  });

  document.getElementById('font-family').addEventListener('change', (e) => {
    applySetting('font-family', e.target.value);
    saveSetting('font-family', e.target.value);
  });

  // Chapter jump menu
  const chapterHeadings = [...document.querySelectorAll('h2.heading')];
  if (chapterHeadings.length > 1) {
    const chapterJump = document.getElementById('chapter-jump');
    document.getElementById('chapter-label').style.display = 'inline';

    chapterHeadings.forEach((h, i) => {
      const id = `chapter-${i}`;
      h.id = id;
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = h.textContent;
      chapterJump.appendChild(opt);
    });

    chapterJump.addEventListener('change', (e) => {
      const el = document.getElementById(e.target.value);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (!settings.theme) {
    applySetting('theme', 'dark');
    saveSetting('theme', 'dark');
  }
});
