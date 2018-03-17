// unicode for UP and DOWN arrows
var unicodeUp = '\u25B2';
var unicodeDown = '\u25BC';

// adding color
unicodeUp = unicodeUp.fontcolor("green");
unicodeDown = unicodeDown.fontcolor("red");

var gainersTable = document.getElementById("gainersTable");
var stockGainersUrl = "https://api.iextrading.com/1.0/stock/market/list/gainers";

setTimeout(function () {
        $.ajax({
            url: stockGainersUrl,
            success: function (data) {
                for(var i = 0; i < data.length; i++) {
                    var row = gainersTable.insertRow(i+1);

                    var symbol = data[i].symbol;
                    cell0 = row.insertCell(0);
                    cell0.innerHTML = symbol.toString();

                    var latestPrice = data[i].latestPrice.toFixed(2);
                    cell1 = row.insertCell(1);
                    cell1.innerHTML = latestPrice.toString();

                    var highPrice = data[i].high.toFixed(2);
                    cell2 = row.insertCell(2);
                    cell2.innerHTML = highPrice.toString();

                    var lowPrice = data[i].low.toFixed(2);
                    cell3 = row.insertCell(3);
                    cell3.innerHTML = lowPrice.toString();
                }

            }
        });
}, 250);


var losersTable = document.getElementById("losersTable");
var stockLoserUrl = "https://api.iextrading.com/1.0/stock/market/list/losers";

setTimeout(function () {
    $.ajax({
        url: stockLoserUrl,
        success: function (data) {
            for(var i = 0; i < data.length; i++) {
                var row = losersTable.insertRow(i+1);

                var symbol = data[i].symbol;
                cell0 = row.insertCell(0);
                cell0.innerHTML = symbol.toString();

                var latestPrice = data[i].latestPrice.toFixed(2);
                cell1 = row.insertCell(1);
                cell1.innerHTML = latestPrice.toString();

                var highPrice = data[i].high.toFixed(2);
                cell2 = row.insertCell(2);
                cell2.innerHTML = highPrice.toString();

                var lowPrice = data[i].low.toFixed(2);
                cell3 = row.insertCell(3);
                cell3.innerHTML = lowPrice.toString();
            }

        }
    });
}, 250);
