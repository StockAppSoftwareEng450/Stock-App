setInterval(function() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/stock/TSLA/quote",
        success: function(data) {
            console.log(data);
            var response = (data);
            document.getElementById("CompanyNameCard3").innerHTML = response.companyName;
            document.getElementById("StockPriceCard3").innerHTML = response.latestPrice;
            console.log(response.latestPrice);
        }
    });
}, 3000);