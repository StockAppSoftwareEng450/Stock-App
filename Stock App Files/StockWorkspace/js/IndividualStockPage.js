"use strict";

// Globalizing the Stock Symbol
var resultStockSymbol = null;

// unicode for UP and DOWN arrows
var unicodeUp = '\u25B2';
var unicodeDown = '\u25BC';

// adding color
unicodeUp = unicodeUp.fontcolor("green");
unicodeDown = unicodeDown.fontcolor("red");

/** Loading Screen Gif **/
// On ready function
function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 2000);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}
function timeClosed(){
    console.log(stockMarketTime())
    if(stockMarketTime() === "closed"){
        //console.log("here");
        document.getElementById("time").style.display = 'block';
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('LoadingMain', true);
    show('loading', false);
});

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

// Loading first and Last name at the top of the screen
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {

        //fill input fields with values
        let ref = firebase.database().ref("Users");
        ref.orderByKey().equalTo(user.uid).once("value", function(snapshot) {

            snapshot.forEach(function (value){

                document.getElementById("fstName").innerHTML = value.val().firstName;
                document.getElementById("lstName").innerHTML = value.val().lastName;
            });
        });
    })
});

$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            setTimeout(function() {
                // User is signed in.
                // Array with stockSymbol in [0]
                var testDG = parseURLParams(window.location.href);
                var variable1 = testDG['stock'];
                var stockSymbol = variable1[0];

                // On refresh loads back to screen 1
                if (stockSymbol === undefined) {
                    // Display error to the user and return user to homepage
                    // console.log("reached undefined");
                    window.location.href = "index.html";
                }
                resultStockSymbol = stockSymbol;

                document.getElementById("portfolioButton").disabled = false;

                //getting watchlist information and save it
                var refWatchlist = firebase.database().ref("Watchlists");
                refWatchlist.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {
                    if (snapshot.exists()) {
                        snapshot.forEach(function (value) {
                            if (stockSymbol === value.child("stockSymbol").val()) {
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

                /** If stock Market is open **/
                var d = new Date();
                var currentHour = d.getHours();
                var day = d.getDay();
                // console.log("day: " + day);

                if ((currentHour > 7 && currentHour < 18) && (day >= 1 && day <= 5)) {
                    // console.log("interval");
                    setIntervalPrice(resultUrl);
                } else {
                    // console.log("timeout");
                    setTimeoutPrice(resultUrl);
                }

                /** Updating Name and Symbol Once **/
                setTimeout(function () {
                    $.ajax({
                        url: resultUrl,
                        success: function (data) {
                            var companyName = data.companyName;
                            var revisedCompany = null;

                            // Check for length of company name
                            if (companyName.length > 25) {
                                revisedCompany = companyName.slice(0, 50);
                                document.getElementById("CompanyName").innerHTML = revisedCompany + "...";

                            } else {
                                document.getElementById("CompanyName").innerHTML = companyName;
                            }

                            // Symbol
                            document.getElementById("StockSymbolUpperCase").innerHTML = data.symbol;
                        },
                        error: function (error) {
                            // Handle Errors here.
                            // console.log(error.responseText);
                            //alert(error.responseText);
                        }
                    });
                });

                // calling current stock symbol
                currentStockStats();

                /** Peers Section  **/
                var peersUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/peers";

                $.ajax({
                    url: peersUrl,
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            var peerName = data[i];

                            // for each peer name (grab stats)
                            peersStatsUrlGrab(peerName);
                        }
                    }, error: function (error) {
                        // console.log(error.responseText);

                        if (error.responseText === "Unknown symbol") {
                            // console.log("Reached Error");

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
                    }, error: function (error) {
                        // console.log(error.responseText);

                        // Handling undefined Exception
                        if (error.responseText === "Unknown symbol") {
                            // console.log("Reached Error");

                            // Transfer to the homepage
                            window.location.href = "index.html";
                        }
                    }
                });

                /** Displaying News to individual stock page **/
                var urlNews = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/news/last/2";

                $.ajax({
                    url: urlNews,
                    success: function (data) {
                        d3.json(urlNews, function (error, data) {
                            // console.log("News: " + data);
                            for (var i = 0; i < data.length; i++) {
                                var headlineIndex = "headline";
                                var sourceIndex = "source";
                                var datetimeIndex = "datetime";
                                var linkIndex = "linkIndex";

                                var parser = data[i].datetime;
                                var indexNumber = parser.indexOf("T");
                                var dataParsed = parser.slice(0, indexNumber);

                                headlineIndex = headlineIndex + i;
                                sourceIndex = sourceIndex + i;
                                datetimeIndex = datetimeIndex + i;
                                linkIndex = linkIndex + i;

                                var revLink = "http://www." + data[i].source + ".com";
                                console.log("source:" + data[i].source);
                                console.log("revLink:" + revLink);


                                document.getElementById(linkIndex).href = data[i].url;
                                document.getElementById(headlineIndex).innerHTML = data[i].headline;
                                document.getElementById(sourceIndex).innerHTML = data[i].source;
                                document.getElementById(sourceIndex).href = revLink;
                                document.getElementById(datetimeIndex).innerHTML = dataParsed;
                            }
                        });
                    }, error: function (error) {
                        // console.log(error.responseText);

                        // Handling undefined Exception
                        if (error.responseText === "Unknown symbol") {
                            // console.log("Reached Error");

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
                            // console.log("Key Stats: " + data);

                            var response = (data);
                            var week52high = response.week52high;
                            var week52low = response.week52low;
                            var dividendRate = response.dividendRate;
                            var latestEPS = response.latestEPS;
                            var grossProfit = response.grossProfit;
                            var debt = response.debt;

                            document.getElementById("week52high").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(week52high).toFixed(2));
                            document.getElementById("week52low").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(week52low).toFixed(2));
                            document.getElementById("dividendRate").innerHTML = numberWithCommas(dividendRate);
                            document.getElementById("latestEPS").innerHTML = numberWithCommas(latestEPS);
                            document.getElementById("grossProfit").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(grossProfit).toFixed(2));
                            document.getElementById("debt").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(debt).toFixed(2));
                        });
                    }, error: function (error) {
                        // console.log(error.responseText);
                        //alert(error.responseText);

                        // Handling undefined Exception
                        if (error.responseText === "Unknown symbol") {
                            console.log("Reached Error");

                            // Transfer to the homepage
                            window.location.href = "index.html";
                        }
                    }
                });

                /** Displaying Logo **/
                DisplayLogo();

                /** portfolioOwnedTable **/
                portfolioOwnedTable();

                /** Stock Market Time open/Closed **/
                timeClosed();

            }, 500);

        } else {
            // if no user is signed in, return to the login screen.
            window.location.href = "login.html";
        }
    })

    // Calling footer for Copyright
    setCopyrightTime();

});

/** Deleting White Space Logo */
function DisplayLogo() {
    var logoUrl = "https://storage.googleapis.com/iex/api/logos/" + resultStockSymbol.toUpperCase() + ".png";
    // var backgroundUrl = "url(" + "'" + logoUrl +  "'" +  ")" + "no-repeat right top";
    //
    // console.log(backgroundUrl);
    // // document.getElementsByClassName('.blog-card .photo.photo1').backgroundImage = backgroundUrl;
    // document.getElementById('#blog-cardPic').style.background = backgroundUrl;
    //
    // // document.body.style.background = "#f3f3f3 url('img_tree.png') no-repeat right top";


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
        // console.log('RESULT:', base64);

        //handling no Logo
        if (base64 === "data:image/png;base64,Cg==") {
            // console.log("Reached No Logo");

            // Setting logo to not display
            document.getElementById("modified").style.display = "none";
            document.getElementById("original").style.display = "none";

            // reducing padding if no logo
            document.getElementById("CompanyName").style.paddingLeft = "0px";
        }

        //original
        $("#original").attr("src", base64);
        $("#original").on("load", function () {
            var canvas = document.getElementById("modified"),
                ctx = canvas.getContext("2d"),
                image = document.getElementById("original");

            // This size can change
            canvas.height = canvas.width = 50;

            // Updating modified id to display
            document.getElementById("modified").style.display = "block";

            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            var imgd = ctx.getImageData(0, 0, 1000, 1000),
                pix = imgd.data,
                newColor = {r: 0, g: 0, b: 0, a: 0};

            for (var i = 0, n = pix.length; i < n; i += 4) {
                var r = pix[i],
                    g = pix[i + 1],
                    b = pix[i + 2];

                if (r >= 250 && g >= 250 && b >= 250) {
                    // Change the white to the new color.
                    pix[i] = newColor.r;
                    pix[i + 1] = newColor.g;
                    pix[i + 2] = newColor.b;
                    pix[i + 3] = newColor.a;
                }
            }

            ctx.putImageData(imgd, 0, 0);
        })
    });
}

/** Peer Stats for Peers Table **/
function peersStatsUrlGrab(name) {

    document.getElementById("genericSymbol").innerHTML = resultStockSymbol;

    // each peer in peer table is clickable and will transfer to specific page
    var stockTransferURL = "IndividualStockPage.html?stock=" + name + "#";

    /** Stock price for Every Peer **/
    var peerStockPriceUrl = "https://api.iextrading.com/1.0/stock/" + name + "/quote";

    // getting table
    var table = document.getElementById("myTable");
    var row = table.insertRow(-1);

    $.ajax({
        url: peerStockPriceUrl,
        success: function (data) {

            // Inserting name
            var cell0 = row.insertCell(0);
            cell0.innerHTML = name.link(stockTransferURL);

            var price = data.latestPrice;
            price = numberWithCommas(fx.convert(price).toFixed(2));
            var cell1 = row.insertCell(1);
            cell1.innerHTML = currencySymbole + " " + price;
            // document.getElementById("pricePortfolio").placeholder = price;
        }, error: function(error){
            //handel stock symbol not found error
        }
    });


    /** Grabbing 6m% and 1y% for Each Peer **/
    var peerStatusURL = "https://api.iextrading.com/1.0/stock/" + name + "/stats";

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

                if (percent1y < 0) {
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
                if (percent6m < 0) {
                    cell3.innerHTML = unicodeDown + " " + percentStr6m + "%";
                } else {
                    cell3.innerHTML = unicodeUp + "  " + percentStr6m + "%";
                }
            }, error: function (error) {
                //handle stock symbol not found error
            }
        })
    }, 250);

    /** Grabbing 6m% and 1y% for Current Stock **/
    var stockSymbolStatusURL = "https://api.iextrading.com/1.0/stock/" + name + "/stats";

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

                if (percent1y < 0) {
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
                if (percent6m < 0) {
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeDown + " " + percentStr6m + percentSign;
                } else {
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeUp + "  " + percentStr6m + percentSign;
                }
            }
        });
    });
}

var clicked = false;
var divHeight = 180;

/** GET the date and quantity of stock price (On enter button) **/
function getStockDateAndQuantity() {
    var user = firebase.auth().currentUser;

    var date = null;
    var quantity = null;

    date = document.getElementById("datePortfolio").value;
    quantity = document.getElementById("quantityPortfolio").value;
    var price = document.getElementById("pricePortfolio").value;

    //NEED!!!!!!!!    // MSG to the user Please renter both
    if (!date || !quantity || date == null || quantity == null || price <= 0 || quantity <= 0) {
        // MSG to the User Please Enter
        document.getElementById("addToPorfolioError").style.visibility = "visible";
        document.getElementById("addToPorfolioError").style.display = "block";

        // Adding height to div when error is displayed
        if (divHeight <= 180) {
            divHeight +=40;
            clicked = true;
            console.log(clicked)
        }

        var sendNewHieght = divHeight + "px";
        console.log(sendNewHieght);
        document.getElementById("AddStocktoPortfolio").style.height = sendNewHieght;

        // console.log("Please enter valid Add to portfolio inputs");

    } else {
        document.getElementById("addToPorfolioSuccess").style.visibility = "visible";
        document.getElementById("addToPorfolioSuccess").style.display = "block";

        console.log(clicked);

        if (clicked === true){
            divHeight +=40;
            document.getElementById("AddStocktoPortfolio").style.height = divHeight + "px";
        } else {
            divHeight +=40;
            document.getElementById("AddStocktoPortfolio").style.height = divHeight + "px";
        }

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
                        // console.log(data);
                        //if date in the last three days ==> different axaj request!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // Defaint JS makes Searching very Easy ;)
                        var query = '//*[date="' + date + '"]';
                        var queryResult = JSON.search(data, query);

                        // Searching for date within JSON
                        for (var i = 0; i < queryResult.length; i++) {
                            closePriceForDate = queryResult[i].close;
                            // console.log(i + " " + closePriceForDate);
                        }
                    });
                }
            })
        }

        document.getElementById("AddStocktoPortfolio").setAttribute("data-hidden", "true");
        $("#portfolioButton").removeClass("fa fa-minus");
        $("#portfolioButton").addClass("fa fa-plus");

        // Fading out on 3 seconds
        $("#AddStocktoPortfolio").fadeOut(3000);

        //wait for ajax response
        setTimeout(function () {
            // @TODO SEND to firebase  (resDate, resNumber, resultStockSymbol, closePriceForDate)
            // Since closePriceForDate is made from ajax request you might have to use a promise or wait a couple of seconds
            // to send it firebase

            if (closePriceForDate) {
                firebase.database().ref('Portfolios/').push().set({
                    userId: user.uid,
                    stockSymbol: resultStockSymbol,
                    price: closePriceForDate,
                    quantity: quantity,
                    date: date
                });
            } else {
                //NEED!!!!!!!!    // MSG to the user
                // generic CSS
                // console.log("empty");
            }
        });
    }
}

/** Adding to portfolio and syncing to the database **/
function AddToPortfolio() {
    var user = firebase.auth().currentUser;

    document.getElementById("addToPorfolioError").style.display = "none";
    document.getElementById("addToPorfolioError").style.visibility = "hidden";


    if (document.getElementById("AddStocktoPortfolio").getAttribute("data-hidden") === "true") {

        //getting portfolio information and save it
        if (user) {

            $('#datePortfolio').val(new Date().toDateInputValue());

            document.getElementById("AddStocktoPortfolio").setAttribute("data-hidden", "false");
            $("#portfolioButton").removeClass("fa fa-plus");
            $("#portfolioButton").addClass("fa fa-minus");

        }
    } else {
        document.getElementById("AddStocktoPortfolio").setAttribute("data-hidden", "true");
        $("#portfolioButton").removeClass("fa fa-minus");
        $("#portfolioButton").addClass("fa fa-plus");
    }

    //toggle overlay add
    $("#AddStocktoPortfolio").fadeToggle("slow");
}

/** get Today **/
Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

/** Getting day of week and time of day **/
function dateWeekTime() {

    var dateArray = [];
    var d = new Date();
    // console.log("Date for closing: " + d);

    // var weekDay = d.slice(0,3);
    // console.log(weekDay);
}

/** Adding to watchlist and syncing to the database **/
function AddToWatchlist() {
    var user = firebase.auth().currentUser;

    if (document.getElementById("watchlistButton").getAttribute("data-inWatchlist") === "true") {
        firebase.database().ref("Watchlists/" + document.getElementById("watchlistButton").getAttribute("data-pk")).remove();

        document.getElementById("watchlistButton").setAttribute("data-inWatchlist", false);
        document.getElementById("watchlistButton").setAttribute("data-pk", null);

        $("#watchlistButton").removeClass("fa fa-minus");
        $("#watchlistButton").addClass("fa fa-plus");


    } else {
        firebase.database().ref('Watchlists/').push().set({
            userId: user.uid,
            stockSymbol: resultStockSymbol
        }).then(function () {
            document.getElementById("watchlistButton").setAttribute("data-inWatchlist", true);
            setPK("watchlistButton");
        });


        $("#watchlistButton").removeClass("fa fa-plus");
        $("#watchlistButton").addClass("fa fa-minus");

    }
}

/** Setting Primary Key **/
function setPK(button) {
    var user = firebase.auth().currentUser;

    var ref = null;
    if (button === "portfolioButton") {
        ref = firebase.database().ref("Portfolios");
    } else {
        ref = firebase.database().ref("Watchlists");
    }

    ref.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach(function (value) {
                console.log("StockSymbol1: " + value.child("stockSymbol").val());
                if (resultStockSymbol == value.child("stockSymbol").val()) {
                    document.getElementById(button).setAttribute("data-pk", value.key);
                }
            });
        }
    });
}

/** Dynamic ToolTip **/
var cachedData = Array();

function hoverGetData(companyName) {
    var element = $(this);

    var id = element.data('id');

    if (id in cachedData) {
        return cachedData[id];
    }

    var localData = companyName;
    cachedData[id] = localData;

    return localData;
}

/** Handling if no peers are returned **/
function currentStockStats() {

    document.getElementById("genericSymbol").innerHTML = resultStockSymbol;

    /** Grabbing 6m% and 1y% for Current Stock **/
    var stockSymbolStatusURL = "https://api.iextrading.com/1.0/stock/" + resultStockSymbol + "/stats";

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

                if (percent1y < 0) {
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
                if (percent6m < 0) {
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeDown + " " + percentStr6m + percentSign;
                } else {
                    document.getElementById("myTable").rows[1].cells[3].innerHTML = unicodeUp + "  " + percentStr6m + percentSign;
                }
            }
        });
    });
}

/** Updating price every 3 seconds **/
function setIntervalPrice(resultUrl) {

    var result = stockMarketTime();
    console.log(result);

    setInterval(function () {
        $.ajax({
            url: resultUrl,
            success: function (data) {
                var stockprice = data.latestPrice;
                stockprice = numberWithCommas(fx.convert(stockprice).toFixed(2));

                document.getElementById("StockPrice").innerHTML = currencySymbole + " " + stockprice;

                // Send price to the peers table
                document.getElementById("myTable").rows[1].cells[1].innerHTML = currencySymbole + " " + stockprice;

            },
            error: function (error) {
                // Handle Errors here.
                // console.log(error.responseText);
                //alert(error.responseText);
            }
        });
    }, 2500);
}

/** Updating price once **/
function setTimeoutPrice(resultUrl) {
    setTimeout(function () {
        $.ajax({
            url: resultUrl,
            success: function (data) {
                var stockprice = data.latestPrice;
                stockprice = numberWithCommas(fx.convert(stockprice).toFixed(2));

                document.getElementById("StockPrice").innerHTML = currencySymbole + " " + stockprice;
                document.getElementById("pricePortfolio").value = stockprice;

                // Send price to the peers table
                document.getElementById("myTable").rows[1].cells[1].innerHTML = currencySymbole + " " + stockprice;

            },
            error: function (error) {
                // Handle Errors here.
                // console.log(error.responseText);
                //alert(error.responseText);
            }
        });
    });
}

/** portfolioOwnedTable **/
function portfolioOwnedTable(){
    //getting portfolio information and save it
    var user = firebase.auth().currentUser;

    if (user) {
        // User is signed in.
        var fullPortfolio = [];

        var refPortfolio = firebase.database().ref("Portfolios");
        refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {
            var result = [];
            if (snapshot.exists()) {
                snapshot.forEach(function (value) {
                    if (resultStockSymbol === value.child("stockSymbol").val()) {
                        var help = [];
                        help["pk"] = value.key;
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();
                        help["date"] = value.child("date").val();
                        help["price"] = value.child("price").val();
                        help["quantity"] = value.child("quantity").val();

                        // Render table if stock is in portfolio
                        document.getElementById("PurchasedStockName").style.display = "block";
                        document.getElementById('portfolioTable').style.display = "table";

                        fullPortfolio.push(help);

                        console.log("fullPortfolio: ", fullPortfolio);
                    }
                });

                //  populate portfolioTable
                var table = document.getElementById("portfolioTable");

                for (var i = 0; i < fullPortfolio.length; i++) {

                    // divHeight = divHeight + 200;
                    // document.getElementById("AddStocktoPortfolio").style.height = divHeight;

                    var row = table.insertRow(i + 1);

                    row.setAttribute("data-pk", fullPortfolio[i].pk);

                    // Date purchased
                    var cell1 = row.insertCell((0));
                    cell1.innerHTML = fullPortfolio[i].date;

                    // Purchased Price
                    var cell2 = row.insertCell((1));
                    cell2.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(fullPortfolio[i].price).toFixed(2));

                    // Quantity
                    var cell3 = row.insertCell((2));
                    cell3.innerHTML = numberWithCommas(fullPortfolio[i].quantity);

                    // Add delete button
                    var cell4 = row.insertCell((3));
                    //set button class
                    cell4.setAttribute("class", "deleteButton");
                    //centralize content
                    cell4.style.display = 'flex';
                    cell4.style.alignItems = 'center';
                    cell4.style.justifyContent = 'center';

                    var buttonDelete = document.createElement("BUTTON");
                    buttonDelete.appendChild(document.createTextNode("Delete"));
                    buttonDelete.addEventListener('click', function (button) {
                        var row = button.path[2];
                        var stockSymbol = row.firstChild.firstChild.innerHTML;

                        //removes the row from table
                        row.parentNode.removeChild(row);
                        firebase.database().ref("Portfolios/" + row.getAttribute("data-pk")).remove();

                    });
                    cell4.appendChild(buttonDelete);
                }
            }
        });

        $('#datePortfolio').val(new Date().toDateInputValue());
    }
}



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}








