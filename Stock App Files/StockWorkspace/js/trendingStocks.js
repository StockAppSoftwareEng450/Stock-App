function scrapeStock(){


    var getDataUri = function (targetUrl, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        xhr.open('GET', proxyUrl + targetUrl);
        xhr.responseType = 'blob';
        xhr.send();
    };

    // $.get('http://www.wallstreetsurvivor.com/investing-ideas/trending', function(response) {
    //     console.log(response);
    // });
}

scrapeStock();