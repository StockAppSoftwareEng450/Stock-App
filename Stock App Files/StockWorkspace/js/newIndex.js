$(document).ready(function () {
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

                issueBatchRequest(fullPortfolio)
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


            });
        } else {

            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}


/** Issuing one Ajax request **/
function issueBatchRequest(fullPortfolio) {

    var stockSymbolRequest = "";

    // Enumerating over all stock Symbols for portfolio
    for (var i = 0; i < fullPortfolio.length; i++){
        stockSymbolRequest += fullPortfolio[i].stockSymbol + ",";
    }

    var url =  "https://api.iextrading.com/1.0/stock/market/batch?symbols=" + stockSymbolRequest + "&types=quote,stats,price";

    // Returns whether stockMarket is open or closed
    var openClosedResult = stockMarketTime();

    // Issue Set Interval every 3 seconds when open
    if (openClosedResult === "open") {

        // Returns as soon as available, Interval waits 3 seconds before
        setTimeout(function () {
            $.ajax({
                url: url,
                success: function (data) {

                    // Display to Table
                    displayDataToTableP(data,fullPortfolio);
                }
            });
        });

        // @TODO SetInterval is copying entries in the watchlist
        // // Every 3 Seconds
        // setInterval(function () {
        //     $.ajax({
        //         url: batchURL,
        //         success: function (data) {
        //
        //             // Display to Table
        //             displayDataToTableP(data,fullPortfolio);
        //         }
        //     });
        // }, 3000);

    } else {

        // Returns once
        setTimeout(function () {
            $.ajax({
                url: url,
                success: function (data) {

                    // Display to Table
                    displayDataToTableP(data,fullPortfolio);
                }
            });
        })
    }
}

/** Displaying the Portfolio Table **/
function displayDataToTableP(data, fullPortfolio) {

    // Finding Length of object
    var dataLength = Object.keys(data);
    console.log(dataLength.length);

    // Finding Table
    var table = document.getElementById("portfolioTable");

    // Returning the price and stats for each Stock Symbol
    for (var i = 0; i < fullPortfolio.length; i++) {
        console.log("Returning quote: " + i , data[Object.keys(data)[i]].quote);
        console.log("Returning stats: " + i , data[Object.keys(data)[i]].stats);
        console.log("Returning price: " + i , data[Object.keys(data)[i]].price);
        console.log("-----------------------------------------------");

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
        cell2.innerHTML = "$" + fullPortfolio[i].price;

        // Current Price            (FROM IEX)
        var cell3 = row.insertCell((3));
        cell3.innerHTML = "$" + data[Object.keys(data)[i]].price;

        // Quantity                 (FROM FIREBASE)
        var cell4 = row.insertCell((4));
        cell4.innerHTML = fullPortfolio[i].quantity;

        // Purchased Equity         (FROM FIREBASE)
        var cell5 = row.insertCell((5));
        cell5.innerHTML = "$" + (fullPortfolio[i].price * fullPortfolio[i].quantity).toFixed(2).toString();

        // Current Equity           (Calculation)
        var cell6 = row.insertCell((6));
        cell6.innerHTML = "$" + (data[Object.keys(data)[i]].price * fullPortfolio[i].quantity).toFixed(2);

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
        // // Creating Tooltip when Hovering over Stock Symbol to Display Company Name
        // cell0.tooltip({
        //     title: hoverGetData(data[Object.keys(data)[i]].quote.companyName),
        //     html: true,
        //     container: 'body'
        // });

        // Displaying the color for unicode for the percentage change
        if ((((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100) < 0) {
            cell7.innerHTML = unicodeDown + " " + (((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        } else {
            cell7.innerHTML = unicodeUp + " " + (((data[Object.keys(data)[i]].price - fullPortfolio[i].price) / fullPortfolio[i].price) * 100).toFixed(2) + "%";
        }

    }
}




