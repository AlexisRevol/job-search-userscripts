// ==UserScript==
// @name         Résumé offre d'emploi
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Résume automatiquement le texte d'une offre d'emploi via un script Python local
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
// @grant         GM.xmlHttpRequest
// @connect      localhost
// ==/UserScript==

(function () {
    'use strict';

    class UI {
        constructor() {
            // this.createButton();
            this.ACTIVATE_FASTAPI = false;

            this.registerKeyboardShortcut();
            this.createSpinner();
        }

      registerKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key.toLowerCase() === 'c') {
                    if (this.ACTIVATE_FASTAPI) {
                      const offerText = OfferExtractor.getText();
                      if (offerText) {
                          summarizer.summarize(offerText);
                      } else {
                          this.showError("Impossible d'extraire le texte de l'offre.");
                      }
                    } else {
                        this.triggerAlertIfExperienceIsHigh();
                    }
                }
            });
        }

        createSpinner() {
            this.spinner = document.createElement('div');
            Object.assign(this.spinner.style, {
                position: 'fixed',
                bottom: '25px',
                right: '25px',
                transform: 'translate(-50%, -50%)',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                zIndex: '99999',
                display: 'none'
            });

            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(this.spinner);
        }

        showSpinner(show) {
            this.spinner.style.display = show ? 'block' : 'none';
        }

        showModal({ summary, skills, experience }) {
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed',
                bottom: '15px',
                right: '15px',
                backgroundColor: '#333',
                color: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                zIndex: '999999',
                maxWidth: '400px',
                width: '100%',
                maxHeight: '60vh',
                overflowY: 'auto'
            });

            const closeButton = document.createElement('button');
            Object.assign(closeButton.style, {
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
            });
            closeButton.innerText = '✖';
            closeButton.onclick = () => modal.remove();

            modal.innerHTML = `
                <div style="margin-bottom: 10px; font-size: 14px;">
                    <span style="color: #2196F3; font-weight: bold;">Compétences :</span><br>
                    ${Array.isArray(skills) ? skills.join(", ") : skills}
                </div>
                <div style="margin-bottom: 10px; font-size: 14px;">
                    <span style="color: #FF5722; font-weight: bold;">Expérience :</span><br>
                    ${experience ? (Array.isArray(experience) ? experience.join("<br>") : experience) + ' ans' : "Non précisée"}
                </div>
            `;
            modal.appendChild(closeButton);
            document.body.appendChild(modal);
            setTimeout(() => modal.remove(), 10000);
        }

        showError(message) {
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                zIndex: '999999'
            });
            modal.innerText = `❌ Erreur : ${message}`;
            document.body.appendChild(modal);
            setTimeout(() => modal.remove(), 3000);
        }


        triggerAlertIfExperienceIsHigh() {
            const text = OfferExtractor.getText();
            const experienceYears = ExperienceExtractor.extractExperience(text);

            if (experienceYears && experienceYears > 3) {
                // Ajouter une animation de bordure rouge autour de l'écran
                this.showCriticalHealthOverlay();
            }
        }

      showCriticalHealthOverlay(duration = 3000) {
          const overlay = document.createElement('div');
          overlay.id = 'danger-vignette-overlay';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.pointerEvents = 'none';
          overlay.style.zIndex = '9999';
          overlay.style.background = `
              radial-gradient(ellipse at center,
              rgba(255, 0, 0, 0) 65%,
              rgba(255, 0, 0, 0.1) 75%,
              rgba(255, 0, 0, 0.2) 85%,
              rgba(255, 0, 0, 0.3) 95%)
          `;
          overlay.style.animation = 'pulseVignette 1.5s infinite ease-in-out';

          document.body.appendChild(overlay);

          // Supprimer l'overlay après la durée
          setTimeout(() => {
              overlay.remove();
          }, duration);

          // Injecter l'animation CSS si elle n'existe pas encore
          if (!document.getElementById('danger-vignette-style')) {
              const style = document.createElement('style');
              style.id = 'danger-vignette-style';
              style.innerHTML = `
                  @keyframes pulseVignette {
                      0%, 100% {
                          opacity: 0.4;
                          filter: blur(1px);
                      }
                      50% {
                          opacity: 0.6;
                          filter: blur(2px);
                      }
                  }
              `;
              document.head.appendChild(style);
          }
      }

    }

    class OfferExtractor {
        static getText() {
            let text = '';
            const hostname = window.location.hostname;

            if (hostname.includes('linkedin.com')) {
                text = document.querySelector('.jobs-description, .jobs-description--reformatted')?.innerText;
            } else if (hostname.includes('indeed.com')) {
                text = document.querySelector('.jobsearch-JobComponent-description')?.innerText;
            } else if (hostname.includes('apec.fr')) {
                text = document.querySelector('apec-poste-informations')?.innerText;
            }

            // Fallback si text est vide ou non trouvé
            if (!text || text.trim() === '') {
                text = document.body?.innerText || '';
            }
            return text?.slice(0, 30000) || '';
        }
    }

  class ExperienceExtractor {
    static extractExperience(text) {
        let experienceYears = [];

        // Stratégie 1 : Regex classiques
        const patterns = [
            /\b(\d{1,2})\s*(?:ans|années)\s+d'expérience/gi,
            /expérience.*?(?:au moins|minimum)\s*(\d{1,2})\s*(?:ans|années)/gi,
            /justifiez.*?(\d{1,2})\s*(?:ans|années)/gi
        ];

        // Appliquer les patterns regex
        patterns.forEach(pattern => {
            let matches;
            while ((matches = pattern.exec(text)) !== null) {
                experienceYears.push(parseInt(matches[1]));
            }
        });

        // Stratégie 2 : Heuristique
        if (experienceYears.length === 0) {
            // Découpage amélioré
            const blocks = text.split(/\n|•|-|•|–|—|[.!?]/);
            blocks.forEach(block => {
                if (/expérien/.test(block.toLowerCase()) && (/\bans\b|\bannées?\b/.test(block.toLowerCase()))) {
                    const numbers = block.match(/\d{1,2}/g);
                    if (numbers) {
                        experienceYears.push(...numbers.map(num => parseInt(num)));
                    }
                }
            });
        }

        // Retourner la valeur maximale trouvée
        return experienceYears.length ? Math.max(...experienceYears) : null;
    }
}

    class Summarizer {
        constructor(ui) {
            this.ui = ui;
        }

        summarize(text) {
            this.ui.showSpinner(true);
            GM.xmlHttpRequest({
                method: "POST",
                url: "http://localhost:8001/summarize",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ text: text, sentences: 1 }),
                onload: response => this.handleResponse(response),
                onerror: err => {
                    this.ui.showSpinner(false);
                    this.ui.showError("Erreur réseau ou serveur injoignable : " + err.message);
                }
            });
        }

        handleResponse(response) {
            this.ui.showSpinner(false);

            try {
                if (response.status !== 200) throw new Error("Statut HTTP " + response.status);

                const result = JSON.parse(response.responseText);

                if (!result || !result.summary || !result.skills) {
                    throw new Error("Réponse inattendue de l'API");
                }

                this.ui.showModal(result);
            } catch (e) {
                this.ui.showError(e.message);
                console.error("Réponse API brute :", response.responseText);
            }
        }
    }

    // Initialisation du script
    const ui = new UI();
    const summarizer = new Summarizer(ui);

   /* const observer = new MutationObserver((mutationsList, observer) => {
        // Pour éviter d'appeler la fonction trop souvent
        clearTimeout(window.__triggerTimer);
        window.__triggerTimer = setTimeout(() => {
            ui.triggerAlertIfExperienceIsHigh();
        }, 500); // petit délai pour laisser le DOM se stabiliser
    });

    // Options d'observation
    const config = {
        childList: true,
        subtree: true
    };

    // Lancer l'observation sur le body
    observer.observe(document.body, config);*/


    /*ui.button.addEventListener('click', () => {
        const offerText = OfferExtractor.getText();
        if (offerText) {
            summarizer.summarize(offerText);
        } else {
            ui.showError("Impossible d'extraire le texte de l'offre.");
        }
    });*/
})();
