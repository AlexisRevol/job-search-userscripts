// ==UserScript==
// @name         Glassdoor Rating Fetcher Plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Récupère la note Glassdoor via Google (survol de l'entreprise puis alt+g)
// @author       Alexis
// @match        *://*.linkedin.com/*
// @match        *://*.welcome-to-the-jungle.com/*
// @match        *://*.indeed.com/*
// @match        *://*.indeed.fr/*
// @match        *://*.monster.fr/*
// @match        *://*.monster.com/*
// @match        *://*.jobteaser.com/*
// @match        *://*.meteojob.com/*
// @match        *://*.hellowork.com/*
// @match        *://*.regionjob.com/*
// @match        *://*.apec.fr/*
// @match        *://*.glassdoor.fr/*
// @match        *://*.glassdoor.com/*
// @match        *://*.pole-emploi.fr/*
// @match        *://*.cadremploi.fr/*
// @match        *://*.jobijoba.com/*
// @match        *://*.keljob.com/*
// @match        *://*.wizbii.com/*
// @match        *://*.chooseyourboss.com/*
// @match        *://*.talent.io/*
// @match        *://*.recrut.com/*
// @match        *://*.francetravail.fr/*
// @match        *://*.adzuna.fr/*
// @grant        GM.xmlHttpRequest
// @connect      google.com
// @connect      www.google.com
// @icon         https://cdn.worldvectorlogo.com/logos/glassdoor-logo.svg
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let hoveredElement = null;

    // Écouteur pour savoir quel élément est survolé
    document.addEventListener('mousemove', function(e) {
        hoveredElement = e.target;
    });

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();

            showLoading();

            let selection = window.getSelection().toString().trim();
            if (!selection && hoveredElement) {
                selection = hoveredElement.innerText?.trim() || hoveredElement.textContent?.trim();
            }

            if (!selection) {
                showPopup('Aucun texte sélectionné ou survolé.');
                return;
            }

            const query = `site:glassdoor.fr "${selection}"`;
            const searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

            GM.xmlHttpRequest({
                method: "GET",
                url: searchURL,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Accept': 'text/html',
                },
                onload: function(response) {
                    removePopup();

                    if (response.status === 429) {
                        showPopup("⚠️ Trop de requêtes : Résoudre captcha Google.");
                        return;
                    }

                    if (response.status !== 200) {
                        showPopup(`❌ Erreur HTTP ${response.status} lors de la recherche Google.`);
                        return;
                    }

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const spans = [...doc.querySelectorAll('span[aria-label]')];
                    const noteSpan = spans.find(el => el.getAttribute('aria-label')?.includes('sur'));
                    console.log("***************************************");
                    console.log("DEBUG USERSCRIPT", response.status);
                    console.log(searchURL);
                    console.log(spans);

                    if (noteSpan) {
                        const label = noteSpan.getAttribute('aria-label');
                        const match = label.match(/([\d.,]+)\s+sur\s+5/);
                        if (match) {
                            const rating = match[1];
                            showPopup(`⭐ Note Glassdoor : ${rating} / 5`);
                        } else {
                            showPopup('❓ Note introuvable dans le label.');
                        }
                    } else {
                        showPopup('❌ Pas de note trouvée.');
                    }
                },
                onerror: function(err) {
                    showPopup('❌ Erreur lors de la requête.');
                }
            });
        }
    });

    function showLoading() {
      removePopup();

      const div = document.createElement('div');
      div.id = 'glassdoor-loader';
      div.innerHTML = `
          <div style="
              display: flex;
              align-items: center;
              gap: 10px;
          ">
              <div class="spinner" style="
                  width: 16px;
                  height: 16px;
                  border: 3px solid #fff;
                  border-top: 3px solid #888;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
              "></div>
              <span>Recherche en cours...</span>
          </div>
      `;

      Object.assign(div.style, {
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#333',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '16px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          fontFamily: 'sans-serif'
      });

      const style = document.createElement('style');
      style.textContent = `
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
      `;
      document.head.appendChild(style);
      document.body.appendChild(div);
  }

  function showPopup(text) {
      removePopup();

      const div = document.createElement('div');
      div.id = 'glassdoor-popup';

      const closeBtn = document.createElement('span');
      closeBtn.textContent = '✕';
      Object.assign(closeBtn.style, {
          marginLeft: '10px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#aaa',
          float: 'right',
          fontSize: '16px'
      });
      closeBtn.title = 'Fermer';
      closeBtn.addEventListener('click', () => div.remove());

      const textSpan = document.createElement('span');
      textSpan.textContent = text;

      div.appendChild(textSpan);
      div.appendChild(closeBtn);

      Object.assign(div.style, {
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#333',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          zIndex: 9999,
          fontSize: '16px',
          fontFamily: 'sans-serif',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          minWidth: '200px'
      });

      document.body.appendChild(div);
      setTimeout(() => {
          if (document.body.contains(div)) div.remove();
      }, 5000);
  }

  function removePopup() {
      const old = document.querySelector('#glassdoor-loader, #glassdoor-popup');
      if (old) old.remove();
  }
})();
