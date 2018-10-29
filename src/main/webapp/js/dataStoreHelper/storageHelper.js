

function fetchKey( key) {
    var EXTENSION_ID = document.getElementById("extension_id").innerText;
    console.log(EXTENSION_ID + "from fetch");
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
    var EXTENSION_ID = document.getElementById("extension_id").innerText;
    console.log(EXTENSION_ID + "from update");
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