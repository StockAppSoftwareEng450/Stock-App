// @TODO Get Date, Get Portfolio
function getOneDayPrice(fullPortfolio) {
    if (fullPortfolio.length < 1) {

        console.log("more than one in portfolio");

        for (var i = 0; i < fullPortfolio.length; i++) {

            var url = "https://api.iextrading.com/1.0/stock/" + fullPortfolio[i].stockSymbol + "/chart/date/20180129";

            $.ajax({
                url: url,
                success: function (data) {
                    console.log(data);
                }
            });
        }
    } else {
        console.log("Less than one in portfolio");

        var urle = "https://api.iextrading.com/1.0/stock/" + fullPortfolio[0].stockSymbol + "/chart/date/20180129";

        $.ajax({
            url: urle,
            success: function (data) {
                console.log(data);
            }
        });
    }
}

function setPortfolioEquityBarGraph(fullPortfolio) {
    var stockSymbols = "";
    var equityArr = [];

    for (var i = 0; i < fullPortfolio.length; i++) {
        stockSymbols += fullPortfolio[i].stockSymbol + ",";
    }

    var url = "https://api.iextrading.com/1.0//stock/market/batch?symbols=" + stockSymbols + "&types=chart&range=1m";


    $.ajax({
        url: url,
        success: function (data) {

            for (var i = 0; i < fullPortfolio.length; i++) {
                for (var j = data[fullPortfolio[i].stockSymbol].chart.length - 7; j < data[fullPortfolio[i].stockSymbol].chart.length; j++) {

                    var equity = fullPortfolio[i].quantity * data[fullPortfolio[i].stockSymbol].chart[j].close;

                    if (equityArr[data[fullPortfolio[i].stockSymbol].chart[j].date] === undefined) {
                        equityArr[data[fullPortfolio[i].stockSymbol].chart[j].date] = equity;
                    } else {
                        equityArr[data[fullPortfolio[i].stockSymbol].chart[j].date] += equity;
                    }

                }
            }

            // Parse the date / time
            var parseDate = d3.timeParse("%Y-%m-%d"),
                bisectDate = d3.bisector(function (d) {
                    return d.date;
                }).left,
                formatValue = d3.format(",.2f"),
                formatCurrency = function (d) {
                    return currencySymbole + " " + formatValue(d);
                };

            var equityData = [];
            var minEquity = equityArr[Object.keys(equityArr)[0]];

            for (var item in equityArr) {
                var help = {
                    date: parseDate(item),
                    equity: equityArr[item]
                };

                if(minEquity > equityArr[item]){
                    minEquity = equityArr[item];
                }

                equityData.push(help);
            }
            console.log(equityData);


            var title = null;
            var yAxisPrice = null;
            var priceTitle = null;
            var currentGraph = "";

            // Set the dimensions of the canvas / graph
            var margin = {
                    top: 30, right: 20, bottom: 30, left: 80
                },
                width = 760 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom - 20;

            // Parse the time for the Day
            var parseMinute =
                d3.timeFormat("%H:%M").parse;

            // Set the ranges
            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

            // Define the axes
            var xAxis = d3.axisBottom(x)
                .ticks(7);

            var yAxis = d3.axisLeft(y)
                .ticks(7);

            // Define the line
            var valueline = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.equity);
                });

            // Adds the svg canvas
            var svg = d3.select("#PortfolioGrowth")
                .append("svg")
                // .attr("width", width + margin.left + margin.right )
                // .attr("height", height + margin.top + margin.bottom + 15 )
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom + 10))
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var firstPrice = null;
            var lastPrice = null;
            var result = null;
            var minimum = null;
            var lineColor = null;

            // Finding first elm in array
            firstPrice = equityData[0].equity;

            // Finding last elm in array
            lastPrice = equityData[equityData.length - 1].equity;

            if (firstPrice > lastPrice) {
                lineColor = "red";
            } else {
                lineColor = "green";
            }

            // Scale the range of the data
            x.domain(d3.extent(equityData, function (d) {
                return d.date;
            }));
            y.domain([minEquity, d3.max(equityData, function (d) {
                return d.equity;
            })]);

            // Add the valueline path.
            svg.append("path")
                .transition()
                .attr("class", "line")
                .attr("stroke", lineColor)
                .style("font-size", "12px")
                .attr("d", valueline(equityData));

            // Add the X Axis
            svg.append("g")
                .attr("class", "axis")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .style("font-size", "12px")
                .call(xAxis);

            // Add the Y Axis
            yAxisPrice = svg.append("g")
                .attr("class", "axis")
                .attr("class", "y axis")
                .style("font-size", "12px")
                .call(yAxis);

            // Add the text label for the X axis
            svg.append("text")
                .style("font-size", "12px")
                .attr("x", width / 2)               //Dynamically moves with the graph
                .attr("y", height + margin.bottom + 10)
                .style("text-anchor", "middle")
                .text("Date");

            // Add the text label for the Y axis
            priceTitle = svg.append("text")
                .style("font-size", "12px")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - (height / 2))
                .attr("y", 0 - margin.left + 3)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Price");

            // Adding the Title
            title = svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("text-decoration", "underline")
                // .text("Price to Date");
                .text(currentGraph);
        }
    });
}
