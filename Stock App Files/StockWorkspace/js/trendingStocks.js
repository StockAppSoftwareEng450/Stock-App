var url = "https://cors-anywhere.herokuapp.com/" + "http://money.cnn.com/";
$.get(url, function(response) {
    var regex1 = /FCX/g
    var array1;

    while ((array1 = regex1.exec(response)) !== null) {
        console.log('Found ' + array1[0] + '. Next starts at ' + regex1.lastIndex + '.');

    }
})

