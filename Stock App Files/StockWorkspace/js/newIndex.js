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
    })
});

/** Clean Portfolio **/
function getFullPortfolio() {

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var fullPortfolio = [];

            var refPortfolio = firebase.database().ref("Portfolios");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {

                if (snapshot.exists()) {
                    snapshot.forEach(function (value) {
                        var help = [];
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
            var fullWatchlist = [];

            var refPortfolio = firebase.database().ref("Watchlists");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function (snapshot) {
                var result = [];
                if (snapshot.exists()) {
                    snapshot.forEach(function (value) {
                        var help = [];
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

    var stockSymbolRequest = "";

    // Enumerating over all stock Symbols for portfolio
    for (var i = 0; i < fullPortfolio.length; i++){
        stockSymbolRequest += fullPortfolio[i].stockSymbol + ",";
    }

    var url =  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockSymbolRequest + "&types=quote,stats,price";

    // Returns whether stockMarket is open or closed
    var openClosedResult = stockMarketTime();

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
        for(var i = 0; i < 4; i++){
            var companyNameE0 = "CompanyName" + i;
            document.getElementById(companyNameE0).innerHTML = "Add Items to your Portfolio";
        }

        // Finding Table
        var table = document.getElementById("portfolioTable");

        // Display Items empty in table, create only one cell
        var row = table.insertRow(1);
        var cell = row.insertCell((0));
        cell.innerHTML = "Add Items to your Portfolio";

        for (var i = 1; i < 9; i++) {
            var celli = row.insertCell((i));
            celli.innerHTML = "";
        }
    }
}

var portfolioArray = [];

/** Displaying the Portfolio Table **/
function displayDataToTableP(data, fullPortfolio) {

    var percentArray = [];
    var purchasedEquity = 0;
    var currentEquity = 0;

    // Finding Table
    var table = document.getElementById("portfolioTable");

    // Checking if something in fullPortfolio


    // Returning the price and stats for each Stock Symbol
    for (var i = 0; i < fullPortfolio.length; i++) {
        // console.log("Returning quote: " + i , data[Object.keys(data)[i]].quote);
        // console.log("Returning stats: " + i , data[Object.keys(data)[i]].stats);
        // console.log("Returning price: " + i , data[Object.keys(data)[i]].price);
        // console.log("-----------------------------------------------");

        // Transfers stock to the Individual StockPage
        var stockTransferURL = "IndividualStockPage.html?stock=" + data[Object.keys(data)[i]].quote.symbol + "#";

        // Inserting rows
        var row = table.insertRow(i + 1);
        row.setAttribute("data-pk", fullPortfolio[i].pk);

        // Displaying Stock Symbol  (FROM FIREBASE)
        var cell0 = row.insertCell((0));
        cell0.innerHTML = fullPortfolio[i].stockSymbol.link(stockTransferURL);

        // Date purchased           (FROM FIREBASE)
        var cell1 = row.insertCell((1));
        cell1.innerHTML = fullPortfolio[i].date;

        // Purchased Price          (FROM FIREBASE)
        var cell2 = row.insertCell((2));
        cell2.innerHTML = currencySymbole + " " + fx.convert(fullPortfolio[i].price).toFixed(2);

        // Current Price            (FROM IEX)
        var cell3 = row.insertCell((3));
        cell3.innerHTML = currencySymbole + " " + fx.convert(data[Object.keys(data)[i]].price).toFixed(2);

        // Quantity                 (FROM FIREBASE)
        var cell4 = row.insertCell((4));
        cell4.innerHTML = fullPortfolio[i].quantity;

        // Purchased Equity         (FROM FIREBASE)
        var cell5 = row.insertCell((5));
        cell5.innerHTML = currencySymbole + " " + (fx.convert(fullPortfolio[i].price * fullPortfolio[i].quantity)).toFixed(2).toString();
        purchasedEquity += Number(fx.convert((fullPortfolio[i].price * fullPortfolio[i].quantity)).toFixed(2));

        // console.log(purchasedEquity);

        // Current Equity           (Calculation)
        var cell6 = row.insertCell((6));
        cell6.innerHTML = currencySymbole + " " + fx.convert((data[Object.keys(data)[i]].price * fullPortfolio[i].quantity)).toFixed(2);
        currentEquity += Number((data[Object.keys(data)[i]].price * fullPortfolio[i].quantity).toFixed(2));

        // console.log(currentEquity);

        // Current Percent Change   (Calculation)   Bought price vs current price
        var cell7 = row.insertCell((7));
        cell7.innerHTML = (((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2).toString();

        // Delete Button            (FROM FIREBASE)
        var cell8 = row.insertCell((8));
        cell8.setAttribute("class", "deleteButton");
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

        // @TODO Create Tooltip/ Title when hovering over the stock symbol

        // Displaying the color for unicode for the percentage change
        if ((((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100) < 0) {
            cell7.innerHTML = unicodeDown + " " + (((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        } else {
            cell7.innerHTML = unicodeUp + " " + (((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        }

        // entering info to donutQuantityArray
        portfolioArray[i] = {
            StockSymbol: fullPortfolio[i].stockSymbol,
            Quantity: fullPortfolio[i].quantity
        };

        // Sending to Bar Chart in the future
        percentArray.push((((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2));
    }

    // Send to Bar Chart
    grabPortfolioBarChart(fullPortfolio, percentArray);

    // Displaying Total Purchased Equity
    purchasedEquity = purchasedEquity.toFixed(2);
    currentEquity = currentEquity.toFixed(2);
    document.getElementById("TotalPurchasedEquity").innerHTML = currencySymbole + " " + fx.convert(purchasedEquity).toFixed(2).toString();
    document.getElementById("TotalCurrentEquity").innerHTML = currencySymbole + " " +  fx.convert(currentEquity).toFixed(2).toString();

    // Display negative when less than zero and color to red
    if ((currentEquity - purchasedEquity) < 0){
        document.getElementById("profit").innerHTML = currencySymbole + " " + fx.convert((currentEquity - purchasedEquity)).toFixed(2).toString();
        var negVal = document.getElementById("profit");
        negVal.setAttribute('style', 'color: #D53343 !important');
    } else {
        document.getElementById("profit").innerHTML = currencySymbole + " " + fx.convert((currentEquity - purchasedEquity)).toFixed(2).toString();
    }

    var after1yearTotal = 0;
    var before1yearTotal = 0;
    var afterTaxProfitTotal = 0;

    // given any date for any stock, determine if it is over a year old, then take out 15% in tax, otherwise 30% in tax takeaway
    for (var i = 0; i < fullPortfolio.length; i++) {

        // Parsing each date in the portfolio to convert to JS Date format
        var month =  "";
        month = fullPortfolio[i].date.substring(5,7);                               // 03

        var year = "";
        year = fullPortfolio[i].date.substring(0,4);                                // 2018

        var day = "";
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
        var givenDate = new Date(month + " " + day + "," + year);
        var curDate = new Date();

        curDate.toLocaleDateString();
        curDate.setMonth(curDate.getMonth() - 12);
        curDate.toLocaleDateString();

        console.log("givenDate" + i + ": ", givenDate);
        console.log("oldDate" + i + ": ", curDate);
        console.log(givenDate < curDate);

        var purchasedEquit = fullPortfolio[i].price * fullPortfolio[i].quantity;
        var currentEquit = (data[Object.keys(data)[i]].price * fullPortfolio[i].quantity);

        // Calculating profit
        var profitAfterTax = currentEquit - purchasedEquit;
        // profitAfterTax = profitAfterTax.toFixed(2);

        console.log("purchasedEquity" + fullPortfolio[i].stockSymbol + ": ", purchasedEquit);
        console.log("currentEquit" + fullPortfolio[i].stockSymbol + ": ", currentEquit);
        console.log("profitAfterTax" + fullPortfolio[i].stockSymbol + ": ", profitAfterTax);

        // 15% in tax after 1 year, otherwise 30% if date is before
        if ((givenDate < curDate) === true) {
            var resultAfter = (15 / 100) * profitAfterTax;
            after1yearTotal += profitAfterTax - resultAfter;
            console.log("after1yearTotal" + i + ": ", after1yearTotal);
        } else if ((givenDate < curDate) === false) {
            var resultBefore = (30 / 100) * profitAfterTax;
            before1yearTotal += profitAfterTax - resultBefore;
            console.log("before1yearTotal" + i + ": ", before1yearTotal);
        }

        // Display total after tax to the screen
        document.getElementById("afterTax").innerHTML = currencySymbole + " " + fx.convert((before1yearTotal + after1yearTotal)).toFixed(2).toString();
    }

    // Displaying Donut JS
    fillDonut(portfolioArray);

}

/** Issuing Batch Request for Watchlist **/
function issueBatchRequestW(fullWatchlist){

    var stockSymbolRequest = "";

    // Enumerating over all stock Symbols for portfolio
    for (var i = 0; i < fullWatchlist.length; i++){
        stockSymbolRequest += fullWatchlist[i].stockSymbol + ",";
    }

    // Concate URL
    var url =  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockSymbolRequest + "&types=quote,stats,price";

    // Returns whether stockMarket is open or closed
    var openClosedResult = stockMarketTime();

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

    var table = document.getElementById("watchlistTable");

        // console.log("-----------------------------------------------");
        for (var i = 0; i < fullWatchlist.length; i++) {

        // console.log("Returning quote: " + i, data[Object.keys(data)[i]].quote);
        // console.log("Returning stats: " + i, data[Object.keys(data)[i]].stats);
        // console.log("Returning price: " + i, data[Object.keys(data)[i]].price);
        // console.log("-----------------------------------------------");

        var stockTransferURL = "IndividualStockPage.html?stock=" + data[Object.keys(data)[i]].quote.symbol + "#";

        var row = table.insertRow(i + 1);
        row.setAttribute("data-pk", fullWatchlist[i].pk);

        // Stock Symbol
        var cell0 = row.insertCell((0));
        cell0.innerHTML = fullWatchlist[i].stockSymbol.link(stockTransferURL);

        // Current Price
        var cell1 = row.insertCell((1));
        cell1.innerHTML = currencySymbole + " " + fx.convert(data[Object.keys(data)[i]].price).toFixed(2);

        // 3 Month Percent
        var cell2 = row.insertCell((2));

        if (data[Object.keys(data)[i]].stats.month3ChangePercent > 0){
            cell2.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.month3ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell2.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.month3ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // 6 Month Percent
        var cell3 = row.insertCell((3));

        if (data[Object.keys(data)[i]].stats.month6ChangePercent > 0){
            cell3.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.month6ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell3.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.month6ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // 1 Year Percent
        var cell4 = row.insertCell((4));

        if (data[Object.keys(data)[i]].stats.year1ChangePercent > 0){
            cell4.innerHTML = unicodeUp + " " + ((data[Object.keys(data)[i]].stats.year1ChangePercent) * 100).toFixed(2).toString() + "%";
        } else {
            cell4.innerHTML = unicodeDown + ((data[Object.keys(data)[i]].stats.year1ChangePercent) * 100).toFixed(2).toString() + "%";
        }

        // add delete button
        var cell5 = row.insertCell((5));
        cell5.setAttribute("class", "deleteButton");
        cell5.style.display = 'flex';
        cell5.style.alignItems = 'center';
        cell5.style.justifyContent = 'center';

        var buttonDelete = document.createElement("BUTTON");
        buttonDelete.appendChild(document.createTextNode("Delete"));
        buttonDelete.addEventListener('click', function (button) {
            var row = button.path[2];
            var stockSymbol = row.firstChild.firstChild.innerHTML;

            //removes the row from table
            row.parentNode.removeChild(row);
            firebase.database().ref("Watchlists/" + row.getAttribute("data-pk")).remove();

        });
        cell5.appendChild(buttonDelete);
    }
}

/** Displaying Donut **/
function fillDonut(portfolioArray){

    var donut = donutChart()
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
    var time = new Date();
    // console.log("reached");
    var pageLoadTimeString = time.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }
    );

    document.getElementById("timeUpdate1").innerHTML = "Updated today at " + pageLoadTimeString.toString();
    document.getElementById("timeUpdate2").innerHTML = "Updated today at " + pageLoadTimeString.toString();
    document.getElementById("timeUpdate3").innerHTML = "Updated today at " + pageLoadTimeString.toString();
}

/** Top Cards **/
function displayCards(data, fullPortfolio) {

    // console.log(data[Object.keys(data)[0]].quote.companyName);
    // console.log(fullPortfolio.length);

    // If portfolio contains more than four, return the first four, if not, return as many as possible with (add more in company name)
    if (fullPortfolio.length > 4){

        // console.log("more than four in portfolio");

        // Return the First four in the list
        for(var i = 0; i < 4; i++){
            var companyNameI = "CompanyName" + i;
            var stockPriceI = "StockPrice" + i;

            document.getElementById(companyNameI).innerHTML = limitCharacter((data[Object.keys(data)[i]].quote.companyName));
            document.getElementById(stockPriceI).innerHTML = data[Object.keys(data)[i]].price;
        }
    } else {

        // console.log("less than four in portfolio");

        // If fullPortfolio is greater than or equal to 1
        if (fullPortfolio.length >= 1) {

            // Return as many as possible first, if only 1, 2, or 3
            for(var i = 0; i < fullPortfolio.length; i++){
                var companyNameE = "CompanyName" + i;
                var stockPriceE = "StockPrice" + i;

                document.getElementById(companyNameE).innerHTML = limitCharacter((data[Object.keys(data)[i]].quote.companyName));
                document.getElementById(stockPriceE).innerHTML = data[Object.keys(data)[i]].price;
            }

            var leftOver = 4 - fullPortfolio.length;

            // Starting on second card for 1
            if (leftOver === 3) {
                for(var i = 1; i < 4; i++){
                    var companyNameE1 = "CompanyName" + i;
                    document.getElementById(companyNameE1).innerHTML = "Add Items to your Portfolio";
                }
            }

            // Starting on third card for 2
            if (leftOver === 2) {
                for(var i = 2; i < 4; i++){
                    var companyNameE2 = "CompanyName" + i;
                    document.getElementById(companyNameE2).innerHTML = "Add Items to your Portfolio";
                }
            }

            // Starting on fourth card for 3
            if (leftOver === 1) {
                for(var i = 3; i < 4; i++){
                    var companyNameE3 = "CompanyName" + i;
                    document.getElementById(companyNameE3).innerHTML = "Add Items to your Portfolio";
                }
            }
        } else {

            // console.log("No Items in portfolio");

            // if its less than 0 then
            for(var i = 0; i < 4; i++){
                var companyNameE0 = "CompanyName" + i;
                document.getElementById(companyNameE0).innerHTML = "Add Items to your Portfolio";
            }
        }
    }
}

// Limiting character limit for company Name for Cards
function limitCharacter(companyName){
    var companyNameLimit = "";

    if (companyName.length > 35) {
        companyNameLimit = companyName.substring(0, 35);
        return companyNameLimit;
    } else {
        companyNameLimit = companyName;
        return companyNameLimit;
    }
}