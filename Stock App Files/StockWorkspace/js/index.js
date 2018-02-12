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
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}