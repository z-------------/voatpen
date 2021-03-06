var pen_commentsLoaded = false; // becomes true after comments are loaded 1st time

var id, url, surverse; // global so refreshComments() can access

var pen_cachedComments = [];

var v;

var VOAT_BUTTONS_HTML = "<div class='pen_vote'>\
<button class='pen_vote_button pen_vote--up'>Up</button>\
<button class='pen_vote_button pen_vote--down'>Down</button>\
</div>";

var VOAT_COMMENT_COMPOSE_HTML = "<div class='pen_compose_container'>\
<textarea class='pen_compose' placeholder='Type your reply...'></textarea>\
<button class='pen_compose_send'>Send</button>\
</div>";

var elemContainer, elemSubmissionInfo, elemListComments;

/* function for turning a comment object into an element and appending it */

function displayComment(datum) {
    var elemComment = elem("div", ".pen_comment");
    elemComment.dataset.id = datum.id;
    elemComment.innerHTML = VOAT_BUTTONS_HTML + "<div class='pen_comment_content'></div>\
    <div class='pen_comment_author'></div><time class='pen_comment_time'></time>\
    <div class='pen_comment_actions'>\
    <button class='pen_comment_action--reply'>Reply</button>\
    </div>" + VOAT_COMMENT_COMPOSE_HTML;

    elemComment.querySelector(".pen_comment_content").innerHTML = datum.formattedContent;
    elemComment.querySelector(".pen_comment_author").textContent = datum.userName;
    elemComment.querySelector(".pen_comment_time").textContent = new Date(datum.date).toString();
    elemComment.querySelector(".pen_compose_container").classList.add("hidden");

    if (datum.parentID !== null) {
        var elemParentComment = elemListComments.querySelector(".pen_comment[data-id='" + datum.parentID + "']");
        elemParentComment.appendChild(elemComment);
    } else {
        elemListComments.appendChild(elemComment);
    }
}

/* function for loading and displaying the comments */

function loadComments(data) {
    id = data.id;
    url = data.url;
    subverse = data.subverse;

    console.log("going to load comments from submission", id, "on subverse", subverse , "for url", url);

    v = new Voat("m/7lZ30KOvfUsY58CpXvFw==");

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
                    pen_commentsLoaded = true;

                    /* setup elements */

                    elemContainer = elem("div", ".pen-container");
                    elemSubmissionInfo = elem("div", ".pen_info");
                    elemListComments = elem("div", ".pen_comments");
                    elemContainer.appendChild(elemSubmissionInfo);
                    elemContainer.appendChild(elemListComments);

                    document.body.appendChild(elemContainer);
                    document.body.classList.add("pen-opened");

                    /* listen for vote click */

                    elemContainer.addEventListener("click", function(e) {
                        if (e.target.classList.contains("pen_vote_button")) {
                            if (e.target.classList.contains("pen_vote--up")) {
                                direction = 1;
                            } else if (e.target.classList.contains("pen_vote--down")) {
                                direction = -1;
                            }
                            var type = (e.target.parentElement.parentElement.classList.contains("pen_info")
                                ? "submission" : "comment");

                            var id = e.target.parentElement.parentElement.dataset.id;

                            v.request("v1/vote/" + type + "/" + id + "/" + direction + "?revokeOnRevote=true", { verb: "POST" }, function(r) {
                                console.log(r);
                            });

                            e.target.classList.toggle("highlighted");
                        }
                    });

                    /* listen for reply compose button click */

                    elemContainer.addEventListener("click", function(e) {
                        if (e.target.classList.contains("pen_comment_action--reply")) {
                            e.target.parentElement.parentElement.querySelector(".pen_compose_container").classList.toggle("hidden");
                        }
                    });

                    /* listen for reply send button click */

                    elemContainer.addEventListener("click", function(e) {
                        if (e.target.classList.contains("pen_compose_send")) {
                            var type = (e.target.parentElement.parentElement.classList.contains("pen_info")
                                ? "submission" : "comment");
                            var id = e.target.parentElement.parentElement.dataset.id;
                            var requestUrl;
                            if (type === "submission") {
                                requestUrl = "v1/v/" + subverse + "/" + id + "/comment";
                            } else {
                                requestUrl = "v1/comments/" + id;
                            }
                            v.request(requestUrl, {
                                verb: "POST",
                                body: {
                                    value: e.target.parentElement.querySelector(".pen_compose").value
                                }
                            }, function(r) {
                                console.log(r);
                                refreshComments();

                                e.target.parentElement.classList.add("hidden");
                                e.target.parentElement.querySelector(".pen_compose").value = "";
                            });
                        }
                    });

                    /* get submission info */

                    console.log("requesting", "v1/submissions/" + id);
                    v.request("v1/submissions/" + id, function(r) {
                        console.log(r);
                        if (r.success) {
                            /* display info */
                            var title = r.data.title;
                            var date = new Date(r.data.date);
                            var subverse = r.data.subverse;
                            var author = r.data.userName;

                            elemSubmissionInfo.innerHTML = VOAT_BUTTONS_HTML + "<h1 class='pen_info_title'>" + title + "</h1>\
                            <div class='pen_info_author'>" + author + "</div>\
                            <time class='pen_info_time'>" + date + "</time>\
                            <div class='pen_info_subverse'>/v/" + subverse + "</div>"
                            + VOAT_COMMENT_COMPOSE_HTML;

                            elemSubmissionInfo.dataset.id = id;
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

                                displayComment(datum);
                            });

                            elemContainer.appendChild(elemListComments);

                            /* cache comments */
                            pen_cachedComments = r.data;
                        }
                    });
                } else {
                    console.log("auth fail");
                }
            });
        }
    });
}

/* function for refreshing comments */

function refreshComments() {
    console.log("requesting", "v1/v/" + subverse + "/" + id + "/comments");
    v.request("v1/v/" + subverse + "/" + id + "/comments", function(r) {
        console.log(r);
        if (r.success) {
            var newComments = [];

            var pen_cachedCommentsIds = pen_cachedComments.map(function(comment) {
                return comment.id;
            });

            r.data.forEach(function(datum) {
                if (pen_cachedCommentsIds.indexOf(datum.id) === -1) {
                    newComments.push(datum);
                }
            });

            newComments.forEach(function(newComment) {
                pen_cachedComments.push(newComment);
                displayComment(newComment);
            });

            console.log(newComments);
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
