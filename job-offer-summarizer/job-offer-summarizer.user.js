// ==UserScript==
// @name         Job Offer Experience Analyzer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Affiche une alerte visuelle si une offre d'emploi requiert plus de 3 ans d'expérience (Alt+C).
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
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        TRIGGER_KEY: 'c',
        EXPERIENCE_THRESHOLD: 3,
        ALERT_DURATION_MS: 3000,
        STYLE_ID: 'joa-styles',
        OVERLAY_ID: 'joa-vignette-overlay'
    };

    class ExperienceExtractor {
        static getRequiredExperience(text) {
            if (!text) return null;
            const experienceYears = [];

            // Stratégie 1: Regex ciblées - TOUTES avec le flag /g pour matchAll
            const patterns = [
                /(\d{1,2})\s*à\s*\d{1,2}\s*ans\s*d'exp/gi,
                /\b(\d{1,2})\+?\s*(?:ans|années)\s*(?:d'expérience|d'exp)/gi,
                /expérience\s*(?:de|d'au moins|minimum)\s*(\d{1,2})\s*(?:ans|années)/gi,
            ];

            for (const pattern of patterns) {
                for (const match of text.matchAll(pattern)) {
                    experienceYears.push(parseInt(match[1], 10));
                }
            }

            // Stratégie 2: Heuristique plus large
            if (experienceYears.length === 0) {
                const blocks = text.toLowerCase().split(/\n|•|-|–|[.!?]/);
                for (const block of blocks) {
                    if (block.includes('expérien') && (block.includes('ans') || block.includes('années'))) {
                        const numbers = block.match(/\d+/g);
                        if (numbers) {
                            experienceYears.push(...numbers.map(num => parseInt(num, 10)));
                        }
                    }
                }
            }

            return experienceYears.length > 0 ? Math.max(...experienceYears) : null;
        }
    }

    class OfferExtractor {
        static getOfferText() {
            const selectors = [
                '.jobs-description',
                '.jobsearch-JobComponent-description',
                '#job-description',
                'apec-poste-informations',
                '[data-testid="job-description-container"]',
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element) return element.innerText;
            }
            return document.body.innerText.substring(0, 30000);
        }
    }

    class UIManager {
        constructor() {
            this.injectCSS();
        }

        injectCSS() {
            if (document.getElementById(CONFIG.STYLE_ID)) return;

            const style = document.createElement('style');
            style.id = CONFIG.STYLE_ID;
            style.innerHTML = `
                @keyframes pulseVignette {
                    0%, 100% { opacity: 0.5; box-shadow: inset 0 0 10vw 2vw rgba(255, 0, 0, 0.4); }
                    50% { opacity: 0.8; box-shadow: inset 0 0 12vw 3vw rgba(255, 0, 0, 0.6); }
                }
                #${CONFIG.OVERLAY_ID} {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    pointer-events: none;
                    z-index: 999999;
                    animation: pulseVignette 1.5s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        showAlert() {
            const existingOverlay = document.getElementById(CONFIG.OVERLAY_ID);
            if (existingOverlay) existingOverlay.remove();

            const overlay = document.createElement('div');
            overlay.id = CONFIG.OVERLAY_ID;
            document.body.appendChild(overlay);

            setTimeout(() => overlay.remove(), CONFIG.ALERT_DURATION_MS);
        }
    }

    class App {
        constructor() {
            this.ui = new UIManager();
            this.listenForShortcut();
        }

        listenForShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key.toLowerCase() === CONFIG.TRIGGER_KEY) {
                    e.preventDefault();
                    this.runAnalysis();
                }
            });
        }

        runAnalysis() {
            const offerText = OfferExtractor.getOfferText();
            const experience = ExperienceExtractor.getRequiredExperience(offerText);

            console.log(`[Job Offer Analyzer] Années d'expérience détectées : ${experience}`);

            if (experience !== null && experience > CONFIG.EXPERIENCE_THRESHOLD) {
                this.ui.showAlert();
            }
        }
    }

    new App();

})();