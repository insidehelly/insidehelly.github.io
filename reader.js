
function insertControlsBar() {
  if (document.getElementById('controls')) return; // already exists

  const controls = document.createElement('div');
  controls.id = 'controls';
  controls.innerHTML = `
    <select id="themeToggle">
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>

    <select id="fontSizeSelect">
      <option value="16px">Small</option>
      <option value="18px" selected>Medium</option>
      <option value="20px">Large</option>
      <option value="22px">X-Large</option>
    </select>

    <select id="fontFamilySelect">
      <option value="Georgia, serif" selected>Georgia</option>
      <option value="Times New Roman, serif">Times New Roman</option>
      <option value="Arial, sans-serif">Arial</option>
      <option value="'Courier New', monospace">Courier New</option>
    </select>
  `;
  document.body.insertBefore(controls, document.body.firstChild);
}

function applySettings() {
  const theme = localStorage.getItem('theme') || 'dark';
  const fontSize = localStorage.getItem('fontSize') || '18px';
  const fontFamily = localStorage.getItem('fontFamily') || 'Georgia, serif';

  document.documentElement.style.setProperty('--font-size', fontSize);
  document.documentElement.style.setProperty('--font-family', fontFamily);

  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.value = theme;

  const fontSizeSelect = document.getElementById('fontSizeSelect');
  if (fontSizeSelect) fontSizeSelect.value = fontSize;

  const fontFamilySelect = document.getElementById('fontFamilySelect');
  if (fontFamilySelect) fontFamilySelect.value = fontFamily;
}

function setTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
}

function setFontSize(size) {
  document.documentElement.style.setProperty('--font-size', size);
  localStorage.setItem('fontSize', size);
}

function setFontFamily(family) {
  document.documentElement.style.setProperty('--font-family', family);
  localStorage.setItem('fontFamily', family);
}

function buildChapterMenu() {
  const chapters = document.querySelectorAll('h3.title');
  if (chapters.length === 0) return;

  const chapterSelect = document.createElement('select');
  chapterSelect.id = 'chapterJump';
  chapterSelect.innerHTML = '<option disabled selected>Jump to chapter</option>';

  chapters.forEach((chapter, i) => {
    const id = 'chapter-' + i;
    chapter.id = id;
    const option = document.createElement('option');
    option.value = id;
    option.textContent = chapter.textContent;
    chapterSelect.appendChild(option);
  });

  chapterSelect.addEventListener('change', (e) => {
    location.hash = '#' + e.target.value;
  });

  const controls = document.getElementById('controls');
  if (controls) controls.appendChild(chapterSelect);
}

window.addEventListener('DOMContentLoaded', () => {
  insertControlsBar();
  applySettings();
  buildChapterMenu();

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', (e) => {
      setTheme(e.target.value);
    });
  }

  const fontSizeSelect = document.getElementById('fontSizeSelect');
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', (e) => {
      setFontSize(e.target.value);
    });
  }

  const fontFamilySelect = document.getElementById('fontFamilySelect');
  if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', (e) => {
      setFontFamily(e.target.value);
    });
  }
});
