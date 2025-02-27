// ==UserScript==
// @name         top-screen-ip-check-linux
// @namespace    https://github.com/rkeaves
// @version      1.0
// @description  Monitors and displays the current IP address at the top of the screen, detecting any changes. Works on Linux
// @downloadURL  https://github.com/rkeaves/top-screen-ip-check-linux/raw/top-screen-ip-check-linux.js
// @updateURL    https://github.com/rkeaves/top-screen-ip-check-linux/raw/main/top-screen-ip-check-linux.js
// @author       rkeaves
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Only run this script on Linux
    if (!navigator.platform.toLowerCase().includes('linux')) {
        console.log('This script is exclusive for Linux.');
        return;
    }

    let currentIP = null;
    let lastIP = null;
    const checkInterval = 30000; // 30 seconds

    // Create the IP display container
    const ipContainer = document.createElement('div');
    ipContainer.id = 'ipMonitorContainer';

    // Create the alert box for IP change notifications
    const alertBox = document.createElement('div');
    alertBox.id = 'ipAlertBox';

    // Add styles for the monitor and alert box
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
        }
        #ipMonitorContainer.changed {
            background: #FF9800 !important;
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

    // Build the IP display content
    const ipDisplay = document.createElement('div');
    ipDisplay.id = 'ipDisplay';
    ipDisplay.innerHTML = '<strong>Current IP:</strong> <span id="ipValue">Fetching...</span>';
    ipContainer.appendChild(ipDisplay);

    // Build the last checked time display
    const timeDisplay = document.createElement('span');
    timeDisplay.id = 'lastCheck';
    timeDisplay.style.fontSize = '0.9em';
    timeDisplay.style.opacity = '0.8';
    timeDisplay.textContent = 'Last checked: --:--:--';
    ipContainer.appendChild(timeDisplay);

    // Create a close button so the user can remove the monitor
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.title = 'Close monitor';
    closeBtn.addEventListener('click', () => {
        ipContainer.remove();
        alertBox.remove();
    });
    ipContainer.appendChild(closeBtn);

    // Append the containers to the page
    document.body.appendChild(ipContainer);
    document.body.appendChild(alertBox);

    // Function to show the alert message when the IP changes
    function showAlert(message) {
        alertBox.textContent = message;
        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 5000);
    }

    // Function to update the IP using GM_xmlhttpRequest
    function updateIP() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.ipify.org?format=json',
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    currentIP = data.ip;
                    document.getElementById('ipValue').textContent = currentIP;
                    // Update last checked time
                    const now = new Date();
                    timeDisplay.textContent = 'Last checked: ' + now.toLocaleTimeString();
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

    // Run the initial check and then every 30 seconds
    updateIP();
    setInterval(updateIP, checkInterval);
})();
