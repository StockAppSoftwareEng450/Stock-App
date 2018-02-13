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
                            //document.getElementById("portfolioButton").innerText = " Remove from Portfolio";

                            $("#portfolioButton").addClass("fa fa-minus");

                            // Toggle off the addstockportfolio div
                            var div1 = document.getElementById('AddStocktoPortfolio');
                            div1.style.display = "none";
                            console.log("onstart");
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
                            //document.getElementById("watchlistButton").innerText = " Remove from Watchlist";

                            $("#watchlistButton").addClass("fa fa-minus");
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
            // console.log(resultUrl);

            setInterval(function () {
                $.ajax({
                    url: resultUrl,
                    success: function (data) {
                        //console.log(data);
                        var response = (data);
                        var companyName = response.companyName;
                        var latestPrice = response.latestPrice;
                        var symbol = response.symbol;

                        document.getElementById("CompanyName").innerHTML = companyName;
                        document.getElementById("StockPrice").innerHTML = latestPrice;
                        document.getElementById("StockSymbolUpperCase").innerHTML = symbol;

                        //verifying information has been grabbed successfully
                        // console.log(companyName);
                        // console.log(latestPrice);
                        // console.log(symbol);
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
            //console.log(peersUrl);

            $.ajax({
                url: peersUrl,
                success: function (data) {

                    console.log("peers: " + data);

                        // for each peer in the list
                        for (var i = 0; i < data.length; i++){
                            console.log(i + " " + data[i]);

                            var peerName = data[i];

                            // var returnedprice = grabpeerStockPrice(peerName);
                            // console.log(returnedprice);
                            peersStatsUrlGrab(peerName);

                        }

                },

                // Error checking
                error: function(error){
                    console.log(error.responseText);

                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            // Company About Page
            var companyDescriptionUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/company";

            $.ajax({
                url: companyDescriptionUrl,
                success: function (data) {
                    d3.json(companyDescriptionUrl, function (error, data) {
                        document.getElementById("aboutCompany").innerHTML = data.description;
                    });
                },

                error: function(error){
                    console.log(error.responseText);

                    // Handling undefined Exception
                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            // Displaying News to individual stock page
            var urlNews = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/news/last/3";

            $.ajax({
                url: urlNews,
                success: function (data) {

                    // Get the data
                    d3.json(urlNews, function (error, data) {
                        console.log("News: " + data);
                        for (var i = 0; i < data.length; i++){
                            var headlineIndex = "headline";
                            var sourceIndex = "source";
                            var datetimeIndex = "datetime";

                            var parser = data[i].datetime;
                            var indexNumber = parser.indexOf("T");
                            var dataParsed = parser.slice(0,indexNumber);

                            headlineIndex = headlineIndex + i;
                            sourceIndex =  sourceIndex + i;
                            datetimeIndex = datetimeIndex + i;

                            console.log(headlineIndex);
                            console.log(data[i].headline);
                            console.log(data[i].source);
                            console.log(dataParsed);

                            document.getElementById(headlineIndex).href = data[i].url;
                            document.getElementById(headlineIndex).innerHTML = data[i].headline;
                            document.getElementById(sourceIndex).innerHTML = data[i].source;
                            document.getElementById(datetimeIndex).innerHTML = dataParsed;
                        }

                    });
                }, error: function(error){
                    // Handle Errors here.
                    console.log(error.responseText);
                    //alert(error.responseText);

                    // Handling undefined Exception
                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            // Displaying Key Stats to individual stock page
            var urlKeyStats = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/stats";

            $.ajax({
                url: urlKeyStats,
                success: function (data) {

                    // Get the data
                    d3.json(urlKeyStats, function (error, data) {
                        console.log("Key Stats: " + data);

                        var response = (data);
                        var week52high = response.week52high;
                        var week52low = response.week52low;
                        var dividendRate = response.dividendRate;
                        var latestEPS = response.latestEPS;
                        var grossProfit = response.grossProfit;
                        var debt = response.debt;

                        document.getElementById("week52high").innerHTML = week52high;
                        document.getElementById("week52low").innerHTML = week52low;
                        document.getElementById("dividendRate").innerHTML = dividendRate;
                        document.getElementById("latestEPS").innerHTML = latestEPS;
                        document.getElementById("grossProfit").innerHTML = grossProfit;
                        document.getElementById("debt").innerHTML = debt;
                    });
                }, error: function(error){
                    // Handle Errors here.
                    console.log(error.responseText);
                    //alert(error.responseText);

                    // Handling undefined Exception
                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            // Convert symbol to uppercase
            var uppercaseStockSymbol = stockSymbol.toUpperCase();

            // Displaying Logo
            var logoUrl = "https://storage.googleapis.com/iex/api/logos/" + uppercaseStockSymbol + ".png";
            $("#logo").attr("src", logoUrl);

        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
});

// Adding peer stats
// @TODO FIX table issue
function peersStatsUrlGrab (name) {

    document.getElementById("genericSymbol").innerHTML = resultStockSymbol;

    // each peer in peer table is clickable and will transfer to specific page
    var stockTransferURL = "IndividualStockPage.html?stock=" + name + "#";

    // getting table
    var table = document.getElementById("myTable");
    var row = table.insertRow(-1);

    // Inserting name
    var cell0 = row.insertCell(0);
    cell0.innerHTML = name.link(stockTransferURL);

    // unicode for UP and DOWN arrows
    var unicodeUp = '\u25B2';
    var unicodeDown = '\u25BC';

    // adding color
    unicodeUp = unicodeUp.fontcolor("green");
    unicodeDown = unicodeDown.fontcolor("red");

    // grab latest stock price for peers
    var peerStockPriceUrl = "https://api.iextrading.com/1.0/stock/" + name +  "/quote";

    $.ajax({
        url: peerStockPriceUrl,
        success: function (data) {

            var price = data.latestPrice;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = "$" + price;

        }
    });

    // grab latest stock price from the current stock on page
    var stockSymbolStockPriceUrl = "https://api.iextrading.com/1.0/stock/" + resultStockSymbol +  "/quote";

    $.ajax({
        url: stockSymbolStockPriceUrl,
        success: function (data) {

            var stockprice = data.latestPrice;
            stockprice = stockprice.toString();
            stockprice = stockprice.bold();

            document.getElementById("myTable").rows[1].cells[1].innerHTML = "$" + stockprice;
        }
    });

    // for each peer in data, issue an ajax to grab; 6m% and 1y%
    var peerStatusURL = "https://api.iextrading.com/1.0/stock/" + name +  "/stats";

    setTimeout(function () {
        $.ajax({
            url: peerStatusURL,
            success: function (data) {
                // 1 year
                var percent1y = data.year1ChangePercent;
                var percentage1y = percent1y * 100;
                percentage1y = percentage1y.toFixed(2);

                // insert 1 year into table
                var cell2 = row.insertCell(2);
                var percentStr1y = percentage1y.toString();

                if (percent1y < 0){
                    cell2.innerHTML = unicodeDown + " " + percentStr1y + "%";
                } else {
                    cell2.innerHTML = unicodeUp + "  " + percentStr1y + "%";
                }

                // 6 month
                var percent6m = data.month6ChangePercent;
                var percentage6m = percent6m * 100;
                percentage6m = percentage6m.toFixed(2);

                //inserting 6 month into table
                var cell3 = row.insertCell(3);
                var percentStr6m = percentage6m.toString();

                // Test to see if percentage is negative
                if (percent6m < 0){
                    cell3.innerHTML = unicodeDown + " " + percentStr6m + "%";
                } else {
                    cell3.innerHTML = unicodeUp + "  " + percentStr6m + "%";
                }
            }
        });
    }, 2000);

    // for current stock on page, issue a /stats request to grab info to compare to peers
    var stockSymbolStatusURL = "https://api.iextrading.com/1.0/stock/" + name +  "/stats";

    setTimeout(function () {
        $.ajax({
            url: stockSymbolStatusURL,
            success: function (data) {

                // Bold the percent sign
                var percentSign = '%';
                percentSign = percentSign.bold();

                // 1 year
                var percent1y = data.year1ChangePercent;
                var percentage1y = percent1y * 100;
                percentage1y = percentage1y.toFixed(2);

                // insert 1 year into table
                var percentStr1y = percentage1y.toString();

                // Bold the text
                percentStr1y = percentStr1y.bold();

                if (percent1y < 0){
                    document.getElementById("myTable").rows[1].cells[2].innerHTML = unicodeDown + " " + percentStr1y + percentSign;
                } else {
                    document.getElementById("myTable").rows[1].cells[2].innerHTML = unicodeUp + "  " + percentStr1y + percentSign;
                }

                // 6 month
                var percent6m = data.month6ChangePercent;
                var percentage6m = percent6m * 100;
                percentage6m = percentage6m.toFixed(2);

                //inserting 6 month into table
                var percentStr6m = percentage6m.toString();

                // Bold the text
                percentStr6m = percentStr6m.bold();

                // Test to see if percentage is negative
                if (percent6m < 0){
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeDown + " " + percentStr6m + percentSign;
                } else {
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeUp + "  " + percentStr6m + percentSign;
                }
            }
        });
    }, 2000);
}

// GET the date and quanity of stock price
function getStockDateAndQuantity(){

    var date = null;
    var number = null;

    date = document.getElementById("datePortfolio").value;
    number = document.getElementById("quantityPortfolio").value;

    console.log(date);

    // MSG to the user Please renter both
    if (date === null || number === null){
        // generic CSS

    }

    // check date then convert to make ajax request to grab the price
    var resDate = checkDate(date);
    console.log("resDate: " + resDate);

    // Make ajax request that grabs price on specific date
    var urlDate = "https://api.iextrading.com/1.0/stock/" + resultStockSymbol + "/chart/5y";

    var closePriceForDate = null;

    $.ajax({
        url: urlDate,
        success: function (data) {

            // Get the data
            d3.json(urlDate, function (error, data) {
                // Returning the entire array
                console.log(data);

                // Defaint JS makes Searching very Easy ;)
                var query = '//*[date="' + resDate + '"]';
                var queryResult = JSON.search(data,query);

                // Searching for date within JSON
                for (var i=0; i < queryResult.length; i++) {
                    closePriceForDate = queryResult[i].close;
                    console.log(i + " " + closePriceForDate);
                }
            });
        }
    });

    var resNumber = checkNumber(number);

    // @TODO SEND to firebase  (resDate, resNumber, resultStockSymbol, closePriceForDate)
    // Since closePriceForDate is made from ajax request you might have to use a promise or wait a couple of seconds
    // to send it firebase
}

// Regex date
function checkDate(date) {
    var date_regex = /^\d{2}\/\d{2}\/\d{4}$/ ;
    var checkRegex = date_regex.test(date);

    if (checkRegex === false){
        // display css that reports error to enter correct number

    } else if (checkRegex === true){

        // convert date from 12/03/1996 to 20180129
        // var year = date.slice(6,10);
        // var month = date.slice(0,2);
        // var day = date.slice(3,5);

        // convert date from 12/03/1996 to 2013-02-11
        var year = date.slice(6,10);
        var month = date.slice(0,2);
        var day = date.slice(3,5);

        console.log("grabbing specific from last 5y : " + year + "-" + month + "-" + day);

        return year + "-" + month + "-" + day;
    }
}

// Regex Number
function checkNumber(number) {
    var reg = /^\d+$/;
    var checkRegex = reg.test(number);

    if (checkRegex === false){
        // display css that reports error to enter correct number


    } else if (checkRegex === true){
        return number;
    }

}

// Adding to portfolio and syncing to the database
// @TODO ADD date and quantity bought
    // Integrate ETRADE later???
function AddToPortfolio () {
    var user = firebase.auth().currentUser;

    //console.log(document.getElementById("portfolioButton").getAttribute("data-inPortfolio"));
    //console.log(document.getElementById("portfolioButton").getAttribute("data-pk"));

    if(document.getElementById("portfolioButton").getAttribute("data-inPortfolio") === "true"){
        firebase.database().ref("Portfolios/" + document.getElementById("portfolioButton").getAttribute("data-pk")).remove();

        document.getElementById("portfolioButton").setAttribute("data-inPortfolio", false);
        document.getElementById("portfolioButton").setAttribute("data-pk", null);
        //document.getElementById("portfolioButton").innerText = " Add to Portfolio";

        $("#portfolioButton").removeClass("fa fa-minus");
        $("#portfolioButton").addClass("fa fa-plus");


        // Toggle off the addstockportfolio div
        var div1 = document.getElementById('AddStocktoPortfolio');
        div1.style.display = "none";
        console.log("div1");

    } else {
        firebase.database().ref('Portfolios/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        });

        document.getElementById("portfolioButton").setAttribute("data-inPortfolio", true);
        setPK("portfolioButton");
        //document.getElementById("portfolioButton").innerText = " Remove from Portfolio";

        $("#portfolioButton").removeClass("fa fa-plus");
        $("#portfolioButton").addClass("fa fa-minus");

        $("#AddStocktoPortfolio").fadeIn("slow");
        // Toggle off the addstockportfolio div
        var div2 = document.getElementById('AddStocktoPortfolio');
        div2.style.display = "block";
        console.log("div2");

    }
}

// Adding to watchlist and syncing to the database
function AddToWatchlist () {
    var user = firebase.auth().currentUser;

    //console.log(document.getElementById("watchlistButton").getAttribute("data-inWatchlist"));
    //console.log(document.getElementById("watchlistButton").getAttribute("data-pk"));

    if(document.getElementById("watchlistButton").getAttribute("data-inWatchlist") === "true"){
        firebase.database().ref("Watchlists/" + document.getElementById("watchlistButton").getAttribute("data-pk")).remove();

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", false);
        document.getElementById("watchlistButton").setAttribute("data-pk", null);
        //document.getElementById("watchlistButton").innerText = " Add to Watchlist";

        $("#watchlistButton").removeClass("fa fa-minus");
        $("#watchlistButton").addClass("fa fa-plus");


    } else {
        firebase.database().ref('Watchlists/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        });

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", true);
        setPK("watchlistButton");
        //document.getElementById("watchlistButton").innerText = " Remove from Watchlist";

        $("#watchlistButton").removeClass("fa fa-plus");
        $("#watchlistButton").addClass("fa fa-minus");

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