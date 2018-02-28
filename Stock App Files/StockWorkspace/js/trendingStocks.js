var url = "https://cors-anywhere.herokuapp.com/" + "http://money.cnn.com/";
$.get(url, function(response) {
    //var cnnTable = response.replace(/<strong class="e63d1fd7">FCX/g).match(/FCX/g).length;
    //console.log(cnnTable);
    document.body.innerHTML = response;
});

