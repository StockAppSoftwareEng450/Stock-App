"use strict";

$(document).ready(function() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            getFullPortfolio();
            getFullWatchlist();
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    })
});

var stockSymbolIndexP = null;
var stockSymbolIndexW = null;

var cardArrayP = [];
var cardArrayW = [];

var returnedCompanyName = null;
var returnedStockPrice = null;

var fourCardArray = [];
var donutQuantityArray = [{StockSymbol: "A", Quantity:32},
    {StockSymbol: "B", Quantity:53},
    {StockSymbol: "C", Quantity:23},];

var returnedCardArray = [];

var companyNameVar = "CompanyName";
var stockPriceVar = "StockPrice";

function getFullPortfolio(){

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var fullPortfolio = [];

            var refPortfolio = firebase.database().ref("Portfolios");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {

                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        var help = [];
                        help["pk"] = value.key;
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();
                        help["date"] = value.child("date").val();
                        help["price"] = value.child("price").val();
                        help["quantity"] = value.child("quantity").val();

                        fullPortfolio.push(help);
                    });

                    //sort in order stocksymbole
                    fullPortfolio.sort( function (a, b) {
                        return a.stockSymbol.localeCompare(b.stockSymbol);
                    });
                }
            }).then(function(){
                //work with data in here ... fill donut and so on
                //array looks like this:
                //[[userId, stockSymbol, date, price, quantity],[userId, stockSymbol, date, price, quantity],...]
                // console.log(fullPortfolio);

                //populate portfolioTable
                var table = document.getElementById("portfolioTable");
                for(var i = 0; i < fullPortfolio.length; i++){
                    var stockTransferURL = "IndividualStockPage.html?stock=" + fullPortfolio[i].stockSymbol + "#";

                    var row = table.insertRow(i+1);
                    row.setAttribute("data-pk", fullPortfolio[i].pk);

                    stockSymbolIndexP = fullPortfolio[i].stockSymbol;
                    cardArrayP.push(fullPortfolio[i].stockSymbol);

                    // Send Symbols to D3 percent Change graph
                    getPortfolioGrowth(fullPortfolio[i].stockSymbol);

                    // Stock Symbol
                    var cell0 = row.insertCell((0));
                    cell0.innerHTML = fullPortfolio[i].stockSymbol.link(stockTransferURL);

                    // Date purchased
                    var cell1 = row.insertCell((1));
                    cell1.innerHTML = fullPortfolio[i].date;

                    // Purchased Price
                    var cell2 = row.insertCell((2));
                    cell2.innerHTML = "$" + fullPortfolio[i].price;

                    // Current Price
                    var cell3 = row.insertCell((3));

                    // Quantity
                    var cell4 = row.insertCell((4));
                    cell4.innerHTML = fullPortfolio[i].quantity;

                    //entering info to donutQuantityArray
                    donutQuantityArray[i] = {StockSymbol:fullPortfolio[i].stockSymbol,Quantity:fullPortfolio[i].quantity}

                    // Purchased Equity
                    var cell5 = row.insertCell((5));
                    var purchasedEquity = fullPortfolio[i].price * fullPortfolio[i].quantity;
                    // console.log("Purchased equity: " + purchasedEquity);
                    purchasedEquity = purchasedEquity.toFixed(2);
                    cell5.innerHTML = "$" + purchasedEquity.toString();

                    // Current Equity
                    var cell6 = row.insertCell((6));

                    // Current Percent Change
                    var cell7 = row.insertCell((7));

                    getPortfolioValue(stockSymbolIndexP, "price", cell3, cell6, cell7, fullPortfolio[i].price, fullPortfolio[i].quantity);

                    // Add delete button
                    var cell8 = row.insertCell((8));
                    //set button class
                    cell8.setAttribute("class", "deleteButton");
                    //centralize content
                    cell8.style.display = 'flex';
                    cell8.style.alignItems = 'center';
                    cell8.style.justifyContent = 'center';

                    var buttonDelete = document.createElement("BUTTON");
                    buttonDelete.appendChild(document.createTextNode("Delete"));
                    buttonDelete.addEventListener('click', function (button) {
                        var row = button.path[2];
                        var stockSymbol = row.firstChild.firstChild.innerHTML;

                        //removes the row from table
                        row.parentNode.removeChild(row);
                        firebase.database().ref("Portfolios/" + row.getAttribute("data-pk")).remove();

                    });
                    cell8.appendChild(buttonDelete);

                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}

function getFullWatchlist(){

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var fullWatchlist = [];

            var refPortfolio = firebase.database().ref("Watchlists");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                var result = [];
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        var help = [];
                        help["pk"] = value.key;
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();

                        fullWatchlist.push(help);
                    });

                    //sort in order stocksymbole
                    fullWatchlist.sort( function (a, b) {
                        return a.stockSymbol.localeCompare(b.stockSymbol);
                    });
                }
            }).then(function(){
                //work with data in here ... fill donut and so on
                //array looks like this:
                //[[userId, stockSymbol],[userId, stockSymbol],...]
                // console.log(fullWatchlist);

                //populate portfolioTable
                var table = document.getElementById("watchlistTable");
                for(var i=0; i<fullWatchlist.length;i++){
                    var stockTransferURL = "IndividualStockPage.html?stock=" + fullWatchlist[i].stockSymbol + "#";

                    var row = table.insertRow(i+1);
                    row.setAttribute("data-pk", fullWatchlist[i].pk);

                    stockSymbolIndexW = fullWatchlist[i].stockSymbol;
                    cardArrayW.push(fullWatchlist[i].stockSymbol);

                    CardFunction();

                    // // Send Symbols to D3 percent Change graph
                    // getPercentChangeData(fullWatchlist[i].stockSymbol);

                    // stock symbol
                    var cell0 = row.insertCell((0));
                    cell0.innerHTML = fullWatchlist[i].stockSymbol.link(stockTransferURL);

                    // Current Stock price
                    var cell2 = row.insertCell((1));

                    // Current 3m%
                    var cell3 = row.insertCell((2));

                    // Current 6m%
                    var cell4 = row.insertCell((3));

                    // Current 1Y%
                    var cell5 = row.insertCell((4));

                    getWatchlistValue(stockSymbolIndexW, cell2, cell3, cell4, cell5);

                    //add delete button
                    var cell6 = row.insertCell((5));
                    //set button class
                    cell6.setAttribute("class", "deleteButton");
                    //centralize content
                    cell6.style.display = 'flex';
                    cell6.style.alignItems = 'center';
                    cell6.style.justifyContent = 'center';

                    var buttonDelete = document.createElement("BUTTON");
                    buttonDelete.appendChild(document.createTextNode("Delete"));
                    buttonDelete.addEventListener('click', function (button) {
                        var row = button.path[2];
                        var stockSymbol = row.firstChild.firstChild.innerHTML;

                        //removes the row from table
                        row.parentNode.removeChild(row);
                        firebase.database().ref("Watchlists/" + row.getAttribute("data-pk")).remove();

                    });
                    cell6.appendChild(buttonDelete);
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });


}

// Unicode for UP and DOWN arrows
var unicodeUp = '\u25B2';
var unicodeDown = '\u25BC';

// Adding color
unicodeUp = unicodeUp.fontcolor("green");
unicodeDown = unicodeDown.fontcolor("red");


/** Generic Ajax **/
function getPortfolioValue(stockSymbol, keyValue, cell0, cell1, cell2, cell3, otherValue){

    var getValueUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/quote";

    if (keyValue === "price"){
        // Get price from stock symbol

        setInterval(function () {
            $.ajax({
                async: false,
                url: getValueUrl,
                success: function (data) {

                    // @TODO Create Tooltip for table

                    //Calculating percent change
                    var percent = percentChange(cell3, data.latestPrice);

                    if (percent < 0){
                        cell2.innerHTML = unicodeDown + " " + percent.toFixed(2) + "%";
                    } else {
                        cell2.innerHTML = unicodeUp + " " + percent.toFixed(2) + "%";
                    }

                    // Sending percent to Bar Chart
                    grabPercentChange(stockSymbol, percent);

                    // Latest price
                    cell0.innerHTML = "$" + data.latestPrice.toFixed(2);

                    // Current equity
                    cell1.innerHTML = "$" + (data.latestPrice * otherValue).toFixed(2);
                }
            });
        }, 3000);
    }
}
function fillDonut(){
    var donut = donut()
        .width(200)
        .height(200)
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('Quantity')
        .category('StockSymbol');


    d3.select('#Chart')
        .datum(donutQuantityArray) // bind data to the div
        .call(donut); // draw chart in div
}







/** Grabbing Watchlist Values **/
function getWatchlistValue(stockSymbolIndexW, currentPCell, threeMonthCell, sixMonthCell, oneYearCell) {

    /** Grabbing Current Price **/
    var getValueUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbolIndexW + "/quote";

    setInterval(function () {
        $.ajax({
            async: false,
            url: getValueUrl,
            success: function (data) {
                currentPCell.innerHTML = "$" + data.latestPrice.toFixed(3);
            }
        });
    }, 3000);

    /** Showing Stats **/
    var percentUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbolIndexW +  "/stats";

    setTimeout(function () {
        $.ajax({
            url: percentUrl,
            success: function (data) {

                // 3 month percent change
                if (data.month3ChangePercent < 0){
                    threeMonthCell.innerHTML = unicodeDown + " " + (data.month3ChangePercent * 100).toFixed(2) + "%";
                } else {
                    threeMonthCell.innerHTML = unicodeUp + " " + (data.month3ChangePercent * 100).toFixed(2) + "%";
                }

                // 6 month
                if (data.month6ChangePercent < 0) {
                    sixMonthCell.innerHTML = unicodeDown + " " + (data.month6ChangePercent * 100).toFixed(2) + "%";
                } else {
                    sixMonthCell.innerHTML = unicodeUp + " " + (data.month6ChangePercent * 100).toFixed(2) + "%";
                }

                // 1 year
                if (data.year1ChangePercent < 0) {
                    oneYearCell.innerHTML = unicodeDown + " " + (data.year1ChangePercent * 100).toFixed(2) + "%";
                } else {
                    oneYearCell.innerHTML = unicodeUp + " " + (data.year1ChangePercent * 100).toFixed(2) + "%";
                }
            }
        });
    });
}

/** Percent Change **/
function percentChange (y1, y2) {
    return (((y2 - y1) / y1)*100)
}

/** Top Cards **/
function CardFunction() {

    var timeResult = stockMarketTime();

    // if the portfolio has 4 stocks push to cards
    if (cardArrayP.length >= 4) {

        // Pushing all Stocks to the cards
        for (var j = 0; j < cardArrayP.length; j++){
            fourCardArray.push(cardArrayP[j]);
        }

        console.log("portfolio full")
    } else {

        // Less than four Stocks in the array
        if (cardArrayP !== undefined || cardArrayP.length !== 0){

            console.log("portfolio is not empty");

            // Pushing all available Stocks in the portfolio to the cards
            for (var z = 0; z < cardArrayP.length; z++){
                fourCardArray.push(cardArrayP[z]);
            }

            if (fourCardArray.length < 4) {
                // Pushing all available Stocks in the portfolio to the cards
                for (var y = 0; y < cardArrayW.length; y++){
                    fourCardArray.push(cardArrayW[y]);
                }

                if (fourCardArray.length < 4) {
                    console.log("nothing in either")
                }
            }
        } else if(cardArrayW !== undefined || cardArrayW.length !== 0){
            // Pushing all available Stocks in the portfolio to the cards
            for (var y = 0; y < cardArrayW.length; y++){
                fourCardArray.push(cardArrayW[y]);
            }
        } else {

        }

    }

    console.log(fourCardArray);

    if (timeResult === "open"){

        /** Stock Market Open SetTimeOut **/
        setTimeout(function() {
            for (j = 0; j < fourCardArray.length; j++){

                $.ajax({
                    url: "https://api.iextrading.com/1.0/stock/" + fourCardArray[j] + "/quote",
                    success: function(data) {
                        console.log(data);

                        if (count === 0){
                            companyNameVar = "CompanyName" + 1;
                            stockPriceVar = "StockPrice" + 1;
                        } else if (count === 1) {
                            companyNameVar = "CompanyName" + 2;
                            stockPriceVar = "StockPrice" + 2;
                        } else if (count === 2) {
                            companyNameVar = "CompanyName" + 3;
                            stockPriceVar = "StockPrice" + 3;
                        } else {
                            companyNameVar = "CompanyName" + 4;
                            stockPriceVar = "StockPrice" + 4;
                        }

                        console.log("companyName",companyNameVar);
                        console.log("stockPrice",stockPriceVar);

                        document.getElementById(companyNameVar).innerHTML = data.companyName;
                        document.getElementById(stockPriceVar).innerHTML = data.latestPrice;

                        count++;
                    }
                });
            }
        });

        /** Stock Market Open setInterval **/
        setInterval(function() {
            for (j = 0; j < fourCardArray.length; j++){

                $.ajax({
                    url: "https://api.iextrading.com/1.0/stock/" + fourCardArray[j] + "/quote",
                    success: function(data) {
                        console.log(data);

                        if (count === 0){
                            companyNameVar = "CompanyName" + 1;
                            stockPriceVar = "StockPrice" + 1;
                        } else if (count === 1) {
                            companyNameVar = "CompanyName" + 2;
                            stockPriceVar = "StockPrice" + 2;
                        } else if (count === 2) {
                            companyNameVar = "CompanyName" + 3;
                            stockPriceVar = "StockPrice" + 3;
                        } else {
                            companyNameVar = "CompanyName" + 4;
                            stockPriceVar = "StockPrice" + 4;
                        }

                        console.log("companyName",companyNameVar);
                        console.log("stockPrice",stockPriceVar);

                        document.getElementById(companyNameVar).innerHTML = data.companyName;
                        document.getElementById(stockPriceVar).innerHTML = data.latestPrice;

                        count++;
                    }
                });
            }

            // Change me later
        }, 3000);
    } else {

        /** Stock Market Closed SetTimeOut **/
        var count = 0;

        setTimeout(function() {
            for (j = 0; j < fourCardArray.length; j++){

                $.ajax({
                    url: "https://api.iextrading.com/1.0/stock/" + fourCardArray[j] + "/quote",
                    success: function(data) {
                        console.log(data);

                        if (count === 0){
                            companyNameVar = "CompanyName" + 1;
                            stockPriceVar = "StockPrice" + 1;
                        } else if (count === 1) {
                            companyNameVar = "CompanyName" + 2;
                            stockPriceVar = "StockPrice" + 2;
                        } else if (count === 2) {
                            companyNameVar = "CompanyName" + 3;
                            stockPriceVar = "StockPrice" + 3;
                        } else {
                            companyNameVar = "CompanyName" + 4;
                            stockPriceVar = "StockPrice" + 4;
                        }

                        console.log("companyName",companyNameVar);
                        console.log("stockPrice",stockPriceVar);

                        document.getElementById(companyNameVar).innerHTML = data.companyName;
                        document.getElementById(stockPriceVar).innerHTML = data.latestPrice;

                        count++;
                    }
                });
            }
        });
    }
}

/** Calculate if Stock Market is open **/
function stockMarketTime() {

    /** Only 9:30am - 4:00pm M-F **/
    var date = new Date();
    var today = date.getDay();

    if (today >= 1 && today <= 5) {

        // Determine the time
        var time = date.getHours();
        if (time >= 9 && time <= 16) {
            return "open";
        } else {
            return "closed";
        }

    } else {
        console.log("closed");
        return "closed";
    }
}
