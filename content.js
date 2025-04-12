chrome.storage.local.get(["threats", "whitelist"], ({ threats, whitelist }) => {
    const currentUrl = new URL(window.location.href);
    const domain = currentUrl.hostname;

    // Check if the site is in whitelist
    if (whitelist && whitelist.includes(domain)) {
        console.log("⚪ Site is whitelisted, skipping block.");
        return;
    }

    // Check if the site is in the threat database
    if (threats && threats.some(threat => currentUrl.href.includes(threat) || domain.includes(threat))) {
        alert("🚨 WARNING: This website is flagged as a phishing/malware site!");
        window.location.href = "about:blank"; // 🚫 Block access
    }
});
