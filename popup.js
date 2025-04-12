// 🛠 Update Threat List
document.getElementById("update").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "updateThreatDatabase" });
    alert("🚀 Threat list is being updated...");
});

// 🚨 Report Suspicious Site
document.getElementById("report").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.sendMessage({ action: "reportThreat", url: tabs[0].url }, (response) => {
            alert(response.success ? "✅ Threat reported successfully!" : "❌ Error reporting threat.");
        });
    });
});

// ✅ Whitelist a site
document.getElementById("whitelist").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const domain = new URL(tabs[0].url).hostname;
        
        chrome.storage.local.get("whitelist", ({ whitelist }) => {
            whitelist = whitelist || [];
            if (!whitelist.includes(domain)) {
                whitelist.push(domain);
                chrome.storage.local.set({ whitelist });
                alert("✅ Site added to whitelist.");
            } else {
                alert("⚪ Site is already whitelisted.");
            }
        });
    });
});

// 🔍 Show Threat List
chrome.storage.local.get("threats", ({ threats }) => {
    const list = document.getElementById("threatList");
    list.innerHTML = threats ? threats.map(t => `<li>${t}</li>`).join("") : "<li>🔍 No threats detected</li>";
});
