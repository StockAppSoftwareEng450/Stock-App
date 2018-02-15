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
                for(var i=0; i<fullPortfolio.length;i++){
                    var stockTransferURL = "IndividualStockPage.html?stock=" + fullPortfolio[i].stockSymbol + "#";
                    var row = table.insertRow(i+1);

                    var cell0 = row.insertCell((0));
                    cell0.innerHTML = fullPortfolio[i].stockSymbol.link(stockTransferURL);

                    var cell1 = row.insertCell((1));
                    cell1.innerHTML = fullPortfolio[i].date;

                    var cell2 = row.insertCell((2));
                    cell2.innerHTML = "$" + fullPortfolio[i].price;

                    var cell3 = row.insertCell((3));
                    cell3.innerHTML = fullPortfolio[i].quantity;
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
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}