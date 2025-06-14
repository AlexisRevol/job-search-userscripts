// ==UserScript==
// @name         LinkedIn Job Filters Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Ajoute des filtres natifs (masquer vu, postulé, promu) dans le panneau de filtres de LinkedIn.
// @author       Alexis
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Configuration centralisée pour la maintenabilité.
     * Si LinkedIn change ses classes, il suffit de les mettre à jour ici.
     */
    const CONFIG = {
        STORAGE_KEYS: {
            hideViewed: 'ljfe_hideViewed',
            hideApplied: 'ljfe_hideApplied',
            hidePromoted: 'ljfe_hidePromoted',
        },
        SELECTORS: {
            jobCard: '.job-card-container',
            filterInsertionPoint: 'li.search-reusables__secondary-filters-filter',
            showResultsButton: 'button[data-test-reusables-filters-modal-show-results-button="true"]'
        },
        TEXT: {
            viewed: ['viewed', 'déjà vu'],
            applied: ['applied', 'vous avez postulé'],
            promoted: ['promoted', 'sponsorisé'],
        },
        DEBOUNCE_DELAY_MS: 300, // Délai pour le debounce du filtrage
        NATIVE_FILTER_ID: 'ljfe-native-filter'
    };

    class LinkedInFilterEnhancer {
        constructor() {
            this.preferences = {};
            this.recentlyClicked = new Set();
            this.filterTimeout = null;

            this._loadPreferences();
            this._setupEventListeners();
            this._setupObservers();
        }

        /**
         * Charge les préférences depuis le localStorage.
         */
        _loadPreferences() {
            for (const key in CONFIG.STORAGE_KEYS) {
                const storageKey = CONFIG.STORAGE_KEYS[key];
                this.preferences[key] = localStorage.getItem(storageKey) === 'true';
            }
        }

        /**
         * Met à jour une préférence et la sauvegarde.
         */
        _updatePreference(key, value) {
            this.preferences[key] = value;
            localStorage.setItem(CONFIG.STORAGE_KEYS[key], value);
            this.filterJobCards(); // Applique le filtre immédiatement après un changement
        }

        /**
         * Met en place les écouteurs d'événements principaux.
         */
        _setupEventListeners() {
            document.addEventListener('click', (e) => {
                const jobCard = e.target.closest(CONFIG.SELECTORS.jobCard);
                if (jobCard) {
                    this.recentlyClicked.add(jobCard);
                }

                if (e.target.closest(CONFIG.SELECTORS.showResultsButton)) {
                    setTimeout(() => this.filterJobCards(), 1000); // Laisse le temps à LinkedIn de charger
                }
            });
        }

        /**
         * Met en place un unique MutationObserver pour gérer l'injection des filtres et le filtrage des cartes.
         */
        _setupObservers() {
            const observer = new MutationObserver(() => {
                this._injectCustomFilters();
                this._debouncedFilter();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * Applique le filtre aux cartes d'offres d'emploi.
         */
        filterJobCards() {
            const cards = document.querySelectorAll(CONFIG.SELECTORS.jobCard);
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                let shouldHide = false;

                if (this.preferences.hideViewed && !this.recentlyClicked.has(card) && CONFIG.TEXT.viewed.some(term => text.includes(term))) {
                    shouldHide = true;
                }
                if (this.preferences.hideApplied && CONFIG.TEXT.applied.some(term => text.includes(term))) {
                    shouldHide = true;
                }
                if (this.preferences.hidePromoted && CONFIG.TEXT.promoted.some(term => text.includes(term))) {
                    shouldHide = true;
                }
                card.style.setProperty('display', shouldHide ? 'none' : '', 'important');
            });
        }

        /**
         * Fonction de "debounce" pour éviter d'appeler filterJobCards trop souvent.
         */
        _debouncedFilter() {
            clearTimeout(this.filterTimeout);
            this.filterTimeout = setTimeout(() => this.filterJobCards(), CONFIG.DEBOUNCE_DELAY_MS);
        }

        /**
         * Injecte les filtres personnalisés dans le panneau de filtres de LinkedIn.
         */
        _injectCustomFilters() {
            const insertionPoint = document.querySelector(CONFIG.SELECTORS.filterInsertionPoint);
            if (!insertionPoint || document.getElementById(CONFIG.NATIVE_FILTER_ID)) {
                return; // Soit le point d'insertion n'est pas là, soit les filtres y sont déjà
            }

            const filterContainer = document.createElement('li');
            filterContainer.className = 'search-reusables__secondary-filters-filter';
            filterContainer.id = CONFIG.NATIVE_FILTER_ID;

            const checkboxes = [
                { key: 'hideViewed', label: 'Masquer les offres vues' },
                { key: 'hideApplied', label: 'Masquer les offres postulées' },
                { key: 'hidePromoted', label: 'Masquer les offres promues' }
            ];

            filterContainer.innerHTML = `
                <fieldset>
                    <legend class="a11y-text">Filtres personnalisés</legend>
                    <h3 class="text-heading-large inline-block">Filtres additionnels</h3>
                    <div class="search-reusables__secondary-filters-values">
                        <ul class="list-style-none relative display-flex flex-wrap list-style-none">
                            ${checkboxes.map(cb => this._renderCheckbox(cb.key, cb.label)).join('')}
                        </ul>
                    </div>
                    <hr class="reusable-search-filters-advanced-filters__divider">
                </fieldset>`;

            insertionPoint.parentElement.insertBefore(filterContainer, insertionPoint.nextSibling);

            // Attache les événements aux nouvelles checkboxes
            checkboxes.forEach(({ key }) => {
                document.getElementById(`ljfe-${key}`).addEventListener('change', (e) => {
                    this._updatePreference(key, e.target.checked);
                });
            });
        }

        /**
         * Génère le HTML pour une seule checkbox.
         */
        _renderCheckbox(key, label) {
            return `
                <li class="search-reusables__filter-value-item">
                    <input id="ljfe-${key}" type="checkbox" class="search-reusables__select-input" ${this.preferences[key] ? 'checked' : ''}>
                    <label for="ljfe-${key}" class="search-reusables__value-label">
                        <p class="display-flex">
                            <span class="t-14 t-black--light t-normal">${label}</span>
                        </p>
                    </label>
                </li>`;
        }
    }

    new LinkedInFilterEnhancer();

})();