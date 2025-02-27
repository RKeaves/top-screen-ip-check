// ==UserScript==
// @name         top-screen-ip-check
// @namespace    https://github.com/rkeaves
// @version      1.0
// @description  Monitors and displays the current IP address at the top of the screen, detecting any changes.
// @downloadURL  https://github.com/rkeaves/top-screen-ip-check/raw/main/top-screen-ip-check.js
// @updateURL    https://github.com/rkeaves/top-screen-ip-check/raw/main/top-screen-ip-check.js
// @author       rkeaves
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    let currentIP = null;
    let lastIP = null;
    let checkInterval = 30000; // 30 seconds

    // Create notification container
    const ipContainer = document.createElement('div');
    ipContainer.id = 'ipMonitorContainer';

    // Add styles
    GM_addStyle(`
        #ipMonitorContainer {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-family: 'Arial', sans-serif;
            font-size: 14px;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        #ipMonitorContainer.changed {
            background: #FF9800 !important;
        }

        .ip-status {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ip-badge {
            background: rgba(0,0,0,0.1);
            padding: 4px 8px;
            border-radius: 3px;
            font-weight: bold;
        }

        .last-check {
            font-size: 0.9em;
            opacity: 0.8;
        }

        .alert-message {
            position: fixed;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: #f44336;
            color: white;
            padding: 16px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: top 0.5s ease;
            z-index: 10000;
        }

        .alert-message.show {
            top: 20px;
        }

        .close-btn {
            cursor: pointer;
            margin-left: 15px;
            opacity: 0.8;
        }

        .close-btn:hover {
            opacity: 1;
        }
    `);

    // Create alert element
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-message';
    document.body.appendChild(alertBox);

    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.title = 'Close monitor';
    closeBtn.addEventListener('click', () => {
        ipContainer.remove();
    });

    // IP display elements
    const ipDisplay = document.createElement('div');
    ipDisplay.className = 'ip-status';

    const ipLabel = document.createElement('span');
    ipLabel.textContent = 'Current IP:';

    const ipValue = document.createElement('span');
    ipValue.className = 'ip-badge';

    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'last-check';

    // Assemble container
    ipDisplay.appendChild(ipLabel);
    ipDisplay.appendChild(ipValue);
    ipContainer.appendChild(ipDisplay);
    ipContainer.appendChild(timeDisplay);
    ipContainer.appendChild(closeBtn);
    document.body.appendChild(ipContainer);

    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }

    function updateIP() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.ipify.org?format=json',
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                currentIP = data.ip;

                ipValue.textContent = currentIP;
                timeDisplay.textContent = `Last checked: ${new Date().toLocaleTimeString()}`;

                if (lastIP && lastIP !== currentIP) {
                    ipContainer.classList.add('changed');
                    showAlert(`IP Address Changed! From ${lastIP} to ${currentIP}`);
                } else {
                    ipContainer.classList.remove('changed');
                }

                lastIP = currentIP;
            },
            onerror: function(error) {
                console.error('IP check failed:', error);
                timeDisplay.textContent = 'Connection error - retrying...';
            }
        });
    }

    // Initial update
    updateIP();

    // Set up periodic checking
    setInterval(updateIP, checkInterval);

    // Add hover effect
    ipContainer.addEventListener('mouseenter', () => {
        ipContainer.style.opacity = '0.9';
    });

    ipContainer.addEventListener('mouseleave', () => {
        ipContainer.style.opacity = '1';
    });
})();