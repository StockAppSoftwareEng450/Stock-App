var filteredArrS = [];
var filteredArrP = [];
var colors = [];

var count = 0;
var max = null;
var min = null;

function grabPortfolioBarChart(fullPortfolio, cpArray){
    // Pushing stock Symbols
    for (var i = 0; i < fullPortfolio.length; i++) {
        filteredArrS.push(fullPortfolio[i].stockSymbol);
        var price = Number(fullPortfolio[i].price);

        var j = 1;
        while(fullPortfolio[i+1]!==undefined && fullPortfolio[i].stockSymbol === fullPortfolio[i+1].stockSymbol){
            price = Number(price)+Number(fullPortfolio[i+1].price);
            i++;
            j++;
        }
        let percent = ((((cpArray[i]*j)-price) / price) * 100).toFixed(2);

        filteredArrP.push(percent);
    }

    // Finding max value then adding padding, then
    max = findMaxValueArr(filteredArrP);
    min = findMinValueArr(filteredArrP);

    if (filteredArrP.every(positiveCheck) === true){
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
    var ctx = document.getElementById("myBarChart");
    var myLineChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: filteredArrS,
            datasets: [{
                label: "Percent Change",
                backgroundColor: palette('sequential', filteredArrS.length).map(function (hex) {
                    colors.push('#' + hex);
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

