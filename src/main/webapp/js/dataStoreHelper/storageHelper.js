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

function updateKey(obj) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(EXTENSION_ID, {update: obj},
            function (response) {
                // if (response.success)
                console.log(response);
                //alert(response.socialSites);
                resolve(response);
            });
    });
}