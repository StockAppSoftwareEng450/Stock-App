// //
// // // // Fix me
// // //
// // // var symbolArray = [];
// // //
// // // function getPortfolioGrowth(symbol){
// // //
// // //     symbolArray.push(symbol);
// // //     console.log("symbolArray",symbolArray);
// // //
// // // }
// //
// // // var data = [
// // //     { label: "Apple Inc.",
// // //         x: [0, 1, 2, 3, 4],
// // //         y: [0, 101, 202, 303, 404] },
// // //     { label: "Data Set 2",
// // //         x: [0, 1, 2, 3, 4],
// // //         y: [0, 1, 4, 9, 16] }
// // // ];
// //
// // var i = 0;
// //
// // function displayPortfolioGrowthChart() {
// //
// //     // console.log(fullPorfolioArray[0].stockSymbol);
// //
// //     // // Parse incoming data like
// //     // var data = [
// //     //     { label: fullPorfolioArray[0].stockSymbol,
// //     //
// //     //     }
// //     // ];
// //
// //     //@TODO add CurrentEquity to the Label, add Each price change to y entry to the enc, change x values to the date.
// //     //@TODO
// //
// //     // Last is current Label example
// //     // currentEquity = "$" + 200;
// //
// //     // var data = [
// //     //     { label: currentEquity,
// //     //         x: [0, 1, 2, 3, 4, 5,6,7,8,9],
// //     //         y: [0, 101, 202, 303,450,600,300,404, 500, 200] }
// //     // ];
// //
// //     var xy_chart = d3_xy_chart()
// //         .width(960)
// //         .height(500)
// //         .xlabel("X Axis")
// //         .ylabel("Y Axis");
// //     var svg = d3.select("#PortfolioGrowth").append("svg")
// //         .datum(data)
// //         .call(xy_chart);
// //
// //     function d3_xy_chart() {
// //         var width = 640,
// //             height = 480,
// //             xlabel = "X Axis Label",
// //             ylabel = "Y Axis Label";
// //
// //         function chart(selection) {
// //             selection.each(function (datasets) {
// //                 var margin = {
// //                         top: 40,
// //                         right: 40,
// //                         bottom: 0,
// //                         left: 40},
// //                     innerwidth = width - margin.left - margin.right,
// //                     innerheight = height - margin.top - margin.bottom;
// //
// //                 var x_scale = d3.scaleLinear()
// //                     .range([0, innerwidth])
// //                     .domain([d3.min(datasets, function (d) {
// //                         return d3.min(d.x);
// //                     }),
// //                         d3.max(datasets, function (d) {
// //                             return d3.max(d.x);
// //                         })]);
// //
// //                 var y_scale = d3.scaleLinear()
// //                     .range([innerheight, 0])
// //                     .domain([d3.min(datasets, function (d) {
// //                         return d3.min(d.y);
// //                     }),
// //                         d3.max(datasets, function (d) {
// //                             return d3.max(d.y);
// //                         })]);
// //
// //                 // var color_scale = d3.scale.category10()
// //                 //     .domain(d3.range(datasets.length)) ;
// //
// //                 var color_scale = d3.scaleOrdinal(d3.schemeCategory10);
// //
// //                 // var x_axis = d3.svg.axis()
// //                 //     .scale(x_scale)
// //                 //     .orient("bottom") ;
// //
// //                 // var y_axis = d3.svg.axis()
// //                 //     .scale(y_scale)
// //                 //     .orient("left") ;
// //
// //                 var x_axis = d3.axisBottom(x_scale);
// //                 var y_axis = d3.axisLeft(y_scale);
// //
// //                 // var x_grid = d3.svg.axis()
// //                 //     .scale(x_scale)
// //                 //     .orient("bottom")
// //                 //     .tickSize(-innerheight)
// //                 //     .tickFormat("") ;
// //                 //
// //                 // var y_grid = d3.svg.axis()
// //                 //     .scale(y_scale)
// //                 //     .orient("left")
// //                 //     .tickSize(-innerwidth)
// //                 //     .tickFormat("") ;
// //
// //                 var x_grid = d3.axisBottom(x_scale)
// //                     .tickSize(-innerheight)
// //                     .tickFormat("");
// //
// //                 var y_grid = d3.axisLeft(y_scale)
// //                     .tickSize(-innerwidth)
// //                     .tickFormat("");
// //
// //                 // var draw_line = d3.svg.line()
// //                 //     .interpolate("basis")
// //                 //     .x(function(d) { return x_scale(d[0]); })
// //                 //     .y(function(d) { return y_scale(d[1]); }) ;
// //
// //                 var draw_line = d3.line()
// //                     .curve(d3.curveLinear)
// //                     .x(function (d) {
// //                         return x_scale(d[0]);
// //                     })
// //                     .y(function (d) {
// //                         return y_scale(d[1]);
// //                     });
// //
// //                 var svg = d3.select(this)
// //                     // .attr("width", width)
// //                     // .attr("height", height)
// //                     .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " "
// //                         + (height + margin.top + margin.bottom))
// //                     .append("g")
// //                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// //
// //                 svg.append("g")
// //                     .attr("class", "x grid")
// //                     .attr("transform", "translate(0," + innerheight + ")")
// //                     .call(x_grid);
// //
// //                 svg.append("g")
// //                     .attr("class", "y grid")
// //                     .call(y_grid);
// //
// //                 svg.append("g")
// //                     .attr("class", "x axis")
// //                     .attr("transform", "translate(0," + innerheight + ")")
// //                     .call(x_axis)
// //                     .append("text")
// //                     .attr("dy", "-.71em")
// //                     .attr("x", innerwidth)
// //                     .style("text-anchor", "end")
// //                     .text(xlabel);
// //
// //                 svg.append("g")
// //                     .attr("class", "y axis")
// //                     .call(y_axis)
// //                     .append("text")
// //                     .attr("transform", "rotate(-90)")
// //                     .attr("y", 6)
// //                     .attr("dy", "0.71em")
// //                     .style("text-anchor", "end")
// //                     .text(ylabel);
// //
// //                 var data_lines = svg.selectAll(".d3_xy_chart_line")
// //                     .data(datasets.map(function (d) {
// //                         return d3.zip(d.x, d.y);
// //                     }))
// //                     .enter().append("g")
// //                     .attr("class", "d3_xy_chart_line");
// //
// //                 data_lines.append("path")
// //                     .attr("class", "line")
// //                     .attr("d", function (d) {
// //                         return draw_line(d);
// //                     })
// //                     .attr("stroke", function (_, i) {
// //                         return color_scale(i);
// //                     });
// //
// //                 data_lines.append("text")
// //                     .datum(function (d, i) {
// //                         return {name: datasets[i].label, final: d[d.length - 1]};
// //                     })
// //                     .attr("transform", function (d) {
// //                         return ("translate(" + x_scale(d.final[0]) + "," +
// //                             y_scale(d.final[1]) + ")");
// //                     })
// //                     .attr("x", 3)
// //                     .attr("dy", ".35em")
// //                     .attr("fill", function (_, i) {
// //                         return color_scale(i);
// //                     })
// //                     .text(function (d) {
// //                         return d.name;
// //                     });
// //
// //             });
// //         }
// //
// //         chart.width = function (value) {
// //             if (!arguments.length) return width;
// //             width = value;
// //             return chart;
// //         };
// //
// //         chart.height = function (value) {
// //             if (!arguments.length) return height;
// //             height = value;
// //             return chart;
// //         };
// //
// //         chart.xlabel = function (value) {
// //             if (!arguments.length) return xlabel;
// //             xlabel = value;
// //             return chart;
// //         };
// //
// //         chart.ylabel = function (value) {
// //             if (!arguments.length) return ylabel;
// //             ylabel = value;
// //             return chart;
// //         };
// //
// //         return chart;
// //     }
// //
// //     function updateData() {
// //
// //         data.forEach(function (d) {
// //             d.date = parseDate(d.date);
// //             d.close = +d.close;
// //         });
// //
// //         // Scale the range of the data again
// //         x.domain(d3.extent(data, function (d) {
// //             return d.date;
// //         }));
// //         y.domain([0, d3.max(data, function (d) {
// //             return d.close;
// //         })]);
// //
// //         // Select the section we want to apply our changes to
// //         var svg = d3.select("body").transition();
// //
// //         // Make the changes
// //         svg.select(".line")   // change the line
// //             .duration(750)
// //             .attr("d", valueline(data));
// //         svg.select(".x.axis") // change the x axis
// //             .duration(750)
// //             .call(xAxis);
// //         svg.select(".y.axis") // change the y axis
// //             .duration(750)
// //             .call(yAxis);
// //
// //         updateData.push(i);
// //         i += 20;
// //     }
// //
// //     var inter = setInterval(function() {
// //         updateData();
// //     }, 5000);
// // }
// //
// //
//
//
// var stockSymbl = null;
// var setInterLive = null;
// var title = null;
// var yAxisPrice = null;
// var priceTitle = null;
// var currentGraph = "5 Years";
//
// // This variable will hold the setInterval's instance, so we can clear it later on
// var interval;
//
// function check() {
//     if (resultStockSymbol != null) {
//         stockSymbl = resultStockSymbol;
//         // console.log("stockSymbl: " + stockSymbl);
//         clearInterval(interval);
//     }
// }
//
// // Create an instance of the check function interval
// interval = setInterval(check, 1000);
//
// // Set the dimensions of the canvas / graph
// var margin = {
//         top: 30, right: 20, bottom: 30, left: 50},
//     width = 760 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom -20;
//
// // Parse the date / time
// var parseDate = d3.time.format("%Y-%m-%d").parse,
//     bisectDate = d3.bisector(function(d) { return d.date; }).left,
//     formatValue = d3.format(",.2f"),
//     formatCurrency = function(d) { return "$" + formatValue(d);};
//
// // Parse the time for the Day
// var parseMinute = d3.time.format("%H:%M").parse;
//
// // Set the ranges
// var x = d3.time.scale().range([0, width]);
// var y = d3.scale.linear().range([height, 0]);
//
// // Define the axes
// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);
//
// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);
//
//
// // Define the line
// var valueline = d3.svg.line()
// //.interpolate("basis")
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.close); });
//
// // Adds the svg canvas
// var svg = d3.select("#D3LineGraph")
//     .append("svg")
//     // .attr("width", width + margin.left + margin.right )
//     // .attr("height", height + margin.top + margin.bottom + 15 )
//     .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom + 10))
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
//
// // Get the minumum Value from the array to add space at the bottom of the graph
// Array.min = function (array) {
//     return Math.min.apply(Math, array);
// };
//
// setTimeout(function () {
//     var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/chart/5y";
//
//     // Get the data
//     $.ajax({
//         url: url,
//         success: function(data) {
//
//             // Setting global variable
//             var arrayClose = [];
//             var firstPrice = null;
//             var lastPrice = null;
//             var minimum = null;
//             var result = null;
//             var lineColor = null;
//
//             // Get the data
//             d3.json(url, function (error, data) {
//                 data.forEach(function (d) {
//                     d.date = parseDate(d.date);
//                     d.close = +d.close;
//
//                     // Adding each result to the end of the array
//                     arrayClose.push(d.close);
//
//                     // Finding the minimum value in the close price in the JSON File
//                     minimum = Array.min(arrayClose);
//
//                     // Taking .05% off of graph to dynamically show white space at the bottom of the minimum value
//                     result = (10 / 100) * minimum;
//                     result = minimum - result;
//
//                     // Finding first elm in array
//                     firstPrice = arrayClose[0];
//
//                     // Finding last elm in array
//                     lastPrice = arrayClose[arrayClose.length - 1];
//                 });
//
//                 if (firstPrice > lastPrice){
//                     lineColor = "red";
//                 } else {
//                     lineColor = "green";
//                 }
//
//                 // Scale the range of the data
//                 x.domain(d3.extent(data, function (d) {
//                     return d.date;
//                 }));
//                 y.domain([result, d3.max(data, function (d) {
//                     return d.close;
//                 })]);
//
//                 // Add the valueline path.
//                 svg.append("path")
//                     .transition()
//                     .attr("class", "line")
//                     .attr("stroke", lineColor)
//                     .style("font-size", "12px")
//                     .attr("d", valueline(data));
//
//                 // Add the X Axis
//                 svg.append("g")
//                     .attr("class", "axis")
//                     .attr("class", "x axis")
//                     .attr("transform", "translate(0," + height + ")")
//                     .style("font-size", "12px")
//                     .call(xAxis);
//
//                 // Add the Y Axis
//                 yAxisPrice = svg.append("g")
//                     .attr("class", "axis")
//                     .attr("class", "y axis")
//                     .style("font-size", "12px")
//                     .call(yAxis);
//
//                 // Add the text label for the X axis
//                 svg.append("text")
//                     .style("font-size", "12px")
//                     .attr("x", width / 2)               //Dynamically moves with the graph
//                     .attr("y", height + margin.bottom + 10)
//                     .style("text-anchor", "middle")
//                     .text("Date");
//
//                 // Add the text label for the Y axis
//                 priceTitle = svg.append("text")
//                     .style("font-size", "12px")
//                     .attr("transform", "rotate(-90)")
//                     .attr("x", 0 - (height / 2))
//                     .attr("y", 0 - margin.left + 3)
//                     .attr("dy", "1em")
//                     .style("text-anchor", "middle")
//                     .text("Price");
//
//                 // Adding the Title
//                 title = svg.append("text")
//                     .attr("x", (width / 2))
//                     .attr("y", 0 - (margin.top / 2))
//                     .attr("text-anchor", "middle")
//                     .style("font-size", "12px")
//                     .style("text-decoration", "underline")
//                     // .text("Price to Date");
//                     .text(currentGraph);
//
//                 //Mouseover
//                 var focus = svg.append("g")
//                     .attr("class", "focus")
//                     .style("display", "none");
//
//                 focus.append("line")
//                     .attr("class", "x-hover-line hover-line")
//                     .attr("y1", 0)
//                     .attr("y2", height);
//
//                 focus.append("line")
//                     .attr("class", "y-hover-line hover-line")
//                     .attr("x1", width)
//                     .attr("x2", width);
//
//                 focus.append("circle")
//                     .attr("r", 4.5);
//
//                 focus.append("text")
//                     .attr("x", 9)
//                     .attr("dy", ".35em");
//
//                 svg.append("rect")
//                     .attr("class", "overlay")
//                     .attr("width", width)
//                     .attr("height", height)
//                     .on("mouseover", function() { focus.style("display", null); })
//                     .on("mouseout", function() { focus.style("display", "none"); })
//                     .on("mousemove", mousemove);
//
//                 function mousemove() {
//                     var x0 = x.invert(d3.mouse(this)[0]),
//                         i = bisectDate(data, x0, 1),
//                         d0 = data[i - 1],
//                         d1 = data[i];
//
//                     // console.log("first: " + x0 - d0.date);
//                     // console.log("second: " + d1.date - x0 ? d1 : d0);
//                     // console.log("combination: " + x0 - d0.date > d1.date - x0 ? d1 : d0);
//
//                     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//                     focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
//                     focus.select(".x-hover-line").attr("y2", height - y(d.close));
//                     focus.select(".y-hover-line").attr("x2", width + width);
//                     document.getElementById("close").innerHTML = "$" + d.close;
//
//                     // Date
//                     var newDate = d.date.toString();
//                     document.getElementById("date").innerHTML = newDate.slice(0,15);
//                 }
//             });
//         }
//     });
//
// }, 2000);
//
// // Updating Price, lineColor, data, and result
// function updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, data, result, currentGraph) {
//     // Checks to see if the first price is lower than the last price if = change color
//     if (firstPrice > lastPrice){
//         lineColor = "red";
//     } else {
//         lineColor = "green";
//     }
//
//     // Scale the range of the data again
//     x.domain(d3.extent(data, function(d) {
//         return d.date;
//     }));
//     y.domain([result, d3.max(data, function(d) {
//         return d.close;
//     })]);
//
//     // Select the section we want to apply our changes to
//     var svg = d3.select("body").transition();
//
//     // Make the changes
//     svg.select(".line")   // change the line
//         .transition()
//         .duration(750)
//         .attr("stroke", lineColor)
//         .attr("d", valueline(data));
//     svg.select(".x.axis") // change the x axis
//         .duration(750)
//         .call(xAxis);
//     svg.select(".y.axis") // change the y axis
//         .duration(750)
//         .call(yAxis);
//
//     // Adding the Title
//     title.text(function(d) {
//         return currentGraph
//     });
//
//     if (currentGraph === "Live"){
//         priceTitle.style("font-size", "9px");
//         yAxisPrice.style("font-size", "9px");
//     } else {
//         // Changing back font sizes
//         priceTitle.style("font-size", "12px");
//         yAxisPrice.style("font-size", "11px");
//     }
// }
//
// /** Live Button **/
// function updateLiveButton () {
//
//     var count = 0;
//
//     var objectPrice = [];
//     var objectInner = {};
//
//     objectInner.date = null;
//     objectInner.close = null;
//
//     var arrayClose = [];
//     var minimum = null;
//     var result = null;
//     var firstPrice = null;
//     var lastPrice = null;
//     var lineColor = null;
//     var currPrice = null;
//     var currDate = null;
//
//     currentGraph = "Live";
//
//     var url = "https://api.iextrading.com/1.0/stock/" + stockSymbl + "/price";
//
//     // Every two seconds grabs price and sends that to the
//     setInterLive = setInterval(function () {
//         $.ajax({
//             url: url,
//             success: function(data) {
//
//                 // Mon Jan 22 2018 00:00:00 GMT-0500
//                 currDate = new Date();
//                 currPrice = data;
//
//                 objectInner.date = currDate;
//                 objectInner.close = currPrice;
//
//                 objectPrice.push(jQuery.extend(true, {}, objectInner));
//
//                 if (count > 1){
//                     objectPrice.forEach(function (ele) {
//                         // console.log(d);
//
//                         // Adding each result to the end of the array
//                         arrayClose.push(ele.close);
//
//                         // Finding the minimum value in the close price in the JSON File
//                         minimum = Array.min(arrayClose);
//                         console.log("minimum: " + minimum);
//
//                         // Taking 5% off of graph to dynamically show white space at the bottom of the minimum value
//                         result = (.05 / 100) * minimum;
//                         result = minimum - result;
//
//                         // Finding first elm in array
//                         firstPrice = arrayClose[0];
//
//                         // Finding last elm in array
//                         lastPrice = arrayClose[arrayClose.length - 1];
//                     });
//                 }
//
//                 count++;
//
//                 if (count > 1) {
//                     console.log("reached 10!");
//
//                     // Updating Price, lineColor, data, and result
//                     updatePriceAxisAndMore(firstPrice,lastPrice,lineColor, objectPrice, result, currentGraph);
//                 }
//
//             }
//         });
//     }, 2000);
// }
//
//
// Date.prototype.yyyymmdd = function() {
//     var mm = this.getMonth() + 1; // getMonth() is zero-based
//     var dd = this.getDate();
//
//     return [this.getFullYear(),
//         (mm>9 ? '' : '0') + mm,
//         (dd>9 ? '' : '0') + dd
//     ].join('');
// };

$( document ).ready(function() {


});


// @TODO Get Date, Get Portfolio
function getOneDayPrice(fullPortfolio) {


    if (fullPortfolio.length < 1) {

        console.log("more than one in portfolio");

        for (var i = 0; i < fullPortfolio.length; i++){

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
