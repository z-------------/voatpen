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

/* insert pen markup */

var container = elem("div", ".pen-container");
container.classList.add("hidden");

var buttonsContainer = elem("div", ".pen_buttons");
var closeButton = elem("button", ".pen_buttons--close-button");
buttonsContainer.appendChild(closeButton);
container.appendChild(buttonsContainer);

var contentContainer = elem("div", ".pen_content");

var contentFrame = elem("iframe", ".pen_content--frame");
contentContainer.appendChild(contentFrame);

var contentComments = elem("div", ".pen_content--comments");
contentContainer.appendChild(contentComments);
var commentsList = elem("ul", ".pen_content--comments--list");
contentComments.appendChild(commentsList);

container.appendChild(contentContainer);

document.body.appendChild(container);
