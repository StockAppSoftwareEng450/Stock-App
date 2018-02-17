"use strict";

// Globalizing the Stock Symbol
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
                        if(stockSymbol === value.child("stockSymbol").val()){
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
                        if(stockSymbol === value.child("stockSymbol").val()){
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

            // date to decide if current time is later than closing stock market
            var dateArray = [];
            dateWeekTime();


            /** Updating price every 3 seconds **/
            setInterval(function () {

                $.ajax({
                    url: resultUrl,
                    success: function (data) {
                        var stockprice = data.latestPrice;

                        document.getElementById("StockPrice").innerHTML = stockprice;

                        stockprice = stockprice.toString();
                        stockprice = stockprice.bold();

                        // Send price to the peers table
                        document.getElementById("myTable").rows[1].cells[1].innerHTML = "$" + stockprice;

                    },
                    error: function(error){
                        // Handle Errors here.
                        console.log(error.responseText);
                        //alert(error.responseText);
                    }
                });
            }, 2500);

            /** Updating Name and Symbol Once **/
            setTimeout(function () {
                $.ajax({
                    url: resultUrl,
                    success: function (data) {
                        var companyName = data.companyName;
                        var symbol = data.symbol;

                        document.getElementById("CompanyName").innerHTML = companyName;
                        document.getElementById("StockSymbolUpperCase").innerHTML = symbol;
                    },
                    error: function(error){
                        // Handle Errors here.
                        console.log(error.responseText);
                        //alert(error.responseText);
                    }
                });
            }, 2000);

            /** Peers Section  **/
            var peersUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/peers";

            $.ajax({
                url: peersUrl,
                success: function (data) {
                    for (var i = 0; i < data.length; i++){
                        var peerName = data[i];

                        // for each peer name (grab stats)
                        peersStatsUrlGrab(peerName);
                    }
                }, error: function(error){
                    console.log(error.responseText);

                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            /** Company About Page **/
            var companyDescriptionUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/company";

            $.ajax({
                url: companyDescriptionUrl,
                success: function (data) {
                    d3.json(companyDescriptionUrl, function (error, data) {
                        document.getElementById("aboutCompany").innerHTML = data.description;
                    });
                }, error: function(error){
                    console.log(error.responseText);

                    // Handling undefined Exception
                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            /** Displaying News to individual stock page **/
            var urlNews = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/news/last/3";

            $.ajax({
                url: urlNews,
                success: function (data) {
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
                    console.log(error.responseText);

                    // Handling undefined Exception
                    if (error.responseText === "Unknown symbol"){
                        console.log("Reached Error");

                        // Transfer to the homepage
                        window.location.href = "index.html";
                    }
                }
            });

            /** Key Stats to **/
            var urlKeyStats = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/stats";

            $.ajax({
                url: urlKeyStats,
                success: function (data) {
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

            /** Displaying Logo **/
            DisplayLogo();

        } else {
            // if no user is signed in, return to the login screen.
            window.location.href = "login.html";
        }
    })
});

/** Deleting White Space Logo */
function DisplayLogo(){
    var logoUrl = "https://storage.googleapis.com/iex/api/logos/" + resultStockSymbol.toUpperCase() + ".png";

    // Converting URL to Base64 with the use of a proxy
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

    // Returns Base 64 of image
    getDataUri(logoUrl, function (base64) {
        console.log('RESULT:', base64);

        //original
        $("#original").attr("src", base64);
        $("#original").on("load", function() {
            var canvas = document.getElementById("modified"),
                ctx = canvas.getContext("2d"),
                image = document.getElementById("original");

            // This size can change
            canvas.height = canvas.width = 50;

            console.log(canvas.height);
            console.log(canvas.width);

            ctx.drawImage(image,0,0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            var imgd = ctx.getImageData(0, 0, 1000, 1000),
                pix = imgd.data,
                newColor = {r:0,g:0,b:0, a:0};

            for (var i = 0, n = pix.length; i <n; i += 4) {
                var r = pix[i],
                    g = pix[i+1],
                    b = pix[i+2];

                if(r >= 250&& g >= 250 && b >= 250){
                    // Change the white to the new color.
                    pix[i] = newColor.r;
                    pix[i+1] = newColor.g;
                    pix[i+2] = newColor.b;
                    pix[i+3] = newColor.a;
                }
            }

            ctx.putImageData(imgd, 0, 0);
        })
    });
}

/** Peer Stats for Peers Table **/
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

    /** Stock price for Every Peer **/
    var peerStockPriceUrl = "https://api.iextrading.com/1.0/stock/" + name +  "/quote";

    $.ajax({
        url: peerStockPriceUrl,
        success: function (data) {

            var price = data.latestPrice;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = "$" + price;

        }
    });

    /** Grabbing 6m% and 1y% for Each Peer **/
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

    /** Grabbing 6m% and 1y% for Current Stock **/
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

/** GET the date and quantity of stock price (On enter bttn) **/
function getStockDateAndQuantity(){
    var user = firebase.auth().currentUser;

    var date = null;
    var quantity = null;
    var price = null;

    date = document.getElementById("datePortfolio").value;
    quantity = document.getElementById("quantityPortfolio").value;
    price = document.getElementById("pricePortfolio").value;

    //NEED!!!!!!!!    // MSG to the user Please renter both
    if (!date || !quantity || date == null || quantity == null){
        // MSG to the User Please Enter
        document.getElementById("addToPorfolioError").style.visibility = "visible";

        console.log("Please enter valid Add to portfolio inputs");

    } else {
        document.getElementById("addToPorfolioSuccess").style.visibility = "visible";

        //user put in a price?
        var closePriceForDate = price;
        if (Number(price) <= 0) {
            // Make ajax request that grabs price on specific date
            var urlDate = "https://api.iextrading.com/1.0/stock/" + resultStockSymbol + "/chart/5y";

            $.ajax({
                url: urlDate,
                success: function (data) {

                    // Get the data
                    d3.json(urlDate, function (error, data) {
                        // Returning the entire array
                        console.log(data);
                        //if date in the last three days ==> different axaj request!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // Defaint JS makes Searching very Easy ;)
                        var query = '//*[date="' + date + '"]';
                        var queryResult = JSON.search(data, query);

                        // Searching for date within JSON
                        for (var i = 0; i < queryResult.length; i++) {
                            closePriceForDate = queryResult[i].close;
                            console.log(i + " " + closePriceForDate);
                        }
                    });
                }
            })
        }

        $("#portfolioButton").removeClass("fa fa-plus");
        $("#portfolioButton").addClass("fa fa-minus");

        // Fading out on 3 seconds
        $("#AddStocktoPortfolio").fadeOut(3000);

        //wait for ajax response
        setTimeout(function(){
            // @TODO SEND to firebase  (resDate, resNumber, resultStockSymbol, closePriceForDate)
            // Since closePriceForDate is made from ajax request you might have to use a promise or wait a couple of seconds
            // to send it firebase

            if(closePriceForDate) {
                firebase.database().ref('Portfolios/').push().set({
                    userId: user.uid,
                    stockSymbol: resultStockSymbol,
                    price: closePriceForDate,
                    quantity: quantity,
                    date: date
                }).then(function(){
                    document.getElementById("portfolioButton").setAttribute("data-inPortfolio", true);
                    setPK("portfolioButton");
                });
            } else {
//NEED!!!!!!!!    // MSG to the user
                // generic CSS
                console.log("empty");
            }
        }, 2000);
    }
}

/** Adding to portfolio and syncing to the database **/
function AddToPortfolio () {
    var user = firebase.auth().currentUser;

    document.getElementById("addToPorfolioError").style.visibility = "hidden";

    //console.log(document.getElementById("portfolioButton").getAttribute("data-inPortfolio"));
    //console.log(document.getElementById("portfolioButton").getAttribute("data-pk"));

    if(document.getElementById("portfolioButton").getAttribute("data-inPortfolio") === "true"){
        firebase.database().ref("Portfolios/" + document.getElementById("portfolioButton").getAttribute("data-pk")).remove();

        document.getElementById("portfolioButton").setAttribute("data-inPortfolio", false);
        document.getElementById("portfolioButton").setAttribute("data-pk", null);

        $("#portfolioButton").removeClass("fa fa-minus");
        $("#portfolioButton").addClass("fa fa-plus");


        // Toggle off the addstockportfolio div
        var div1 = document.getElementById('AddStocktoPortfolio');
        div1.style.display = "none";
    } else {
        //toggle overlay add
        $("#AddStocktoPortfolio").fadeToggle("slow");
        $('#datePortfolio').val(new Date().toDateInputValue());

        // Clearing input on click
        document.getElementById("pricePortfolio").value = '';
        document.getElementById("quantityPortfolio").value = '';

        // Toggle off the addstockportfolio div
        var addStock = document.getElementById('AddStocktoPortfolio');
        addStock.style.display = "block";
    }
}

/** get Today **/
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

/** Getting day of week and time of day **/
function dateWeekTime() {

    var dateArray  = [];
    var d = new Date();
    console.log("Date for closing: " + d);

    // var weekDay = d.slice(0,3);
    // console.log(weekDay);
}

/** Adding to watchlist and syncing to the database **/
function AddToWatchlist () {
    var user = firebase.auth().currentUser;

    if(document.getElementById("watchlistButton").getAttribute("data-inWatchlist") === "true"){
        firebase.database().ref("Watchlists/" + document.getElementById("watchlistButton").getAttribute("data-pk")).remove();

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", false);
        document.getElementById("watchlistButton").setAttribute("data-pk", null);

        $("#watchlistButton").removeClass("fa fa-minus");
        $("#watchlistButton").addClass("fa fa-plus");


    } else {
        firebase.database().ref('Watchlists/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        }).then(function(){
            document.getElementById("watchlistButton").setAttribute("data-inWatchlist", true);
            setPK("watchlistButton");
        });


        $("#watchlistButton").removeClass("fa fa-plus");
        $("#watchlistButton").addClass("fa fa-minus");

    }

}

/** Setting Primary Key **/
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

/** Logo Handling **/
function imgError(image) {
    image.onerror = "";
    image.src = "";
    return image.src;
}







