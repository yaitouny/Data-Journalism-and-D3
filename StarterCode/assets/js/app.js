// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
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
    .range([0, width]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisBottom(newYScale);

  yAxis.transition().duration(1000).call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cy", (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "In Poverty (%)";
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
    ylabel = "Obese (%)";
  }

  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return `${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data);

      d3.select(this)
        .transition()
        .duration(1000)
        .attr("fill", "pink")
        .attr("r", "35");
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);

      d3.select(this)
        .transition()
        .duration(1000)
        .attr("fill", "#89bdd3")
        .attr("r", "20");
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv")
  .then(function (tdata, err) {
    if (err) throw err;

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
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g").call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(tdata)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d.chosenYAxis))
      .attr("r", 20)
      .attr("fill", "pink")
      .attr("opacity", ".5");

    // Create group for two x-axis labels
    var xlabelsGroup = chartGroup
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true);
    // .text("Hair Metal Ban Hair Length (inches)");

    var ageLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true);
    // .text("# of Albums Released");

    var incomeLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true);
    // .text("# of Albums Released");

    // append y axis
    var ylabelsGroup = chartGroup
      .append("text")
      .attr("transform", "rotate(-90)");

    var healthcareLabel = ylabelsGroup
      .append("text")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "healthcare")
      .attr("class", "aText")
      .classed("active", true);
    // .text("Number of Billboard 500 Hits");

    var smokesLabel = ylabelsGroup
      .append("text")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .attr("class", "aText")
      .classed("active", true);
    // .text("Number of Billboard 500 Hits");

    var obesityLabel = ylabelsGroup
      .append("text")
      .attr("y", 0 - chartMargin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .attr("class", "aText")
      .classed("active", true);
    // .text("Number of Billboard 500 Hits");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
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

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else if (chosenXAxis === "age") {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else {
          povertyLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        }
      }
    });
    // y axis labels event listener
    ylabelsGroup.selectAll("text").on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {
        // replaces chosenXAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(tdata, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "poverty") {
          healthcareLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          obesityLabel.classed("active", false).classed("inactive", true);
        } else if (chosenYAxis === "age") {
          healthcareLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          obesityLabel.classed("active", false).classed("inactive", true);
        } else {
          healthcareLabel.classed("active", true).classed("inactive", false);
          smokesLabel.classed("active", false).classed("inactive", true);
          obesityLabel.classed("active", false).classed("inactive", true);
        }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
