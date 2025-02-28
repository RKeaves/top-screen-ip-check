// ==UserScript==
// @name         top-screen-ip-check
// @namespace    https://github.com/rkeaves
// @version      1.1
// @description  Monitors and displays the current IP address at the top of the screen, detecting any changes. Works on Windows
// @downloadURL  https://github.com/rkeaves/top-screen-ip-check-windows/raw/top-screen-ip-check.js
// @updateURL    https://github.com/rkeaves/top-screen-ip-check-windows/raw/main/top-screen-ip-check.js
// @author       rkeaves
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Change the following value to update the IP for leak detection.
    const IP_LEAK = '111.222.333.444';
    const OPACITY = 80;

    if (!navigator.platform.toLowerCase().includes('win')) {
        console.log('This script is exclusive for Windows.');
        return;
    }

    let currentIP = null;
    let lastIP = null;
    const checkInterval = 30000; // Default 30 seconds.

    const ipContainer = document.createElement('div');
    ipContainer.id = 'ipMonitorContainer';

    const alertBox = document.createElement('div');
    alertBox.id = 'ipAlertBox';

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
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 15px;
            opacity: ${OPACITY / 100};
        }
        #ipMonitorContainer.changed {
            background: #FF9800 !important;
        }
        #ipMonitorContainer.leak {
            background: red !important;
        }
        #ipAlertBox {
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
        #ipAlertBox.show {
            top: 20px;
        }
        .close-btn {
            cursor: pointer;
            margin-left: auto;
            font-weight: bold;
            opacity: 0.8;
        }
        .close-btn:hover {
            opacity: 1;
        }
    `);

    const ipDisplay = document.createElement('div');
    ipDisplay.id = 'ipDisplay';
    ipDisplay.innerHTML = '<strong>Current IP:</strong> <span id="ipValue">Fetching...</span>';
    ipContainer.appendChild(ipDisplay);

    const timeDisplay = document.createElement('span');
    timeDisplay.id = 'lastCheck';
    timeDisplay.style.fontSize = '0.9em';
    timeDisplay.style.opacity = '0.8';
    timeDisplay.textContent = 'Last checked: --:--:--';
    ipContainer.appendChild(timeDisplay);

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close monitor';
    closeBtn.addEventListener('click', () => {
        ipContainer.remove();
        alertBox.remove();
    });
    ipContainer.appendChild(closeBtn);

    document.body.appendChild(ipContainer);
    document.body.appendChild(alertBox);

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
                try {
                    const data = JSON.parse(response.responseText);
                    currentIP = data.ip;
                    document.getElementById('ipValue').textContent = currentIP;
                    const now = new Date();
                    timeDisplay.textContent = 'Last checked: ' + now.toLocaleTimeString();
                    if (currentIP === IP_LEAK) {
                        showAlert(`Warning: IP LEAK Detected ! - ${currentIP}`);
                        ipContainer.classList.add('leak');
                    } else {
                        ipContainer.classList.remove('leak');
                    }
                    if (lastIP && lastIP !== currentIP) {
                        ipContainer.classList.add('changed');
                        showAlert(`IP changed from ${lastIP} to ${currentIP}`);
                    } else {
                        ipContainer.classList.remove('changed');
                    }
                    lastIP = currentIP;
                } catch (e) {
                    console.error('Error parsing IP response:', e);
                    document.getElementById('ipValue').textContent = 'Error - retrying...';
                }
            },
            onerror: function(err) {
                console.error('Error fetching IP:', err);
                document.getElementById('ipValue').textContent = 'Connection error - retrying...';
            }
        });
    }

    updateIP();
    setInterval(updateIP, checkInterval);
})();
