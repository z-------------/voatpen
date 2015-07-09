console.log("voatpen running.");

function elem(tagName, classOrId) {
    var elem = document.createElement(tagName);

    if (classOrId[0] === ".") {
        elem.classList.add(classOrId.substring(1));
    } else if (classOrId[0] === "#") {
        elem.setAttribute("id", classOrId.substring(1));
    }

    return elem;
}

/* listen for click */

document.querySelector(".sitetable").addEventListener("click", function(e) {
    console.log("click event");
    if (e.target.tagName.toLowerCase() === "a" && e.target.classList.contains("title")) {
        console.log("is link click");
        chrome.runtime.sendMessage({
            type: "click",
            data: {
                id: e.target.parentElement.parentElement.parentElement.dataset.fullname,
                url: e.target.href
            }
        });
    }
});
