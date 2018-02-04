"use strict";

var resultStockSymbol = null;

// Takes in the url
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = [], i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

$(document).ready(function() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Array with stockSymbol in [0]
            var testDG = parseURLParams(window.location.href);
            var variable1 = testDG['stock'];
            var stockSymbol = variable1[0];

            // On refresh loads back to screen 1
            if (stockSymbol === undefined) {
                // Display error to the user and return user to homepage
                console.log("reached undefined");
                window.location.href = "index.html";
            }
            resultStockSymbol = stockSymbol;

            //getting portfolio information and save it
            var refPortfolio = firebase.database().ref("Portfolios");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        console.log("StockSymbol: " + value.child("stockSymbol").val());
                        if(stockSymbol == value.child("stockSymbol").val()){
//change css to state "stock in symbole" + change custom-attribute
                            document.getElementById("portfolioButton").setAttribute("data-inPortfolio", true);
                            document.getElementById("portfolioButton").setAttribute("data-pk", value.key);
                        }
                    });
                }
                // activate portfolio button (deactivate it as default)
                document.getElementById("portfolioButton").disabled = false;
            });

            //getting watchlist information and save it
            var refWatchlist = firebase.database().ref("Watchlists");
            refWatchlist.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        if(stockSymbol == value.child("stockSymbol").val()){
//change css to state "stock in symbole" + change custom-attribute
                            document.getElementById("watchlistButton").setAttribute("data-inWatchlist", true);
                            document.getElementById("watchlistButton").setAttribute("data-pk", value.key);
                        }
                    });
                }
                // activate portfolio button (deactivate it as default)
                document.getElementById("watchlistButton").disabled = false;
            });

            // Parsing Stock Quote
            var parser = document.createElement('a');
            parser.href = "https://api.iextrading.com/1.0/stock/";
            parser.StockName = stockSymbol;
            var url = parser.href;
            var stockName = parser.StockName;
            var resultUrl = url + stockName;
            var addQuote = "/quote";
            resultUrl = resultUrl + addQuote;

            // Verifying the url
//            console.log(resultUrl);

            setInterval(function () {
                $.ajax({
                    url: resultUrl,
                    success: function (data) {
//                        console.log(data);
                        var response = (data);
                        var companyName = response.companyName;
                        var latestPrice = response.latestPrice;
                        var symbol = response.symbol;

                        document.getElementById("CompanyName").innerHTML = companyName;
                        document.getElementById("StockPrice").innerHTML = latestPrice;
                        document.getElementById("StockSymbolUpperCase").innerHTML = symbol;

                        //verifying information has been grabbed successfully
//                        console.log(companyName);
//                        console.log(latestPrice);
//                        console.log(symbol);
                    },
                    error: function(error){
                        // Handle Errors here.
                        console.log(error.responseText);
                        //alert(error.responseText);
                    }
                });
            }, 3000);

            // Grabbing the peers(related Companies) and displaying them to an ul on the DOM
            var peersUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/peers";
//            console.log(peersUrl);

            $.ajax({
                url: peersUrl,
                success: function (data) {
                    d3.json(peersUrl, function (error, data) {
//                        console.log("peers: " + data);

                        function makeUL(array) {
                            var list = document.createElement('ul');
                            for (var i = 0; i < array.length; i++) {
                                var item = document.createElement('li');
                                item.appendChild(document.createTextNode(array[i]));
                                list.appendChild(item);
                            }
                            return list;
                        }

                        document.getElementById('peers').appendChild(makeUL(data));
                        //document.getElementById('peers').style.paddingLeft = "20px";
                    });
                },

                error: function(error){
                    // Handle Errors here.
                    console.log(error.responseText);
                    //alert(error.responseText);
                }
            });

            // Company About Page
            var companyDescriptionUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/company";

            $.ajax({
                url: companyDescriptionUrl,
                success: function (data) {
                    d3.json(companyDescriptionUrl, function (error, data) {
//                        console.log(data.description);

                        document.getElementById("aboutCompany").innerHTML = data.description;

                    });
                },

                error: function(error){
                    // Handle Errors here.
                    console.log(error.responseText);
                    //alert(error.responseText);
                }
            });

        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
});

function AddToPortfolio () {
    var user = firebase.auth().currentUser;

    //console.log(document.getElementById("portfolioButton").getAttribute("data-inPortfolio"));
    //console.log(document.getElementById("portfolioButton").getAttribute("data-pk"));

    if(document.getElementById("portfolioButton").getAttribute("data-inPortfolio") === "true"){
        firebase.database().ref("Portfolios/" + document.getElementById("portfolioButton").getAttribute("data-pk")).remove();

        document.getElementById("portfolioButton").setAttribute("data-inPortfolio", false);
        document.getElementById("portfolioButton").setAttribute("data-pk", null);
    } else {
        firebase.database().ref('Portfolios/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        });

        document.getElementById("portfolioButton").setAttribute("data-inPortfolio", true);
        setPK("portfolioButton");
    }
}

function AddToWatchlist () {
    var user = firebase.auth().currentUser;

    //console.log(document.getElementById("watchlistButton").getAttribute("data-inWatchlist"));
    //console.log(document.getElementById("watchlistButton").getAttribute("data-pk"));

    if(document.getElementById("watchlistButton").getAttribute("data-inWatchlist") === "true"){
        firebase.database().ref("Watchlists/" + document.getElementById("watchlistButton").getAttribute("data-pk")).remove();

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", false);
        document.getElementById("watchlistButton").setAttribute("data-pk", null);
    } else {
        firebase.database().ref('Watchlists/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        });

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", true);
        setPK("watchlistButton");
    }

}

function setPK(button){
    var user = firebase.auth().currentUser;

    var ref = null;
    if(button === "portfolioButton"){
        ref = firebase.database().ref("Portfolios");
    } else {
        ref = firebase.database().ref("Watchlists");
    }

    ref.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
        if(snapshot.exists()){
            snapshot.forEach(function (value){
                console.log("StockSymbol1: " + value.child("stockSymbol").val());
                if(resultStockSymbol == value.child("stockSymbol").val()){
                    document.getElementById(button).setAttribute("data-pk", value.key);
                }
            });
        }
    });
}