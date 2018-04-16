function donutChart() {
    var width,
        height,
        margin = {top: 30, right: 30, bottom: 30, left: 30},
        // colour = d3.scaleOrdinal(d3.schemeCategory10),
        variable,                           // value in data that will dictate proportions on chart
        category,                           // compare data by
        padAngle,                           // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        intFormat = d3.format('r'),
        cornerRadius,                       // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.2%');

    // scaling to SbAdmins Color Scheme
    var color = d3.scaleOrdinal(colors);

    function chart(selection){
        selection.each(function(data) {
            // generate chart
            var radius = Math.min(width, height) / 2;

            // default values for legend
            var legendRectSize = 24;
            var legendSpacing = 6;
            var fontsize = 16;

            // Scaling higher
            legendRectSize += (70 / 100) * legendRectSize;
            legendSpacing += (70 / 100) * legendSpacing;
            fontsize += (70 / 100) * fontsize;

            // creates a new pie generator
            var pie = d3.pie()
                .value(function(d) { return intFormat(d[variable]); })
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // this arc is used for aligning the text labels
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);

            // append the svg object to the selection
            var svg = selection.append('svg')
                // .attr('width', width + margin.left + margin.right)
                // .attr('height', height + margin.top + margin.bottom)
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " "
                    + (height + margin.top + margin.bottom))
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');
            svg.append("g").attr("class", "labelValue");

            // add and color the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
                .enter().append('path')
                // .attr('fill', function(d) { return colour(d.data[category]); })
                .attr('fill', function(d, i) {
                    return color(d.data[category]);
                })
                .attr('d', arc);

            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);

            console.log("number of stocks: " + data.length);

            // if length is greater than 8 scale highest possible
            if ( data.length > 10) {
                console.log('reached');

                var decrAmount = (data.length * 1.5);

                legendRectSize -= (decrAmount / 100) * legendRectSize;
                legendSpacing -= (decrAmount / 100) * legendSpacing;
                fontsize -= (decrAmount / 100) * fontsize;

                console.log(legendRectSize);
                console.log(legendSpacing);
                console.log(fontsize);
            }

            // Adding legend
            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function(d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset =  height * color.domain().length / 2;
                    var horz = -2 * legendRectSize;
                    var vert = i * height - offset;
                    console.log(i);
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color);

            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .style("font-size", (fontsize.toString() + "px"))
                .text(function(d) {
                    return d;
                });

            // calculates the angle for the middle of a slice
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data) {

                    // removing legend on mouseover
                    d3.selectAll('.legend').remove();

                    svg.append('text')
                        .attr('class', 'toolCircle')
                        .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                        .html(toolTipHTML(data)) // add text to the circle.
                        .style('font-size', '3em')
                        .style('text-anchor', 'middle'); // centres text in tooltip

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.55) // radius of tooltip circle
                        .style('fill', color(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.65);

                });

                // remove the tooltip when mouse leaves the slice/label
                selection.on('mouseout', function () {
                    d3.selectAll('.toolCircle').remove();

                    // default values for legend
                    var legendRectSize = 24;
                    var legendSpacing = 6;
                    var fontsize = 16;

                    // Scaling higher
                    legendRectSize += (70 / 100) * legendRectSize;
                    legendSpacing += (70 / 100) * legendSpacing;
                    fontsize += (70 / 100) * fontsize;

                    // if length is greater than 8 scale highest possible
                    if ( data.length > 10) {
                        console.log('reached');

                        var decrAmount = (data.length * 1.5);

                        legendRectSize -= (decrAmount / 100) * legendRectSize;
                        legendSpacing -= (decrAmount / 100) * legendSpacing;
                        fontsize -= (decrAmount / 100) * fontsize;

                        console.log(legendRectSize);
                        console.log(legendSpacing);
                        console.log(fontsize);
                    }

                    var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                            var height = legendRectSize + legendSpacing;
                            var offset =  height * color.domain().length / 2;
                            var horz = -2 * legendRectSize;
                            var vert = i * height - offset;
                            count = i;

                            return 'translate(' + horz + ',' + vert + ')';
                        });

                    console.log("count: " + (count + 1));

                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);

                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .style("font-size", (fontsize.toString() + "px"))
                        .text(function(d) { return d; });

                });
            }

            // function to create the HTML string for the tool tip. Loops through each key in data object
            function toolTipHTML(data) {

                var tip = '',
                    i   = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseInt(data.data[key]))) ? intFormat(data.data[key]) : data.data[key];

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                    i++;
                }

                return tip;
            }

        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}