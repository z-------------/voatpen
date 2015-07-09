var Voat = function(key, baseUrl) {
    var key = key;

    this.getKey = function() {
        return key;
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

        if (arguments[arguments.length - 1] === "function") {
            var callback = arguments[arguments.length - 1];
        }

        var url = "http://fakevout.azurewebsites.net/api/" + endpoint;

        /* determine if request should be GET or POST */

        var verb = "GET";

        if (data) {
            verb = "POST";
        }

        /* make and send the request */

        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            var response = JSON.parse(this.responseText);
            callback(response);
        };

        xhr.open(verb, url, true);

        xhr.setRequestHeader("Voat-ApiKey", key);
        if (verb === "POST") {
            var params = [];
            if (typeof data.body === "object" && data.body !== null) {
                Object.keys(data.body).forEach(function(key) {
                    var val = data.body[key];
                    params.push(key + "=" + val);
                });
            }

            var paramsStr = params.join("&");

            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        xhr.send(paramsStr || null);
    };
};
