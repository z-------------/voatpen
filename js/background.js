var linkHistory = [];
var tabHistory = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("link clicked" , request.data);
    linkHistory.push(request.data);
});

function tabListener(tab) {
    console.log(tab.url);
    if (linkHistory[linkHistory.length - 1].url === tabHistory[tabHistory.length - 1].url) {
        console.log("time to load voat comments");
    }
}

chrome.tabs.onUpdated.addListener(function(i, c, tab) {
    if (c.status === "complete") {
        tabHistory.push({
            url: tab.url
        });
        tabListener(tab);
    }
});
