var linkHistory = [];
var tabHistory = [];

function tabListener(tab) {
    console.log(tab.url);
    if (linkHistory[linkHistory.length - 1].url === tabHistory[tabHistory.length - 1].url) {
        console.log("time to load voat comments");
        chrome.tabs.sendMessage(tab.id, { type: "open" }, function() {
            console.log("told tab to load voat comments");
        });
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("link clicked" , request.data);
    linkHistory.push(request.data);
});

chrome.tabs.onUpdated.addListener(function(i, c, tab) {
    if (c.status === "complete") {
        console.log("page loaded", tab.url);
        tabHistory.push({
            url: tab.url
        });
        tabListener(tab);
    }
});
