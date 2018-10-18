var EXTENSION_ID = "odljaphhcggnlafaaonbbnpbofigmelf";

function fetchKey( key) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(EXTENSION_ID, {fetch: key},
            function (response) {
                // if (response.success)
                console.log(response);
          //      alert(response.socialSites);
                resolve(response);

            });
    });
}

function updateKey(key, value) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(EXTENSION_ID, {update: [key, value]},
            function (response) {
                // if (response.success)
                console.log(response);
                //alert(response.socialSites);
                resolve(response);
            });
    });
}