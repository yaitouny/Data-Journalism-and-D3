// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 700;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100,
};

// Define dimensions of the chart area
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import data from an external CSV file
// d3.csv("assets/data/data.csv")
//   .then(function (data) {
//     console.log(data);
// });

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenXAxis]) * 0.8,
      d3.max(data, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenYAxis]) * 0.8,
      d3.max(data, (d) => d[chosenYAxis]) * 1.2,
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(2000).call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition().duration(2000).call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(2000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(2000)
    .attr("cy", (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateToolTipCircle(chosenXAxis, chosenYAxis, circlesGroup) {
  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty (%)";
  } else if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  } else {
    xlabel = "Household Income (Median)";
  }

  var ylabel;

  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare (%)";
  } else if (chosenYAxis === "smokes") {
    ylabel = "Smokes (%)";
  } else {
    ylabel = "Obesity (%)";
  }

  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(function (d) {
      return `${d.state}<br>${xlabel}: ${d[chosenXAxis]}%<br>${ylabel}: ${d[chosenYAxis]}%`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data);
      d3.select(this).transition().duration(200);
      // .attr("fill", "purple")
    })
    .on("mouseout", function (data) {
      toolTip.hide(data);
      // d3.select(this).attr("fill", "teal");
    });

  return circlesGroup;
}

// new functions for rendering text
function renderXText(textGroup, newXScale, chosenXAxis) {
  textGroup
    .transition()
    .duration(2000)
    .attr("dx", (d) => newXScale(d[chosenXAxis]));

  return textGroup;
}

function renderYText(textGroup, newYScale, chosenYAxis) {
  textGroup
    .transition()
    .duration(2000)
    .attr("dy", (d) => newYScale(d[chosenYAxis]));

  return textGroup;
}

function updateToolTipText(chosenXAxis, chosenYAxis, textGroup) {
  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty (%)";
  } else if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  } else {
    xlabel = "Household Income (Median)";
  }

  var ylabel;

  if (chosenYAxis === "healthcare") {
    ylabel = "Lacks Healthcare (%)";
  } else if (chosenYAxis === "smokes") {
    ylabel = "Smokes (%)";
  } else {
    ylabel = "Obesity (%)";
  }

  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    // .offset([90, 90])
    .html(function (d) {
      return `${d.state}<br>${xlabel}: ${d[chosenXAxis]}%<br>${ylabel}: ${d[chosenYAxis]}%`;
    });

  textGroup.call(toolTip);

  textGroup
    .on("mouseover", function (data) {
      toolTip.show(data, this);

      d3.select(this)
        .transition()
        .duration(200)
        // .attr("fill", "purple")
        .attr("cursor", "default")
        .attr("r", "35");
    })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  return textGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (tdata, err) {
  if (err) throw err;

  console.log(tdata);

  // parse data
  tdata.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(tdata, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(tdata, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup
    .append("g")
    // .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g").call(leftAxis);

  var overallPoints = chartGroup.selectAll("circle").data(tdata).enter();

  // append initial circles
  var circlesGroup = overallPoints
    // .selectAll("circle")
    // .data(tdata)
    // .enter()
    .append("circle")
    .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
    .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "teal")
    .style("stroke", "black")
    .attr("opacity", "0.7");

  var textGroup = overallPoints
    // .selectAll("circle")
    // .data(tdata)
    // .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("dx", (d) => xLinearScale(d[chosenXAxis]))
    .attr("dy", (d) => yLinearScale(d[chosenYAxis]))
    .style("font-size", "10px")
    // .style("text-align", "center")
    .attr("fill", "#fff")
    .attr("class", "stateText");

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .attr("class", "aText")
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Household Income (Median)");

  // append y axis
  var ylabelsGroup = chartGroup.append("g").attr("transform", "rotate(-90)");

  var healthcareLabel = ylabelsGroup
    .append("text")
    .attr("y", 20 - chartMargin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .attr("class", "aText")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup
    .append("text")
    .attr("y", 40 - chartMargin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "smokes")
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = ylabelsGroup
    .append("text")
    .attr("y", 60 - chartMargin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("value", "obesity")
    .attr("class", "aText")
    .classed("inactive", true)
    .text("Obesity (%)");

  circlesGroup = updateToolTipCircle(chosenXAxis, chosenYAxis, circlesGroup);
  // textGroup
  textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);

  xlabelsGroup.selectAll("text").on("click", function () {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      // replaces chosenXAxis with value
      chosenXAxis = value;

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(tdata, chosenXAxis);

      // updates x axis with transition
      xAxis = renderXAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

      // update text with new x values
      textGroup = renderXText(textGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTipCircle(
        chosenXAxis,
        chosenYAxis,
        circlesGroup
      );
      textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);
      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel.classed("active", true).classed("inactive", false);
        ageLabel.classed("active", false).classed("inactive", true);
        incomeLabel.classed("active", false).classed("inactive", true);
      } else if (chosenXAxis === "age") {
        povertyLabel.classed("active", false).classed("inactive", true);
        ageLabel.classed("active", true).classed("inactive", false);
        incomeLabel.classed("active", false).classed("inactive", true);
      } else {
        povertyLabel.classed("active", false).classed("inactive", true);
        ageLabel.classed("active", false).classed("inactive", true);
        incomeLabel.classed("active", true).classed("inactive", false);
      }
    }
  });

  // y axis labels event listener
  ylabelsGroup.selectAll("text").on("click", function () {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      // replaces chosenYAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(tdata, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      textGroup = renderYText(textGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTipCircle(
        chosenXAxis,
        chosenYAxis,
        circlesGroup
      );
      textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
        healthcareLabel.classed("active", true).classed("inactive", false);
        smokesLabel.classed("active", false).classed("inactive", true);
        obesityLabel.classed("active", false).classed("inactive", true);
      } else if (chosenYAxis === "smokes") {
        healthcareLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", true).classed("inactive", false);
        obesityLabel.classed("active", false).classed("inactive", true);
      } else {
        healthcareLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", false).classed("inactive", true);
        obesityLabel.classed("active", true).classed("inactive", false);
      }
    }
  });
});
