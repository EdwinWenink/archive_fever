// Zettelkasten Navigation JavaScript

(function() {
  'use strict';

  const searchInput = document.getElementById('zettelSearch');
  const clearSearch = document.getElementById('clearSearch');
  const sortSelect = document.getElementById('sortSelect');
  const randomBtn = document.getElementById('randomNote');
  const listViewBtn = document.getElementById('listView');
  const gridViewBtn = document.getElementById('gridView');
  const container = document.getElementById('zettelContainer');
  const visibleCount = document.getElementById('visibleCount');
  const alphaBtns = document.querySelectorAll('.alpha-btn');

  let allItems = Array.from(document.querySelectorAll('.zettel-item'));
  let currentFilter = '';
  let currentSort = 'alpha';
  let currentView = 'grid';

  // Initialize
  function init() {
    sortItems();
    updateCount();
    setupEventListeners();
  }

  // Event Listeners
  function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', handleClearSearch);
    sortSelect.addEventListener('change', handleSort);
    randomBtn.addEventListener('click', handleRandom);
    listViewBtn.addEventListener('click', () => setView('list'));
    gridViewBtn.addEventListener('click', () => setView('grid'));

    alphaBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const letter = e.target.dataset.letter;
        scrollToLetter(letter);
      });
    });
  }

  // Search functionality
  function handleSearch(e) {
    currentFilter = e.target.value.toLowerCase();
    filterItems();
    updateCount();

    if (currentFilter) {
      clearSearch.style.display = 'block';
    } else {
      clearSearch.style.display = 'none';
    }
  }

  function handleClearSearch() {
    searchInput.value = '';
    currentFilter = '';
    filterItems();
    updateCount();
    clearSearch.style.display = 'none';
  }

  function filterItems() {
    allItems.forEach(item => {
      const title = item.dataset.title;
      const filename = item.dataset.filename;

      if (currentFilter === '' ||
          title.includes(currentFilter) ||
          filename.includes(currentFilter)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Sort functionality
  function handleSort(e) {
    currentSort = e.target.value;
    sortItems();
  }

  function sortItems() {
    const sorted = [...allItems].sort((a, b) => {
      switch (currentSort) {
        case 'alpha':
          return a.dataset.title.localeCompare(b.dataset.title);
        case 'date-new':
          return b.dataset.modified.localeCompare(a.dataset.modified);
        case 'date-old':
          return a.dataset.modified.localeCompare(b.dataset.modified);
        default:
          return 0;
      }
    });

    // Re-append in sorted order
    sorted.forEach(item => container.appendChild(item));
    allItems = sorted;
  }

  // Random note
  function handleRandom() {
    const visibleItems = allItems.filter(item => item.style.display !== 'none');
    if (visibleItems.length > 0) {
      const randomItem = visibleItems[Math.floor(Math.random() * visibleItems.length)];
      window.location.href = randomItem.dataset.url;
    }
  }

  // View toggle
  function setView(view) {
    currentView = view;

    if (view === 'list') {
      container.classList.remove('zettel-grid');
      container.classList.add('zettel-list');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    } else {
      container.classList.remove('zettel-list');
      container.classList.add('zettel-grid');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    }
  }

  // Alphabet navigation
  function scrollToLetter(letter) {
    const firstItem = allItems.find(item =>
      item.dataset.sortLetter === letter && item.style.display !== 'none'
    );

    if (firstItem) {
      firstItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Add temporary highlight
      firstItem.classList.add('highlight');
      setTimeout(() => firstItem.classList.remove('highlight'), 1500);
    }
  }

  // Update visible count
  function updateCount() {
    const visible = allItems.filter(item => item.style.display !== 'none').length;
    visibleCount.textContent = visible;
  }

  // Initialize on load
  init();
})();
