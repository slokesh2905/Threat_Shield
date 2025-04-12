
# ThreatShield - Advanced Web Protection Documentation

## Overview
**ThreatShield** is a Chrome extension that blocks phishing and malicious websites in real-time using VirusTotal, OpenPhish, and other threat databases. It works by fetching the latest URLs from threat sources, checking URLs against VirusTotal and AbuseIPDB, and blocking malicious websites instantly.

### Features
1. **Real-time Blocking**: Block phishing and malicious websites automatically as you browse.
2. **VirusTotal Integration**: Check URLs against VirusTotal to identify if they are flagged as malicious.
3. **AbuseIPDB Integration**: Check IP reputation and block suspicious IP addresses.
4. **OpenPhish Integration**: Fetch phishing URLs in real-time and block them.
5. **User Reporting**: Allow users to report suspicious sites directly via the extension popup.
6. **Custom User Whitelisting**: Add specific domains to a whitelist to ensure no false positives.
7. **Dynamic Rules Update**: Automatically update the threat list at regular intervals.

## Installation
### Manual Installation (Unpacked)
1. **Clone or Download** the extension files (from GitHub or local source).
2. Open Google Chrome and go to **chrome://extensions/**.
3. Turn on **Developer mode** by toggling the switch at the top right.
4. Click **Load unpacked** and select the folder where the extension files are located.
5. The extension should now be installed and visible in the extensions toolbar.

### Permissions
The extension requires the following permissions:
- **storage**: Store and retrieve threat data locally.
- **webRequest & webRequestBlocking**: Block access to malicious websites.
- **notifications**: Display alerts when a malicious website is blocked.
- **activeTab & tabs**: Access the currently active tab's URL.
- **declarativeNetRequest**: Dynamically update the list of blocked URLs.

### Host Permissions
- **<all_urls>**: Grant access to all URLs visited for checking against threat sources.
- **VirusTotal**: https://www.virustotal.com/
- **OpenPhish**: https://openphish.com/
- **AbuseIPDB**: https://api.abuseipdb.com/

## Usage
### How it works:
1. The extension uses the **declarativeNetRequest API** to block URLs based on a dynamic list of malicious sites.
2. It fetches the latest phishing and malicious URLs using **OpenPhish**, **VirusTotal**, and **AbuseIPDB**.
3. If a website is flagged as malicious, it is blocked in real-time and the user is alerted through notifications.
4. Users can report suspicious sites via the extension's popup, and these sites will be added to the threat database.
5. Every hour, the extension updates its list of threats by fetching new URLs from OpenPhish.

### How to Report a Suspicious Website:
1. Click the extension icon in the toolbar.
2. Click **Report Suspicious Site**.
3. The current tab's URL will be added to the list of reported threats.
4. You’ll see a confirmation message once the site is successfully reported.

### How to Manually Update the Threat List:
1. Click the extension icon in the toolbar.
2. Click **Update Threat List**.
3. The threat database will be refreshed with new data from OpenPhish.

### Testing the Extension:
1. After installation, visit a website known to be flagged as phishing or malicious (e.g., a test phishing website).
2. The extension should block the site, show a notification, and prevent access.
3. Try reporting the site via the popup. The website will be added to the list of threats for future detection.

### Debugging:
- Open the **Console** in Chrome's Developer Tools to check for any extension-related logs or errors (Ctrl+Shift+I).
- Ensure that the required permissions and URLs are correctly set in the extension’s manifest file.
- If issues persist, check for any API key issues in **VirusTotal** and **AbuseIPDB**.

## Known Issues
1. **Service Worker Registration**: Service worker registration can sometimes fail due to permission issues in Chrome.
   - To resolve, ensure the `background` script in the manifest file uses the correct syntax for the service worker.
2. **Blocking Web Requests**: The extension may not be able to block requests in certain environments or without proper permissions.
   - Check the manifest and ensure `webRequestBlocking` permission is granted.
3. **VirusTotal API Issues**: If there are issues with the VirusTotal API, check the API key and ensure it has sufficient usage limits.

## FAQ
**Q1: Can I use this extension in Incognito Mode?**
Yes, you can enable Incognito mode support in Chrome’s extension settings.

**Q2: Is it safe to use my API keys in this extension?**
API keys are stored locally in the extension and are used only to make requests to the threat APIs. Ensure you keep your keys private.

**Q3: How often does the threat database update?**
The threat database updates every hour automatically.

## Support & Contributions
If you encounter any issues, feel free to open an issue on the GitHub repository. Contributions and pull requests are welcome!

---

© 2025 ThreatShield Inc. All rights reserved.
