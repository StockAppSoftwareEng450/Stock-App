/** Loading Screen Gif **/
function onReady(callback) {
    let intervalID = window.setInterval(checkReady, 1000);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('LoadingMain', true);
    show('loading', false);
});

// Adding name to the top of the screen
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

//colored unicode for UP and DOWN arrows
unicodeUp = '\u25B2';
unicodeDown = '\u25BC';
unicodeUp = unicodeUp.fontcolor("green");
unicodeDown = unicodeDown.fontcolor("red");

let gainersTable = document.getElementById("gainersTable");
let stockGainersUrl = "https://api.iextrading.com/1.0/stock/market/list/gainers";

setTimeout(function () {
        $.ajax({
            url: stockGainersUrl,
            success: function (data) {
                data.sort(compare);

                for(let i = 0; i < data.length; i++) {

                    let row = gainersTable.insertRow(i + 1);
                    let symbol = data[i].symbol.toString();
                    let stockTransferURL = "IndividualStockPage.html?stock=" + symbol + "#";
                    let cell0 = row.insertCell(0);
                    cell0.innerHTML = symbol.link(stockTransferURL);

                    let latestPrice = currencySymbole + " " + fx.convert(data[i].latestPrice).toFixed(2);
                    let cell1 = row.insertCell(1);
                    cell1.innerHTML = latestPrice.toString();


                    let highPrice = currencySymbole + " " + fx.convert(data[i].high).toFixed(2);
                    let cell2 = row.insertCell(2);
                    cell2.innerHTML = highPrice.toString();

                    let lowPrice = currencySymbole + " " + fx.convert(data[i].low).toFixed(2);
                    let cell3 = row.insertCell(3);
                    cell3.innerHTML = lowPrice.toString();

                    let changePercent = data[i].changePercent;
                    changePercent = (changePercent * 100).toFixed(2);
                    let cell4 = row.insertCell(4);
                    if (changePercent < 0) {
                        cell4.innerHTML = unicodeDown + changePercent.toString() + "%";
                    } else {
                        cell4.innerHTML = unicodeUp + changePercent.toString() + "%";
                    }

                }


            }
        });
}, 250);

// Calling footer Copyright
setCopyrightTime();

let losersTable = document.getElementById("losersTable");
let stockLoserUrl = "https://api.iextrading.com/1.0/stock/market/list/losers";

setTimeout(function () {
    $.ajax({
        url: stockLoserUrl,
        success: function (data) {
            data.sort(compare);

            for(let i = 0; i < data.length; i++) {

                let row = losersTable.insertRow(i + 1);

                let symbol = data[i].symbol.toString();
                let stockTransferURL = "IndividualStockPage.html?stock=" + symbol + "#";
                let cell0 = row.insertCell(0);
                cell0.innerHTML = symbol.link(stockTransferURL);

                let latestPrice = currencySymbole + " " + fx.convert(data[i].latestPrice).toFixed(2);
                cell1 = row.insertCell(1);
                cell1.innerHTML = latestPrice.toString();

                let highPrice = currencySymbole + " " + fx.convert(data[i].high).toFixed(2);
                cell2 = row.insertCell(2);
                cell2.innerHTML = highPrice.toString();

                let lowPrice = currencySymbole + " " + fx.convert(data[i].low).toFixed(2);
                cell3 = row.insertCell(3);
                cell3.innerHTML = lowPrice.toString();

                let changePercent = data[i].changePercent;
                changePercent = (changePercent * 100).toFixed(2);
                let cell4 = row.insertCell(4);
                if (changePercent < 0) {
                    cell4.innerHTML = unicodeDown + changePercent.toString() + "%";
                } else {
                    cell4.innerHTML = unicodeUp + changePercent.toString() + "%";
                }
            }

        }
    });
}, 250);

//used for sorting stocks by stock symbol
function compare(a,b){
    if(a.symbol < b.symbol)
        return -1;
    if(a.symbol > b.symbol)
        return 1;
    return 0;
}