var filteredArrS = [];
var filteredArrP = [];

var count = 0;
var max = null;
var min = null;

function grabPortfolioBarChart(fullPortfolio, percentArray){

    var stockSymbol = [];

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

    // Rounding to the nearest 100th for each element
    for (var i = 0; i < filteredArrP.length; i++){
        filteredArrP[i] = Number(filteredArrP[i]).toFixed(2);
    }

    // Finding max value then adding padding, then
    max = findMaxValueArr(percentArray);
    min = findMinValueArr(percentArray);

    if (percentArray.every(positiveCheck) === true){
        min = 0;
    }

    // adding padding
    // max = max * (1 + 0.05);
    // min = min * (1 + 0.05);

    createBarChart(max, min);

}

function positiveCheck(num) {
    return num >= 0;
}

/** removing duplicates **/
function duplicates(array){
    return array.filter(function(val,ind) {
        return array.indexOf(val) === ind;
    });
}

/** Finding the Max Value **/
function findMaxValueArr(array) {
    return Math.max.apply(null, array) // 4
}

/** Finding the Min Value **/
function findMinValueArr(array) {
    return Math.min.apply(null, array) // 4
}

// @TODO Stop Animation , Display Company Name
function createBarChart(max, min) {
    // Bar Chart
    ctx = document.getElementById("myBarChart"), myLineChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: filteredArrS,
            datasets: [{
                label: "Percent Change",
                backgroundColor: palette('tol', filteredArrS.length).map(function (hex) {
                    return '#' + hex;
                }),
                borderColor: "rgba(2,117,216,1)",
                data: filteredArrP
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    time: {
                        unit: "month"},
                    gridLines: {
                        display: !1},
                    ticks: {
                        maxTicksLimit: 12}
                }],
                yAxes: [{
                    ticks: {
                        min: min,
                        max: max,
                        maxTicksLimit: 5},
                    gridLines: {
                        display: !0}
                }]
            },
            legend: {
                display: !1},
            animation: {
                duration: 0
            }
        }
    });
}

