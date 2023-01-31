// ==UserScript==
// @name         Netflix Subtitles For "Zhongwen Chinese Dictionary"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces the netflix subtitles HTML element with another, but better suited for extensions like "Zhongwen Chinese Dictionary" to read
// @author       Pietro Carrara
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// ==/UserScript==

// Selects an element, but waits until it's created (instead of just failing if it's not found)
function waitForEl(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(async function() {
    'use strict';

    // Find Netflix's subtitles container
    const netflix = await waitForEl('.player-timedtext');

    // Container we'll use to display subtitles
    const subtitle = document.createElement('div');
    subtitle.classList.add('netflix-sans-font-loaded');
    subtitle.style.zIndex = 100;
    subtitle.style.display = 'block';
    subtitle.style.textAlign = 'center';
    subtitle.style.whiteSpace = 'nowrap';
    subtitle.style.position = 'absolute';
    subtitle.style.width = '100%';
    subtitle.style.textShadow = '-1px 0px #000000,0px 1px #000000,1px 0px #000000,0px -1px #000000';
    subtitle.style.color = '#ffffff';
    subtitle.style.fontSize = '4em';
    subtitle.style.fontWeight = 'bolder';
	// font-family: Netflix Sans,Helvetica Nueue,Helvetica,Arial,sans-serif;
    document.body.prepend(subtitle);

    // TODO: Setup clone element, hide children of <netflix>

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            // Stop showing the subtitles when we're supposed do
            for (let node of mutation.removedNodes) {
                if (node.innerText == subtitle.innerText) {
                    subtitle.innerText = '';
                }
            }

            // Hide original subtitles
            for (let node of mutation.addedNodes) {
                subtitle.innerText = node.innerText;
                subtitle.style.bottom = node.style.bottom;
                node.style.display = 'none';
            }
        }
    });

    observer.observe(netflix, {
        childList: true,
        subtree: true,
    });
})();
