var stockSymbl = null;
var setInterLive = null;
var title = null;
var yAxisPrice = null;
var priceTitle = null;
var currentGraph = "5 Years";

// This variable will hold the setInterval's instance, so we can clear it later on
var interval;

function check() {
    if (resultStockSymbol != null) {
        stockSymbl = resultStockSymbol;
        // console.log("stockSymbl: " + stockSymbl);
        clearInterval(interval);
    }
}

// Create an instance of the check function interval
interval = setInterval(check, 1000);

// Set the dimensions of the canvas / graph
var margin = {
    top: 30, right: 20, bottom: 30, left: 50},
    width = 760 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom -20;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return "$" + formatValue(d);};

// Parse the time for the Day
var parseMinute = d3.time.format("%H:%M").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);


// Define the line
var valueline = d3.svg.line()
//.interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// Adds the svg canvas
var svg = d3.select("#D3LineGraph")
    .append("svg")
    // .attr("width", width + margin.left + margin.right )
    // .attr("height", height + margin.top + margin.bottom + 15 )
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom + 10))
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the minumum Value from the array to add space at the bottom of the graph
Array.min = function (array) {
    return Math.min.apply(Math, array);
};

setTimeout(function () {
    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/5y";

    // Get the data
    $.ajax({
        url: url,
        success: function(data) {

            // Setting global variable
            var arrayClose = [];
            var firstPrice = null;
            var lastPrice = null;
            var minimum = null;
            var result = null;
            var lineColor = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (10 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                if (firstPrice > lastPrice){
                    lineColor = "red";
                } else {
                    lineColor = "green";
                }

                // Scale the range of the data
                x.domain(d3.extent(data, function (d) {
                    return d.date;
                }));
                y.domain([result, d3.max(data, function (d) {
                    return d.close;
                })]);

                // Add the valueline path.
                svg.append("path")
                    .transition()
                    .attr("class", "line")
                    .attr("stroke", lineColor)
                    .style("font-size", "12px")
                    .attr("d", valueline(data));

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

                //Mouseover
                var focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("line")
                    .attr("class", "x-hover-line hover-line")
                    .attr("y1", 0)
                    .attr("y2", height);

                focus.append("line")
                    .attr("class", "y-hover-line hover-line")
                    .attr("x1", width)
                    .attr("x2", width);

                focus.append("circle")
                    .attr("r", 4.5);

                focus.append("text")
                    .attr("x", 9)
                    .attr("dy", ".35em");

                svg.append("rect")
                    .attr("class", "overlay")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mouseover", function() { focus.style("display", null); })
                    .on("mouseout", function() { focus.style("display", "none"); })
                    .on("mousemove", mousemove);

                function mousemove() {
                    var x0 = x.invert(d3.mouse(this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i];

                        // console.log("first: " + x0 - d0.date);
                        // console.log("second: " + d1.date - x0 ? d1 : d0);
                        // console.log("combination: " + x0 - d0.date > d1.date - x0 ? d1 : d0);

                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
                    focus.select(".x-hover-line").attr("y2", height - y(d.close));
                    focus.select(".y-hover-line").attr("x2", width + width);
                    document.getElementById("close").innerHTML = "$" + d.close;

                    // Date
                    var newDate = d.date.toString();
                    document.getElementById("date").innerHTML = newDate.slice(0,15);

                }
            });
        }
    });

}, 2000);

// Updating Price, lineColor, data, and result
function updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph) {
    // Checks to see if the first price is lower than the last price if = change color
    if (firstPrice > lastPrice){
        lineColor = "red";
    } else {
        lineColor = "green";
    }

    // Scale the range of the data again
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([result, d3.max(data, function(d) {
        return d.close;
    })]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg.select(".line")   // change the line
        .transition()
        .duration(750)
        .attr("stroke", lineColor)
        .attr("d", valueline(data));
    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);

    // Adding the Title
    title.text(function(d) {
        return currentGraph
    });

    if (currentGraph === "Live"){
        priceTitle.style("font-size", "9px");
        yAxisPrice.style("font-size", "9px");
    } else {
        // Changing back font sizes
        priceTitle.style("font-size", "12px");
        yAxisPrice.style("font-size", "11px");
    }



}

/** Live Button **/
function updateLiveButton () {

    var count = 0;

    var objectPrice = [];
    var objectInner = {};

    objectInner.date = null;
    objectInner.close = null;

    var arrayClose = [];
    var minimum = null;
    var result = null;
    var firstPrice = null;
    var lastPrice = null;
    var lineColor = null;
    var currPrice = null;
    var currDate = null;

    currentGraph = "Live";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/price";

    // Every two seconds grabs price and sends that to the
    setInterLive = setInterval(function () {
        $.ajax({
            url: url,
            success: function(data) {

                // Mon Jan 22 2018 00:00:00 GMT-0500
                currDate = new Date();
                currPrice = data;

                objectInner.date = currDate;
                objectInner.close = currPrice;

                objectPrice.push(jQuery.extend(true, {}, objectInner));

                if (count > 1){
                    objectPrice.forEach(function (ele) {
                        // console.log(d);

                        // Adding each result to the end of the array
                        arrayClose.push(ele.close);

                        // Finding the minimum value in the close price in the JSON File
                        minimum = Array.min(arrayClose);
                        console.log("minimum: " + minimum);

                        // Taking 5% off of graph to dynamically show white space at the bottom of the minimum value
                        result = (.05 / 100) * minimum;
                        result = minimum - result;

                        // Finding first elm in array
                        firstPrice = arrayClose[0];

                        // Finding last elm in array
                        lastPrice = arrayClose[arrayClose.length - 1];
                    });
                }

                count++;

                if (count > 1) {
                    console.log("reached 10!");

                    // Updating Price, lineColor, data, and result
                    updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, objectPrice, result, currentGraph);
                }

            }
        });
    }, 2000);
}

//1d
function update1Day () {

    // Breaking forEach for faster break of loop to transfer to 1Month
    var BreakException = {};

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "1 Day";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/1d";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                try {
                    data.forEach(function (d) {

                        // Parsing the minute instead of conventional date
                        d.date = parseMinute(d.minute);
                        d.close = +d.average;

                        // Adding each result to the end of the array
                        arrayClose.push(d.close);

                        // Finding the minimum value in the close price in the JSON File
                        minimum = Array.min(arrayClose);

                        // Handle faulty API call
                        if (minimum === 0) throw BreakException;

                        // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                        result = (.05 / 100) * minimum;
                        result = minimum - result;

                        // Finding first elm in array
                        firstPrice = arrayClose[0];

                        // Finding last elm in array
                        lastPrice = arrayClose[arrayClose.length - 1];
                    });

                    // Updating Price, lineColor, data, and result
                    updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);

                } catch (e) {
                    if (e !== BreakException) throw e;

                    // Transferring to 1Month
                    update1Month();
                }

            });
        }
    });
}

//1m
function update1Month () {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "1 Month";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/1m";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    // console.log(d.date);
                    // d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking 5% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (.25 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}

//3m
function update3Month() {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "3 Month";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/3m";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (.05 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}

//6m
function update6Month () {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "6 Month";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/6m";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (.5 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}


// ytd
function updateYearToDate () {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "Year to Date";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/ytd";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (.1 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}

// Update to 1 yEar
function update1Year() {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "1 Year";

    var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/1y";

    $.ajax({
        url: url,
        success: function(data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (1 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}

// Change graph to 2 year
function update2Year() {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "2 Years";

    var url = "https://api.iextrading.com/1.0/stock/"  + stockSymbl + "/chart/2y";

    $.ajax({
        url: url,
        success: function (data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {
                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (5 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}

// Change graph to 5 Year
function update5Year() {

    // Clearing Live button
    clearInterval(setInterLive);

    currentGraph = "5 Years";

    var url = "https://api.iextrading.com/1.0/stock/"  + stockSymbl + "/chart/5y";

    $.ajax({
        url: url,
        success: function (data) {

            var arrayClose = [];
            var minimum = null;
            var result = null;
            var lineColor = null;
            var firstPrice = null;
            var lastPrice = null;

            // Get the data
            d3.json(url, function (error, data) {
                data.forEach(function (d) {

                    d.date = parseDate(d.date);
                    d.close = +d.close;

                    // Adding each result to the end of the array
                    arrayClose.push(d.close);

                    // Finding the minimum value in the close price in the JSON File
                    minimum = Array.min(arrayClose);

                    // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
                    result = (10 / 100) * minimum;
                    result = minimum - result;

                    // Finding first elm in array
                    firstPrice = arrayClose[0];

                    // Finding last elm in array
                    lastPrice = arrayClose[arrayClose.length - 1];
                });

                // Updating Price, lineColor, data, and result
                updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph);
            });
        }
    });
}


Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('');
};
