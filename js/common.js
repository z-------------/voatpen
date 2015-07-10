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
