//http://openexchangerates.github.io/money.js/
"use strict";
var currencySymbole = "";

// Load exchange rates data via AJAX:
//problem only 1000 requests a month
$.getJSON(
    // NB: using Open Exchange Rates here, but you can use any source!
    'https://openexchangerates.org/api/latest.json?app_id=d540041c0ca14ee5a3440dbd36c39659',
    function(data) {
        // Check money.js has finished loading:
        if ( typeof fx !== "undefined" && fx.rates ) {
            fx.rates = data.rates;
            fx.base = data.base;
        } else {
            // If not, apply to fxSetup global:
            var fxSetup = {
                rates : data.rates,
                base : data.base
            }
        }
    }
);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var ref = firebase.database().ref("Users");
        ref.orderByKey().equalTo(user.uid).once("value", function(snapshot) {
            if(snapshot.exists()){
                snapshot.forEach(function (value){
                    fx.settings = { from: "USD", to: value.val().currency };

                    switch(value.val().currency){
                        case "USD":
                            currencySymbole = "\u0024";
                            break;
                        case "EUR":
                            currencySymbole = "\u20AC";
                            break;
                    }
                });
            }
        });
    }
});
