var Voat = function(key, baseUrl) {
    var key = key;

    this.getKey = function() {
        return key;
    };

    this.request = function(endpoint, callback) {
        if (!callback || typeof callback !== "function") {
            var callback = function(r) {
                console.log(r);
            };
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
