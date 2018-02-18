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

                    //add delete button
                    var cel4 = row.insertCell((4));
                    //set button class
                    cel4.setAttribute("class", "deleteButton");
                    //centralize content
                    cel4.style.display = 'flex';
                    cel4.style.alignItems = 'center';
                    cel4.style.justifyContent = 'center';

                    var buttonDelete = document.createElement("BUTTON");
                    buttonDelete.appendChild(document.createTextNode("Delete"));
                    buttonDelete.addEventListener(
                    'click',
                    function(button){
                        var row = button.path[2];
                        var stockSymbol = row.firstChild.firstChild.innerHTML

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
                    cel4.appendChild(buttonDelete);

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
                            var stockSymbol = row.firstChild.firstChild.innerHTML

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