const VIRUSTOTAL_API_KEY = "3444fe93265bf5dba8098fa665d594189a19433779c04f8b1a9e198ac5a1574c";
const THREAT_APIS = {
    virusTotal: "https://www.virustotal.com/api/v3/urls",
    openPhish: "https://openphish.com/feed.txt"
};

let threatList = new Set();

// 🔄 Fetch latest phishing URLs from OpenPhish
async function updateThreatDatabase() {
    try {
        const response = await fetch(THREAT_APIS.openPhish);
        const data = await response.text();
        
        // Remove empty or invalid URLs
        const validUrls = data.split("\n").map(url => url.trim()).filter(url => url.length > 3);
        
        threatList = new Set(validUrls);
        chrome.storage.local.set({ threats: [...threatList] });

        // Update Declarative Net Request (DNR) Rules
        const rules = [...threatList].slice(0, 5000).map((url, index) => ({
            id: index + 1,
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: url }
        }));

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: rules.map(rule => rule.id),
            addRules: rules
        });

        console.log("✅ Threat database updated with", threatList.size, "entries.");
    } catch (error) {
        console.error("❌ Error fetching OpenPhish data:", error);
    }
}

// 🔍 Check URL against VirusTotal
async function checkVirusTotal(url) {
    try {
        const response = await fetch(THREAT_APIS.virusTotal, {
            method: "POST",
            headers: {
                "x-apikey": VIRUSTOTAL_API_KEY,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `url=${encodeURIComponent(url)}`
        });

        const data = await response.json();
        
        if (!data.data || !data.data.attributes || !data.data.attributes.last_analysis_stats) {
            console.warn("⚠️ VirusTotal response is incomplete:", data);
            return false;
        }

        return data.data.attributes.last_analysis_stats.malicious > 0;
    } catch (error) {
        console.error("❌ VirusTotal API error:", error);
        return false;
    }
}

// 🕒 Schedule Threat Database Updates Every Hour
chrome.alarms.create("updateThreats", { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updateThreats") updateThreatDatabase();
});

// 📩 Handle User-Reported Threats
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reportThreat") {
        if (!threatList.has(request.url)) {
            threatList.add(request.url);
            chrome.storage.local.set({ threats: [...threatList] });
        }
        sendResponse({ success: true });
    }
});
