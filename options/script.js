var form = document.querySelector("#options");

var usernameInput = form.username;
var passwordInput = form.password;

var saveBtn = document.querySelector("#save");

var outputElem = document.querySelector("#output");

form.onsubmit =  function(e) {
    e.preventDefault();

    chrome.storage.local.set({
        authentication: {
            username: usernameInput.value,
            password: passwordInput.value
        }
    }, function() {
        outputElem.textContent = "Options saved.";
    });
};

chrome.storage.local.get("authentication", function(r) {
    if (r.authentication) {
        usernameInput.value = r.authentication.username;
        passwordInput.value = r.authentication.password;
    }
});
