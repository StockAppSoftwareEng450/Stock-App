setInterval(function() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/stock/extr/quote",
        success: function(data) {
            console.log(data);
            var response = (data);
            document.getElementById("CompanyName").innerHTML = response.companyName;
            document.getElementById("StockPrice").innerHTML = response.latestPrice;
            console.log(response.latestPrice);
        }
    });
}, 3000);