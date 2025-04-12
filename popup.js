// [Update Threat List]
document.getElementById("update").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "updateThreatDatabase" });
    alert("Threat list is being updated...");
});

// [Report Suspicious Site]
document.getElementById("report").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.runtime.sendMessage({ action: "reportThreat", url: tabs[0].url }, (response) => {
            alert(response.success ? "Threat reported successfully!" : "Error reporting threat.");
        });
    });
});

// [Whitelist a site]
document.getElementById("whitelist").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const domain = new URL(tabs[0].url).hostname;
        
        chrome.storage.local.get("whitelist", ({ whitelist }) => {
            whitelist = whitelist || [];
            if (!whitelist.includes(domain)) {
                whitelist.push(domain);
                chrome.storage.local.set({ whitelist });
                alert("Site added to whitelist.");
            } else {
                alert("Site is already whitelisted.");
            }
        });
    });
});

// [Show Threat List]
chrome.storage.local.get("threats", ({ threats }) => {
    const list = document.getElementById("threatList");
    list.innerHTML = threats ? threats.map(t => `<li>${t}</li>`).join("") : "<li>No threats detected</li>";
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize threat list
    updateThreatList();

    // Theme switching
    const themeToggle = document.getElementById('themeToggle');
    
    // Load saved theme preference or use system preference
    chrome.storage.local.get(['theme'], function(result) {
        if (result.theme) {
            document.documentElement.setAttribute('data-theme', result.theme);
        } else {
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    });

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        chrome.storage.local.set({ theme: newTheme });
    });

    // Button click handlers
    document.getElementById('update').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'updateThreatDatabase' }, (response) => {
            updateThreatList();
        });
    });

    document.getElementById('report').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.runtime.sendMessage({ 
                action: 'reportThreat', 
                url: tabs[0].url 
            });
        });
    });

    document.getElementById('whitelist').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const domain = new URL(tabs[0].url).hostname;
            
            chrome.storage.local.get('whitelist', ({ whitelist }) => {
                whitelist = whitelist || [];
                if (!whitelist.includes(domain)) {
                    whitelist.push(domain);
                    chrome.storage.local.set({ whitelist });
                }
            });
        });
    });

    // Update threat count
    chrome.storage.local.get(['threats'], function(result) {
        const threats = result.threats || [];
        document.getElementById('threatsCount').textContent = threats.length;
    });

    // Update last updated time
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
});

function updateThreatList() {
    chrome.storage.local.get(['threats'], ({ threats }) => {
        const threatList = document.getElementById('threatList');
        const threatCount = document.getElementById('threatsCount');
        
        threats = threats || [];
        threatCount.textContent = threats.length;
        
        if (threats.length === 0) {
            threatList.innerHTML = '<li>No threats detected</li>';
            return;
        }

        threatList.innerHTML = threats
            .map(threat => `<li>${threat}</li>`)
            .join('');
    });
}
