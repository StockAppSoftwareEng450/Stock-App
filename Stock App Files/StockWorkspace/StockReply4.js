setInterval(function() {
    $.ajax({
        url: "https://api.iextrading.com/1.0/stock/VNOM/quote",
        success: function(data) {
            console.log(data);
            var response = (data);
            document.getElementById("CompanyNameCard4").innerHTML = response.companyName;
            document.getElementById("StockPriceCard4").innerHTML = response.latestPrice;
            console.log(response.latestPrice);
        }
    });
}, 3000);