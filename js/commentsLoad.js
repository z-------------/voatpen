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

                    /* setup elements */

                    var elemContainer = elem("div", ".pen-container");
                    var elemSubmissionInfo = elem("div", ".pen_info");
                    var elemListComments = elem("div", ".pen_comments");
                    elemContainer.appendChild(elemSubmissionInfo);
                    elemContainer.appendChild(elemListComments);

                    document.body.appendChild(elemContainer);
                    document.body.classList.add("pen-opened");

                    /* get submission info */

                    console.log("requesting", "v1/submissions/" + id);
                    v.request("v1/submissions/" + id, function(r) {
                        console.log(r);
                        if (r.success) {
                            /* display info */
                            var title = r.data.title;
                            var date = new Date(r.data.date);
                            var subverse = r.data.subverse;
                            elemSubmissionInfo.innerHTML = "<h1>" + title + "</h1><time>" + date + "</time><div>/v/" + subverse + "</div>";
                        }
                    });

                    /* get comments */

                    console.log("requesting", "v1/v/" + subverse + "/" + id + "/comments");
                    v.request("v1/v/" + subverse + "/" + id + "/comments", function(r) {
                        console.log(r);
                        if (r.success) {
                            /* display comments */
                            r.data.forEach(function(datum) {
                                console.log(datum);

                                var elemComment = elem("div", ".pen_comment");
                                elemComment.dataset.id = datum.id;
                                elemComment.innerHTML = "<div class='pen_comment_content'></div>\
                                <div class='pen_comment_author'></div><time class='pen_comment_time'></time>";

                                elemComment.querySelector(".pen_comment_content").innerHTML = datum.formattedContent;
                                elemComment.querySelector(".pen_comment_author").textContent = datum.userName;
                                elemComment.querySelector(".pen_comment_time").textContent = new Date(datum.date).toString();

                                if (datum.parentID !== null) {
                                    var elemParentComment = elemListComments.querySelector(".pen_comment[data-id='" + datum.parentID + "']");
                                    elemParentComment.appendChild(elemComment);
                                } else {
                                    elemListComments.appendChild(elemComment);
                                }
                            });

                            elemContainer.appendChild(elemListComments);
                        }
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
