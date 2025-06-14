// ==UserScript==
// @name         LinkedIn Job Filters Enhancer (Native Integration)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add custom filters (hide viewed, applied, promoted) into LinkedIn filters panel natively (FR + EN)
// @author       Alexis
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const FILTER_KEYS = {
        hideViewed: 'ljfe_hideViewed',
        hideApplied: 'ljfe_hideApplied',
        hidePromoted: 'ljfe_hidePromoted',
    };

    const getPreference = (key) => localStorage.getItem(key) === 'true';
    const setPreference = (key, value) => localStorage.setItem(key, value);

    let preferences = {
        hideViewed: getPreference(FILTER_KEYS.hideViewed),
        hideApplied: getPreference(FILTER_KEYS.hideApplied),
        hidePromoted: getPreference(FILTER_KEYS.hidePromoted),
    };

  const recentlyClicked = new Set();

  function setupClickTracking() {
      document.addEventListener('click', e => {
          const card = e.target.closest('.job-card-container');
          if (card) {
              recentlyClicked.add(card);
              // setTimeout(() => recentlyClicked.delete(card), 5000); // 5s de délai
          }
      });
  }

  function filterJobCards() {
      const cards = document.querySelectorAll('.job-card-container');
      cards.forEach(card => {
          const text = card.innerText.toLowerCase();
          let hide = false;

          if (preferences.hideViewed &&
              (text.includes('viewed') || text.includes('déjà vu'))  &&
              !recentlyClicked.has(card)) {
              console.log("hiding viewed:", card);
              hide = true;
          }

          if (preferences.hideApplied &&
              (text.includes('applied') || text.includes('vous avez postulé'))) {
              console.log("hiding applied:", card);
              hide = true;
          }

          if (preferences.hidePromoted &&
              (text.includes('promoted') || text.includes('sponsorisé'))) {
              console.log("hiding promoted:", card);
              hide = true;
          }

          if (hide) {
              card.style.setProperty('display', 'none', 'important');
          } else {
              card.style.setProperty('display', '', 'important');
          }
      });
  }

    const observer = new MutationObserver(() => {
        filterJobCards();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function injectCustomFilters() {
        const sortByFilter = document.querySelector('li.search-reusables__secondary-filters-filter');

        if (!sortByFilter || document.querySelector('#ljfe-native-filter')) return;

        const customFilterHTML = document.createElement('li');
        customFilterHTML.className = 'search-reusables__secondary-filters-filter';
        customFilterHTML.id = 'ljfe-native-filter';

        customFilterHTML.innerHTML = `
        <fieldset>
            <legend class="a11y-text">Custom LinkedIn Job Filters</legend>
            <h3 class="text-heading-large inline-block">Hide jobs</h3>
            <div class="search-reusables__secondary-filters-values">
                <ul class="list-style-none relative display-flex flex-wrap list-style-none">
                    ${renderCheckbox('hideViewed', 'Viewed jobs')}
                    ${renderCheckbox('hideApplied', 'Applied jobs')}
                    ${renderCheckbox('hidePromoted', 'Promoted jobs')}
                </ul>
            </div>
            <hr class="reusable-search-filters-advanced-filters__divider">
        </fieldset>
        `;

        sortByFilter.insertAdjacentElement('afterend', customFilterHTML);

        // Bind events
        ['hideViewed', 'hideApplied', 'hidePromoted'].forEach(key => {
            const box = document.getElementById(`ljfe-${key}`);
            box.addEventListener('change', e => {
                preferences[key] = e.target.checked;
                setPreference(FILTER_KEYS[key], e.target.checked);
                filterJobCards();
            });
        });
    }

    function renderCheckbox(key, label) {
        return `
        <li class="search-reusables__filter-value-item">
            <input id="ljfe-${key}" type="checkbox" class="search-reusables__select-input" ${preferences[key] ? 'checked' : ''}>
            <label for="ljfe-${key}" class="search-reusables__value-label">
                <p class="display-flex">
                    <span class="t-14 t-black--light t-normal">${label}</span>
                    <span class="visually-hidden">${label}</span>
                </p>
            </label>
        </li>`;
    }

    const modalObserver = new MutationObserver(() => {
        injectCustomFilters();
    });
    modalObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', filterJobCards);

     // 🔁 Réapplique les filtres après clic sur le bouton "Show results"
    document.body.addEventListener('click', e => {
        const btn = e.target.closest('button[data-test-reusables-filters-modal-show-results-button="true"]');
        if (btn) {
            setTimeout(() => {
                filterJobCards();
            }, 1000); // Attendre le chargement des nouveaux résultats
        }
    });
})();
