var Voat = function(key) {
    var key = key;
    var token = null;

    this.getKey = function() {
        return key;
    };

    this.getToken = function() {
        return token;
    };

    this.setToken = function(newToken) {
        token = newToken;
    };

    this.request = function() {
        var endpoint = arguments[0];
        var data = null;
        var callback = function(r) {
            console.log(r);
        };

        if (typeof arguments[1] === "object" && arguments[1] !== null) {
            var data = arguments[1];
        }

        if (typeof arguments[arguments.length - 1] === "function") {
            var callback = arguments[arguments.length - 1];
        }

        var url = "https://fakevout.azurewebsites.net/api/" + endpoint;

        /* determine verb (GET or POST) */

        var verb = "GET";
        if (data && data.verb && typeof data.verb === "string") {
            verb = data.verb.toUpperCase();
        }

        /* determine Content-Type of data (json or form) */

        var contentTypeShortforms = {
            "json": "application/json",
            "form": "application/x-www-form-urlencoded"
        };

        var contentType = "application/json";
        if (data && data.type && typeof data.type === "string") {
            if (contentTypeShortforms.hasOwnProperty(data.type)) {
                contentType = contentTypeShortforms[data.type];
            } else {
                contentType = data.type;
            }
        }

        /* make and send the request */

        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            var response = JSON.parse(this.responseText);
            callback(response);
        };

        /* encode params */

        var params;

        if (data && data.body) {
            if (contentType === "application/json") {
                params = JSON.stringify(data.body);
            } else if (contentType === "application/x-www-form-urlencoded" || verb === "GET") {
                var paramsArr = [];
                Object.keys(data.body).forEach(function(key) {
                    var val = data.body[key];
                    paramsArr.push(key + "=" + val);
                });
                params = paramsArr.join("&");
            }

            if (verb === "GET") {
                url += "?" + params;
            }
        }

        /* send request */

        xhr.open(verb, url, true);

        xhr.setRequestHeader("Voat-ApiKey", key);
        if (token) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
        if (verb === "POST") {
            xhr.setRequestHeader("Content-Type", contentType);
        }

        xhr.send(verb === "POST" ? params : null);
    };

    this.authorize = function(user, pass, callback) {
        this.request("token", {
            verb: "POST",
            type: "application/x-www-form-urlencoded",
            body: {
                "grant_type": "password",
                "username": user,
                "password": pass
            }
        }, function(r) {
            if (r.access_token) {
                token = r.access_token;
            }
            callback(r);
        });
    };
};
