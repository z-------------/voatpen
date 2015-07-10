/* listen for click on voat */

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
