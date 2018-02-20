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

var stockSymbolIndex = null;

function getFullPortfolio(){

    //getting portfolio information and save it
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var fullPortfolio = [];

            var refPortfolio = firebase.database().ref("Portfolios");
            refPortfolio.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                var result = [];
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        var help = [];
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();
                        help["date"] = value.child("date").val();
                        help["price"] = value.child("price").val();
                        help["quantity"] = value.child("quantity").val();

                        fullPortfolio.push(help);
                    });
                }
            }).then(function(){
                //work with data in here ... fill donut and so on
                //array looks like this:
                //[[userId, stockSymbol, date, price, quantity],[userId, stockSymbol, date, price, quantity],...]
                console.log(fullPortfolio);

                //populate portfolioTable
                var table = document.getElementById("portfolioTable");
                for(var i = 0; i < fullPortfolio.length; i++){
                    var stockTransferURL = "IndividualStockPage.html?stock=" + fullPortfolio[i].stockSymbol + "#";
                    var row = table.insertRow(i+1);

                    stockSymbolIndex = fullPortfolio[i].stockSymbol;

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

                    // Purchased Equity
                    var cell5 = row.insertCell((5));
                    var purchasedEquity = fullPortfolio[i].price * fullPortfolio[i].quantity;
                    console.log("Purchased equity: " + purchasedEquity);
                    cell5.innerHTML = "$" + purchasedEquity.toString();

                    // Current Equity
                    var cell6 = row.insertCell((6));

                    // Current Percent Change
                    var cell7 = row.insertCell((7));

                    var passArray = [stockSymbolIndex, "price", cell3, cell6, fullPortfolio[i].quantity, fullPortfolio[i].price, cell7 ];
                    getValue(passArray);

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
                    buttonDelete.addEventListener('click', function(button){
                        var row = button.path[2];
                        var stockSymbol = row.firstChild.firstChild.innerHTML;

                        //removes the row from table
                        row.parentNode.removeChild(row);

                        //removes the firebase portfolio entry for this user and stock
                        var ref = firebase.database().ref("Portfolios");
                        ref.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                            if(snapshot.exists()){
                                snapshot.forEach(function (value){
                                    if(stockSymbol === value.child("stockSymbol").val()){
                                        firebase.database().ref("Portfolios/" + value.key).remove();
                                    }
                                });
                            }
                        });
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
                        help["userId"] = value.child("userId").val();
                        help["stockSymbol"] = value.child("stockSymbol").val();

                        fullWatchlist.push(help);
                    });
                }
            }).then(function(){
                //work with data in here ... fill donut and so on
                //array looks like this:
                //[[userId, stockSymbol],[userId, stockSymbol],...]
                console.log(fullWatchlist);

                //populate portfolioTable
                var table = document.getElementById("watchlistTable");
                for(var i=0; i<fullWatchlist.length;i++){
                    var stockTransferURL = "IndividualStockPage.html?stock=" + fullWatchlist[i].stockSymbol + "#";
                    var row = table.insertRow(i+1);

                    var cell0 = row.insertCell((0));
                    cell0.innerHTML = fullWatchlist[i].stockSymbol.link(stockTransferURL);

                    //add delete button
                    var cel1 = row.insertCell((1));
                    //set button class
                    cel1.setAttribute("class", "deleteButton");
                    //centralize content
                    cel1.style.display = 'flex';
                    cel1.style.alignItems = 'center';
                    cel1.style.justifyContent = 'center';

                    var buttonDelete = document.createElement("BUTTON");
                    buttonDelete.appendChild(document.createTextNode("Delete"));
                    buttonDelete.addEventListener(
                        'click',
                        function(button){
                            var row = button.path[2];
                            var stockSymbol = row.firstChild.firstChild.innerHTML;

                            //removes the row from table
                            row.parentNode.removeChild(row);

                            //removes the firebase portfolio entry for this user and stock
                            var ref = firebase.database().ref("Watchlists");
                            ref.orderByChild("userId").equalTo(user.uid).once("value", function(snapshot) {
                                if(snapshot.exists()){
                                    snapshot.forEach(function (value){
                                        if(stockSymbol === value.child("stockSymbol").val()){
                                            firebase.database().ref("Watchlists/" + value.key).remove();
                                        }
                                    });
                                }
                            });
                        });
                    cel1.appendChild(buttonDelete);
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}

/** Generic Ajax **/
function getValue(array){

    // unicode for UP and DOWN arrows
    var unicodeUp = '\u25B2';
    var unicodeDown = '\u25BC';

    // adding color
    unicodeUp = unicodeUp.fontcolor("green");
    unicodeDown = unicodeDown.fontcolor("red");

    var                 stockSymbol =   array[0],
                        keyValue = array[1],
                        cell0 = array[2],
                        cell1 = array[3],
                        otherValue  = array[4],
                        otherCell   = array[5],
                        cell2 = array[6];

    var getValueUrl = "https://api.iextrading.com/1.0/stock/" + stockSymbol + "/quote";

    if (keyValue === "price"){
        // Get price from stock symbol

        setInterval(function () {
            $.ajax({
                async: false,
                url: getValueUrl,
                success: function (data) {

                    //Calculating percent change
                    var percent = percentChange(otherCell, data.latestPrice);

                    if (percent < 0){
                        cell2.innerHTML = unicodeDown + " " + percent.toFixed(2) + "%";
                    } else {
                        cell2.innerHTML = unicodeUp + " " + percent.toFixed(2) + "%";
                    }

                    cell0.innerHTML = "$" + data.latestPrice;
                    cell1.innerHTML = "$" + (data.latestPrice * otherValue);
                }
            });
        }, 3000);
    }
}

/** Percent Change **/
function percentChange (y1, y2) {
    return (((y2 - y1) / y1)*100)
}
