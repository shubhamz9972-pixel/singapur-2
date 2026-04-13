/* ============================================================
   SINGAPUR RESTOBAR — Menu Filter
   Handles category pill filtering on menu.html
   ============================================================ */

'use strict';

(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const menuItems  = document.querySelectorAll('.menu-card');
  if (!filterBtns.length || !menuItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('filter-pill--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-pill--active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter cards with fade animation
      menuItems.forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => card.classList.remove('card--hidden'));
        } else {
          card.classList.add('card--hidden');
          card.addEventListener('transitionend', () => {
            if (card.classList.contains('card--hidden')) card.style.display = 'none';
          }, { once: true });
        }
      });
    });
  });

  // Init: show all
  filterBtns[0]?.click();
})();
