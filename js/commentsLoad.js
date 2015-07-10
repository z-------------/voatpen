/* function for loading and displaying the comments */

function loadComments(data) {
    var id = data.id;
    var url = data.url;
    var subverse = data.subverse;

    console.log("going to load comments from submission", id, "on subverse", subverse , "for url", url);

    var v = new Voat("m/7lZ30KOvfUsY58CpXvFw==");

    /* get username and password from chrome.storage */

    var username, password;

    chrome.storage.local.get("authentication", function(r) {
        if (r.authentication) {
            username = r.authentication.username;
            password = r.authentication.password;

            console.log("authing using user", username, "and pass", password);
            v.authorize(username, password, function(r) {
                if (v.getToken()) {
                    console.log("auth success");
                    console.log("requesting", "v1/v/" + subverse + "/" + id + "/comments");
                    v.request("v1/v/" + subverse + "/" + id + "/comments", function(r) {
                        console.log(r);
                    });
                } else {
                    console.log("auth fail");
                }
            });
        }
    });
}

/* listen for message from background.js to load voat comments on non-voat page */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "open") {
        console.log("background.js says load voat comments on this page");
        loadComments(request.data);
    }
});
