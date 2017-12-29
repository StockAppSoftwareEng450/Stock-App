setInterval(function() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/stock/msft/quote",
        success: function(data) {
            console.log(data);
            var response = (data);
            document.getElementById("CompanyNameCard2").innerHTML = response.companyName;
            document.getElementById("StockPriceCard2").innerHTML = response.latestPrice;
            console.log(response.latestPrice);
        }
    });
}, 3000);