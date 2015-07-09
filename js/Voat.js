var Voat = function(key, baseUrl) {
    var key = key;

    this.getKey = function() {
        return key;
    };

    this.request = function() {
        var endpoint = arguments[0];
        var data = {};
        var callback = function(r) {
            console.log(r);
        };

        if (typeof arguments[1] === "object" && arguments[1] !== null) {
            var data = arguments[1];
        }

        if (arguments[arguments.length - 1] === "function") {
            var callback = arguments[arguments.length - 1];
        }

        var url = "http://fakevout.azurewebsites.net/api/v1/" + endpoint;

        var xhr = new XMLHttpRequest();

        xhr.onload = function(){
            var response = JSON.parse(this.responseText);
            callback(response);
        };

        xhr.open("get", url, true);

        xhr.setRequestHeader("Voat-ApiKey", key);

        xhr.send();
    };
};
