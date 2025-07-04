
// Load saved settings or defaults
function applySettings() {
  const theme = localStorage.getItem('theme') || 'dark';
  const fontSize = localStorage.getItem('fontSize') || '18px';
  const fontFamily = localStorage.getItem('fontFamily') || 'Georgia, serif';

  document.documentElement.style.setProperty('--font-size', fontSize);
  document.documentElement.style.setProperty('--font-family', fontFamily);
  document.body.className = theme;

  document.getElementById('themeToggle').value = theme;
  document.getElementById('fontSizeSelect').value = fontSize;
  document.getElementById('fontFamilySelect').value = fontFamily;
}

// Set theme (light or dark)
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
}

// Set font size
function setFontSize(size) {
  document.documentElement.style.setProperty('--font-size', size);
  localStorage.setItem('fontSize', size);
}

// Set font family
function setFontFamily(family) {
  document.documentElement.style.setProperty('--font-family', family);
  localStorage.setItem('fontFamily', family);
}

// Build chapter jump menu if chapters exist
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

  document.getElementById('controls').appendChild(chapterSelect);
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  applySettings();
  buildChapterMenu();

  document.getElementById('themeToggle').addEventListener('change', (e) => {
    setTheme(e.target.value);
  });

  document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
    setFontSize(e.target.value);
  });

  document.getElementById('fontFamilySelect').addEventListener('change', (e) => {
    setFontFamily(e.target.value);
  });
});
