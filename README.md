# top-screen-ip-check

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/rkeaves/top-screen-ip-check)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

---

## Overview

**top-screen-ip-check** is a lightweight userscript that monitors and displays your current public IP address at the top center of your screen. By fetching your IP using the [ipify](https://www.ipify.org/) API every 30 seconds, it not only shows your current IP along with the time of the last check but also detects any changes in your IP address. When a change is detected, a visual alert and notification are triggered, providing you with immediate feedback.

---

## Warning

**This script is for monitoring purposes only.**  
Before using, please be aware that:
- The script relies on an external API (ipify) to fetch your IP address. If the API becomes inaccessible or rate limits your requests, the monitor may not update correctly.
- Frequent polling (every 30 seconds by default) could lead to rate limiting by the API service.
- It is intended for personal use and does not provide any privacy or security enhancements.

> **❗ Important:**  
> 1. Test the script in your environment to ensure it functions as expected.  
> 2. Modify the check interval if you experience any connectivity issues or rate limiting.

---

## Table of Contents

- [Overview](#overview)
- [Warning](#warning)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Linux Support](#linux-support)
- [Configuration & Customization](#configuration--customization)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Real-time IP Monitoring:** Continuously fetches and displays your public IP address.
- **IP Change Detection:** Highlights the monitor and displays an alert when your IP address changes.
- **Timestamped Updates:** Shows the exact time of the last successful IP check.
- **Customizable UI:** A floating, responsive UI positioned at the top center of your screen.
- **Dismissible Display:** Easily remove the monitor using the integrated close button.
- **Lightweight & Efficient:** Uses Tampermonkey/Greasemonkey APIs (GM_xmlhttpRequest and GM_addStyle) for seamless integration and performance.

---

## Installation

To install **top-screen-ip-check**:

1. **Install a Userscript Manager:**
   - [Tampermonkey](https://www.tampermonkey.net/)

2. **Add the Script:**
   - Visit the [raw script URL](https://raw.githubusercontent.com/RKeaves/top-screen-ip-check/main/top-screen-ip-check.js).
   - **Copy** all the script code.
   - Open your Tampermonkey dashboard, create a new script, and paste the copied code into the editor.
   - Save the new script—your installation will now support automatic updates via the defined @updateURL.

3. **Supported Sites:**
   - The script is configured to run on all websites (*://*/*), ensuring that your IP monitor is always active.

---

## Usage

1. **Monitoring Your IP:**
   - Once installed, a floating monitor appears at the top center of every webpage.
   - It displays your current public IP along with the time of the last check.

2. **Change Alerts:**
   - When a change in your IP is detected, the background color of the monitor shifts (from green to orange), and a temporary alert appears with details of the change.

3. **Dismissal:**
   - If you no longer need the monitor, click the close button (×) to remove it from the screen.

---

## Linux Support

A dedicated Linux version of **top-screen-ip-check** is now available! This script is designed to run exclusively on Linux systems and provides the same functionality with a platform check.

1. **Installation for Linux Users:**
   - Download the Linux script from the [raw script URL](https://raw.githubusercontent.com/RKeaves/top-screen-ip-check/main/top-screen-ip-check-linux.js).
   - **Copy** the entire code.
   - Open your preferred userscript manager (e.g., Tampermonkey) and create a new script.
   - Paste the copied code into the editor and save it.

2. **How It Works:**
   - The Linux version includes a platform check and will only execute on Linux systems.
   - It fetches your public IP address every 30 seconds using the [ipify](https://www.ipify.org/) API.
   - On detecting an IP change, it triggers a visual alert and updates the display accordingly.

---

## Configuration & Customization

- **Check Interval:**  
  The script checks your IP address every **30 seconds** by default.  
  *Tip:* Modify the `checkInterval` variable in the script to adjust the polling frequency.

- **UI Styling:**  
  The monitor’s appearance is defined via inline CSS added by GM_addStyle. You can customize colors, fonts, and layout by editing the style block within the script.

- **Error Handling:**  
  If the IP fetching fails (e.g., due to connectivity issues), the script logs the error to the console and updates the display with a "Connection error - retrying..." message.

- **Alert Duration:**  
  Change notifications are visible for 5 seconds before automatically disappearing. You can adjust this timing within the `showAlert` function.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear, descriptive messages.
4. Submit a pull request explaining your modifications.

For major changes, please open an issue first to discuss your plans.

---

## Roadmap

- **Future Enhancements:**
  - Add a settings panel for dynamic configuration of the check interval and styling.
  - Integrate alternative IP detection services to provide redundancy.
  - Enhance error logging and display more detailed network diagnostics.
  - Provide options for manual refresh and custom alert settings.

---

## License

This project is licensed under the [GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html).

---
