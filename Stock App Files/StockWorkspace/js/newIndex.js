/** Loading Screen Gif **/
// On ready function
function onReady(callback) {
    let intervalID = window.setInterval(checkReady, 2000);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

"use strict";

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

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

onReady(function () {
    show('LoadingMain', true);
    show('loading', false);
});

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            getFullPortfolio();
            getFullWatchlist();
            PageLoadTime();

        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });

    // Calling footer Copyright
    setCopyrightTime();
});

/** Clean Portfolio **/
function getFullPortfolio() {

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            let fullPortfolio = [];

            let refPortfolio = firebase.database().ref("Portfolios");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {

                if (snapshot.exists()) {
                    snapshot.forEach(function (value) {
                        let help = [];
                        help["pk"] = value.key;
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();
                        help["date"] = value.child("date").val();
                        help["price"] = value.child("price").val();
                        help["quantity"] = value.child("quantity").val();

                        fullPortfolio.push(help);
                    });

                    // sort in order stocksymbol
                    fullPortfolio.sort(function (a, b) {
                        return a.stockSymbol.localeCompare(b.stockSymbol);
                    });

                }
            }).then(function () {

                // Issuing BatchRequest for Portfolio
                issueBatchRequestP(fullPortfolio);

                // Calling the D3 full Portfolio
                getOneDayPrice(fullPortfolio);

            });
        } else {

            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}

/** Clean Watchlist **/
function getFullWatchlist() {

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            let fullWatchlist = [];

            let refPortfolio = firebase.database().ref("Watchlists");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {
                let result = [];
                if (snapshot.exists()) {
                    snapshot.forEach(function (value) {
                        let help = [];
                        help["pk"] = value.key;
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();

                        fullWatchlist.push(help);
                    });

                    // Sort in order stocksymbol
                    fullWatchlist.sort(function (a, b) {
                        return a.stockSymbol.localeCompare(b.stockSymbol);
                    });

                }
            }).then(function () {

                // Issuing BatchRequest for Watchlist
                issueBatchRequestW(fullWatchlist);

            });
        } else {

            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}


/** Issuing Portfolio Ajax request **/
function issueBatchRequestP(fullPortfolio) {

    let stockSymbolRequest = "";

    // Enumerating over all stock Symbols for portfolio
    for (let i = 0; i < fullPortfolio.length; i++){
        stockSymbolRequest += fullPortfolio[i].stockSymbol + ",";
    }

    let url =  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockSymbolRequest + "&types=quote,stats,price";

    // Returns whether stockMarket is open or closed
    let openClosedResult = stockMarketTime();

    // Checking to see if fullPortfolio is atLeast 1
    if (fullPortfolio.length >= 1) {

        // Issue Set Interval every 3 seconds when open
        if (openClosedResult === "open") {

            // Returns as soon as available, Interval waits 3 seconds before
            setTimeout(function () {
                $.ajax({
                    url: url,
                    success: function (data) {

                        // Display to Table
                        displayDataToTableP(data,fullPortfolio);

                        // Display Cards
                        displayCards(data, fullPortfolio);
                    }
                });
            });

        } else {

            // Returns once
            setTimeout(function () {
                $.ajax({
                    url: url,
                    success: function (data) {

                        // Display to Table
                        displayDataToTableP(data, fullPortfolio);

                        // Display cards
                        displayCards(data, fullPortfolio);
                    }
                });
            })
        }
    } else {
        console.log("Nothing in portfolio");

        // Nothing in portfolio, then display Add items in portfolio
        for(let i = 0; i < 4; i++){
            let companyNameE0 = "CompanyName" + i;
            document.getElementById(companyNameE0).innerHTML = "Add Items to your Portfolio";
        }

        // Finding Table
        let table = document.getElementById("portfolioTable");

        // Display Items empty in table, create only one cell
        let row = table.insertRow(1);
        let cell = row.insertCell((0));
        cell.innerHTML = "Add Items to your Portfolio";

        for (let i = 1; i < 9; i++) {
            let celli = row.insertCell((i));
            celli.innerHTML = "";
        }
    }
}

let portfolioArray = [];

/** Displaying the Portfolio Table **/
function displayDataToTableP(data, fullPortfolio) {
    let percentArray = [];
    let purchasedEquity = 0;
    let currentEquity = 0;
    let profit = 0;
    let afterTaxProfit = 0;

    // Finding Table
    let table = document.getElementById("portfolioTable");

    // Checking if something in fullPortfolio

    // Returning the price and stats for each Stock Symbol
    for (let i = 0; i < fullPortfolio.length; i++) {
        // console.log("Returning quote: " + i , data[Object.keys(data)[i]].quote);
        // console.log("Returning stats: " + i , data[Object.keys(data)[i]].stats);
        // console.log("Returning price: " + i , data[Object.keys(data)[i]].price);
        // console.log("-----------------------------------------------");

        // Transfers stock to the Individual StockPage
        let stockTransferURL = "IndividualStockPage.html?stock=" + data[fullPortfolio[i].stockSymbol].quote.symbol + "#";

        // Inserting rows
        let row = table.insertRow(i + 1);
        row.setAttribute("data-pk", fullPortfolio[i].pk);

        // Displaying Stock Symbol  (FROM FIREBASE)
        let cell0 = row.insertCell((0));
        cell0.innerHTML = fullPortfolio[i].stockSymbol.link(stockTransferURL);

        // Date purchased           (FROM FIREBASE)
        let cell1 = row.insertCell((1));
        cell1.innerHTML = fullPortfolio[i].date;

        // Purchased Price          (FROM FIREBASE)
        let cell2 = row.insertCell((2));
        cell2.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(fullPortfolio[i].price).toFixed(2));

        // Current Price            (FROM IEX)
        let cell3 = row.insertCell((3));
        cell3.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(data[fullPortfolio[i].stockSymbol].price).toFixed(2));

        // Quantity                 (FROM FIREBASE)
        let cell4 = row.insertCell((4));
        cell4.innerHTML = numberWithCommas(fullPortfolio[i].quantity);

        // Purchased Equity         (FROM FIREBASE)
        let cell5 = row.insertCell((5));
        cell5.innerHTML = currencySymbole + " " + numberWithCommas((fx.convert(fullPortfolio[i].price * fullPortfolio[i].quantity)).toFixed(2));
        purchasedEquity += Number(fx.convert((fullPortfolio[i].price * fullPortfolio[i].quantity)).toFixed(2));

        // console.log(purchasedEquity);

        // Current Equity           (Calculation)
        let cell6 = row.insertCell((6));
        cell6.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert((data[fullPortfolio[i].stockSymbol].price * fullPortfolio[i].quantity)).toFixed(2));
        currentEquity += Number((data[fullPortfolio[i].stockSymbol].price * fullPortfolio[i].quantity).toFixed(2));

        // Profit                   (Calculation)
        let cell7 = row.insertCell((7));
        let profitI = calcProfit(data, fullPortfolio, i);

        // Only Accepts Positive Profit
        if (profitI > 0){
            profit += profitI;
        }

        cell7.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(profitI).toFixed(2));

        // After Tax profit         (Calculation)
        let cell8 = row.insertCell((8));
        let afterTaxProfitI = calcAfterTaxProfit(data, fullPortfolio, i);

        // Only Accepts Positive AfterTax Profit
        if (afterTaxProfitI > 0){
            afterTaxProfit += afterTaxProfitI;
        }

        cell8.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(afterTaxProfitI).toFixed(2));

        // Current Percent Change   (Calculation)   Bought price vs current price
        let cell9 = row.insertCell((9));
        cell9.innerHTML = (((data[fullPortfolio[i].stockSymbol].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2).toString();

        // Delete Button            (FROM FIREBASE)
        let cell10 = row.insertCell((10));
        cell10.setAttribute("class", "deleteButton");
        cell10.style.display = 'flex';
        cell10.style.alignItems = 'center';
        cell10.style.justifyContent = 'center';

        let buttonDelete = document.createElement("BUTTON");
        buttonDelete.appendChild(document.createTextNode("Delete"));
        buttonDelete.addEventListener('click', function (button) {
            let row = button.path[2];
            let stockSymbol = row.firstChild.firstChild.innerHTML;

            //removes the row from table
            row.parentNode.removeChild(row);
            firebase.database().ref("Portfolios/" + row.getAttribute("data-pk")).remove();
            window.location.href = "index.html";
        });
        cell10.appendChild(buttonDelete);

        // @TODO Create Tooltip/ Title when hovering over the stock symbol

        // Displaying the color for unicode for the percentage change
        if ((((data[fullPortfolio[i].stockSymbol].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100) < 0) {
            cell9.innerHTML = unicodeDown + " " + (((data[fullPortfolio[i].stockSymbol].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        } else {
            cell9.innerHTML = unicodeUp + " " + (((data[fullPortfolio[i].stockSymbol].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        }

        // entering info to donutQuantityArray
        portfolioArray[i] = {
            StockSymbol: fullPortfolio[i].stockSymbol,
            Quantity: fullPortfolio[i].quantity
        };

        // Sending to Bar Chart in the future
        percentArray.push((((data[fullPortfolio[i].stockSymbol].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2));
    }

    // Send to Bar Chart
    grabPortfolioBarChart(fullPortfolio, percentArray);

    // Displaying Total Purchased Equity
    document.getElementById("TotalPurchasedEquity").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(purchasedEquity).toFixed(2));

    // Displaying Total Current Equity
    document.getElementById("TotalCurrentEquity").innerHTML = currencySymbole + " " +  numberWithCommas(fx.convert(currentEquity).toFixed(2));

    // Entire Portfolio Profit
    document.getElementById("profit").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(profit).toFixed(2));

    // Entire Portfolio After Tax Profit
    document.getElementById("afterTax").innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(afterTaxProfit).toFixed(2));

    // Sending Portfolio to Bar Chart
    setPortfolioEquityBarGraph(fullPortfolio);

    // Displaying Donut JS
    fillDonut(portfolioArray);

}

/** Calculate Profit **/
function calcProfit(data, fullPortfolio, i){
    let purchasedEquit = fullPortfolio[i].price * fullPortfolio[i].quantity;
    let currentEquit = (data[fullPortfolio[i].stockSymbol].price * fullPortfolio[i].quantity);

    console.log(purchasedEquit);
    console.log(currentEquit);

    let profitI = currentEquit - purchasedEquit;
    console.log(profitI);

    return profitI;
}

/** Calculate After Tax Profit **/
function calcAfterTaxProfit(data, fullPortfolio, i) {

    let after1yearTotal = 0;
    let before1yearTotal = 0;

    // Parsing each date in the portfolio to convert to JS Date format
    let month =  "";
    month = fullPortfolio[i].date.substring(5,7);                               // 03

    let year = "";
    year = fullPortfolio[i].date.substring(0,4);                                // 2018

    let day = "";
    day = fullPortfolio[i].date.substring(8,10);                                // 12

    // Converting month number to month name
    if (month === "01"){
        month = "January";
    } else if (month === "02"){
        month = "February";
    } else if (month === "03"){
        month = "March";
    } else if (month === "04"){
        month = "April";
    } else if (month === "05"){
        month = "May";
    } else if (month === "06"){
        month = "June";
    } else if (month === "07"){
        month = "July";
    } else if (month === "08"){
        month = "August";
    } else if (month === "09"){
        month = "September";
    } else if (month === "10"){
        month = "October";
    } else if (month === "11"){
        month = "November";
    } else if (month === "12"){
        month = "December";
    }

    // setting old date to be compared to current date
    let givenDate = new Date(month + " " + day + "," + year);
    let curDate = new Date();

    console.log("givenDate" + givenDate);
    console.log("curDate" + curDate);

    curDate.toLocaleDateString();
    curDate.setMonth(curDate.getMonth() - 12);
    curDate.toLocaleDateString();

    let purchasedEquit = fullPortfolio[i].price * fullPortfolio[i].quantity;
    let currentEquit = (data[fullPortfolio[i].stockSymbol].price * fullPortfolio[i].quantity);

    console.log(purchasedEquit);
    console.log(currentEquit);

    // Calculating profit
    let profitBeforeTax = currentEquit - purchasedEquit;
    console.log(profitBeforeTax);

    // Checking if profit is positive
    if (profitBeforeTax > 0 ){

        // 15% in tax after 1 year, otherwise 30% if date is before
        if ((givenDate < curDate) === true) {
            let resultAfter = (15 / 100) * profitBeforeTax;
            after1yearTotal += profitBeforeTax - resultAfter;
            console.log("after1yearTotal" + i + ": ", after1yearTotal);
            return after1yearTotal;
        } else if ((givenDate < curDate) === false) {
            let resultBefore = (30 / 100) * profitBeforeTax;
            before1yearTotal += profitBeforeTax - resultBefore;
            console.log("before1yearTotal" + i + ": ", before1yearTotal);
            return before1yearTotal;
        }
    } else {
        return 0;
    }
}

/** Issuing Batch Request for Watchlist **/
function issueBatchRequestW(fullWatchlist){

    let stockSymbolRequest = "";

    // Enumerating over all stock Symbols for portfolio
    for (let i = 0; i < fullWatchlist.length; i++){
        stockSymbolRequest += fullWatchlist[i].stockSymbol + ",";
    }

    // Concate URL
    let url =  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockSymbolRequest + "&types=quote,stats,price";

    // Returns whether stockMarket is open or closed
    let openClosedResult = stockMarketTime();

    // Checking if Atleast one is available
    if (fullWatchlist.length >= 1) {

        // Issue Set Interval every 3 seconds when open
        if (openClosedResult === "open") {

            // Returns as soon as available, Interval waits 3 seconds before
            setTimeout(function () {
                $.ajax({
                    url: url,
                    success: function (data) {

                        // Display to Watchlist Table
                        displayDataToTableW(data, fullWatchlist);
                    }
                });
            });

        } else {

            // Returns once
            setTimeout(function () {
                $.ajax({
                    url: url,
                    success: function (data) {

                        // Display to Table
                        displayDataToTableW(data, fullWatchlist);
                    }
                });
            })
        }
    } else {
        console.log("Nothing in Watchlist");
    }
}

/** Watchlist **/
function displayDataToTableW(data, fullWatchlist) {

    let table = document.getElementById("watchlistTable");

        // console.log("-----------------------------------------------");
        for (let i = 0; i < fullWatchlist.length; i++) {

        // console.log("Returning quote: " + i, data[Object.keys(data)[i]].quote);
        // console.log("Returning stats: " + i, data[Object.keys(data)[i]].stats);
        // console.log("Returning price: " + i, data[Object.keys(data)[i]].price);
        // console.log("-----------------------------------------------");

        let stockTransferURL = "IndividualStockPage.html?stock=" + data[Object.keys(data)[i]].quote.symbol + "#";

        let row = table.insertRow(i + 1);
        row.setAttribute("data-pk", fullWatchlist[i].pk);

        // Stock Symbol
        let cell0 = row.insertCell((0));
        cell0.innerHTML = fullWatchlist[i].stockSymbol.link(stockTransferURL);

        // Current Price
        let cell1 = row.insertCell((1));
        cell1.innerHTML = currencySymbole + " " + numberWithCommas(fx.convert(data[Object.keys(data)[i]].price).toFixed(2));

        // 3 Month Percent
        let cell2 = row.insertCell((2));

        if (data[Object.keys(data)[i]].stats.month3ChangePercent > 0){
            cell2.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.month3ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell2.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.month3ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // 6 Month Percent
        let cell3 = row.insertCell((3));

        if (data[Object.keys(data)[i]].stats.month6ChangePercent > 0){
            cell3.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.month6ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell3.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.month6ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // 1 Year Percent
        let cell4 = row.insertCell((4));

        if (data[Object.keys(data)[i]].stats.year1ChangePercent > 0){
            cell4.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.year1ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell4.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.year1ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // add delete button
        let cell5 = row.insertCell((5));
        cell5.setAttribute("class", "deleteButton");
        cell5.style.display = 'flex';
        cell5.style.alignItems = 'center';
        cell5.style.justifyContent = 'center';

        let buttonDelete = document.createElement("BUTTON");
        buttonDelete.appendChild(document.createTextNode("Delete"));
        buttonDelete.addEventListener('click', function (button) {
            let row = button.path[2];
            let stockSymbol = row.firstChild.firstChild.innerHTML;

            //removes the row from table
            row.parentNode.removeChild(row);
            firebase.database().ref("Watchlists/" + row.getAttribute("data-pk")).remove();

        });
        cell5.appendChild(buttonDelete);
    }
}

/** Displaying Donut **/
function fillDonut(portfolioArray){

    let donut = donutChart()
        .width(1000)
        .height(1000)
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('Quantity')
        .category('StockSymbol');

    // console.log("port Array",portfolioArray);

    d3.select('#Piechart')
        .datum(portfolioArray) // bind data to the div
        .call(donut); // draw chart in div
}

// Return Last Updated
function PageLoadTime(){
    let time = new Date();
    // console.log("reached");
    let pageLoadTimeString = time.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }
    );

    document.getElementById("timeUpdate1").innerHTML = "Updated today at " + pageLoadTimeString.toString();
    document.getElementById("timeUpdate2").innerHTML = "Updated today at " + pageLoadTimeString.toString();
    document.getElementById("timeUpdate3").innerHTML = "Updated today at " + pageLoadTimeString.toString();
}

/** removing duplicates **/
function duplicates(array){
    return array.filter(function(val,ind) {
        return array.indexOf(val) === ind;
    });
}

/** Top Cards **/
function displayCards(data, fullPortfolio) {

    let filteredArrS = [];
    let stockSymbol = [];

    // Pushing stock Symbols
    for (let i = 0; i < fullPortfolio.length; i++) {
        stockSymbol.push(fullPortfolio[i].stockSymbol);
    }

    // Removing Duplicates for stock Symbol
    for (let i = 0; i < stockSymbol.length; i++) {
        filteredArrS = duplicates(stockSymbol);
    }

    console.log(filteredArrS);
    console.log((data));

    // If portfolio contains more than four, return the first four, if not, return as many as possible with (add more in company name)
    if (filteredArrS.length > 4){

        // Return the First four in the list
        for(let i = 0; i < 4; i++){
            let companyNameI = "CompanyName" + i;
            let stockPriceI = "StockPrice" + i;
            let viewDetailsI = "viewDetails" + i;

            let stockTransferURLI = "IndividualStockPage.html?stock=" + filteredArrS[i] + "#";

            document.getElementById(companyNameI).innerHTML = limitCharacter((data[Object.keys(data)[i]].quote.companyName));
            document.getElementById(stockPriceI).innerHTML = numberWithCommas(data[Object.keys(data)[i]].price);
            document.getElementById(viewDetailsI).href = stockTransferURLI;
        }
    } else {

        // console.log("less than four in portfolio");

        // If fullPortfolio is greater than or equal to 1
        if (filteredArrS.length >= 1) {

            // Return as many as possible first, if only 1, 2, or 3
            let i = 0;
            for(let ss in data){
                let companyNameE = "CompanyName" + i;
                let stockPriceE = "StockPrice" + i;
                let viewDetails = "viewDetails" + i;

                let stockTransferURL = "IndividualStockPage.html?stock=" + filteredArrS[i] + "#";

                document.getElementById(companyNameE).innerHTML = (data[Object.keys(data)[i]].quote.companyName);
                document.getElementById(stockPriceE).innerHTML = numberWithCommas(data[Object.keys(data)[i]].price);
                document.getElementById(viewDetails).href = stockTransferURL;

                i++;
            }

            let leftOver = 4 - filteredArrS.length;

            // Starting on second card for 1
            if (leftOver === 3) {
                for(let i = 1; i < 4; i++){
                    let companyNameE1 = "CompanyName" + i;
                    document.getElementById(companyNameE1).innerHTML = "Add Items to your Portfolio";
                }
            }

            // Starting on third card for 2
            if (leftOver === 2) {
                for(let i = 2; i < 4; i++){
                    let companyNameE2 = "CompanyName" + i;
                    document.getElementById(companyNameE2).innerHTML = "Add Items to your Portfolio";
                }
            }

            // Starting on fourth card for 3
            if (leftOver === 1) {
                for(let i = 3; i < 4; i++){
                    let companyNameE3 = "CompanyName" + i;
                    document.getElementById(companyNameE3).innerHTML = "Add Items to your Portfolio";
                }
            }
        } else {

            // console.log("No Items in portfolio");

            // if its less than 0 then
            for(let i = 0; i < 4; i++){
                let companyNameE0 = "CompanyName" + i;
                document.getElementById(companyNameE0).innerHTML = "Add Items to your Portfolio";
            }
        }
    }
}

// Limiting character limit for company Name for Cards
function limitCharacter(companyName){
    let companyNameLimit = "";

    if (companyName.length > 35) {
        companyNameLimit = companyName.substring(0, 35);
        return companyNameLimit;
    } else {
        companyNameLimit = companyName;
        return companyNameLimit;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}