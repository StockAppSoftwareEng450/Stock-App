var filteredArrS = [];
var filteredArrP = [];

var count = 0;
var max = null;

function grabPortfolioBarChart(fullPortfolio, percentArray){

    var stockSymbol = [];

    // console.log(stockSymbol);       // AAPL, MSFT
    // console.log(percentArray);      // "300%", "400%"

    // Pushing stock Symbols
    for (var i = 0; i < fullPortfolio.length; i++) {
        stockSymbol.push(fullPortfolio[i].stockSymbol);
    }

    // Removing Duplicates for stock Symbol
    for (var i = 0; i < stockSymbol.length; i++) {
        filteredArrS = duplicates(stockSymbol);
    }

    // Removing Duplicates for percent
    for (var i = 0; i < percentArray.length; i++) {
        filteredArrP = duplicates(percentArray);
    }

    for (var i = 0; i < filteredArrP.length; i++){
        filteredArrP[i] = Number(filteredArrP[i]).toFixed(2);
    }

    // Finding max value then adding padding, then
    max = findMaxValueArr(percentArray);
    var result = ( 10 / max) * 1000;
    max = max + result;

    createBarChart(max);
}



/** removing duplicates **/
function duplicates(array){
    return array.filter(function(val,ind) { return array.indexOf(val) === ind; });
}


/** Finding the Max Value **/
function findMaxValueArr(array) {
    return Math.max.apply(null, array) // 4
}

// @TODO Stop Animation , Display Company Name
function createBarChart(max) {
    // Bar Chart
    ctx = document.getElementById("myBarChart"), myLineChart = new Chart(ctx, {
        type: "bar",
        data: {
            // labels: [stockSymbol[0], "February", "March", "April", "May", "June"],
            labels: filteredArrS,
            datasets: [{
                label: "Percent Change",
                // backgroundColor: "rgba(2,117,216,1)",
                backgroundColor: palette('tol', filteredArrS.length).map(function(hex) {
                    return '#' + hex;
                }),
                borderColor: "rgba(2,117,216,1)",
                // data: [4215, 5312, 6251, 7841, 9821, 14984]
                data: filteredArrP
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [
                    {time: {unit: "month"}, gridLines: {display: !1}, ticks: {maxTicksLimit: 6}}],
                yAxes: [{ticks: {min: 0, max: max, maxTicksLimit: 5}, gridLines: {display: !0}}]
            }, legend: {display: !1},
            animation: {
                duration: 0
            }
        }
    });
}

