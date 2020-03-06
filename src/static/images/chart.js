// var data = [2545324, 1454676];
// const size = function(d){
//     return 100*d/d3.sum(data);
// }
// const sizePx = function(d){
//     return 400*d/d3.sum(data);
// }

// d3.select(".chart")
//     .style("width", "440px");
// d3.select(".chart")
//   .selectAll("span")
//   .data(data)
//     .enter()
//     .append("span")
//     .style("display", "inline-block")
//     .style("width", function(d) { return sizePx(d) + "px"; })
//     .style("font", "10px sans-serif")
//     .style("background-color", "steelblue")
//     .style("text-align", "right")
//     .style("padding", "3px")
//     .style("margin", "1px")
//     .style("color", "white")
//     .text(function(d) { return d; });

// Load google charts
// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// // Draw the chart and set the chart values
// function drawChart(cupoTotal, deuda, containerId) {
//   let disponible = cupoTotal - deuda;
//   if(disponible < 0) disponible = 0;
//   var data = google.visualization.arrayToDataTable([
//   ['Categoria', 'Valor'],
//   ['Disponible', disponible],
//   ['Deuda', deuda]
// ]);

//   // Optional; add a title and set the width and height of the chart
//   //   var options = {chartArea:{width:'100%',height:'100%'},legend:{position: 'top', textStyle: {color: 'blue', fontSize: 16}}};
//   //   var options = {legend:{position: 'top', alignment:'center', textStyle: {color: 'blue', fontSize: 16}}};
//   var options = {
//       chartArea:{width:'100%', height:'90%'},
//       legend:{position:'none'},
//       fontSize:18,
//       slices: [{color: '#22c21f'}, {color: '#f52e20'}]  
//     };
  

//   // Display the chart inside the <div> element with id="piechart"
//   var chart = new google.visualization.PieChart(document.getElementById(containerId));
  
//   chart.draw(data, options);
// }

let createPieChart = function(containerId, data)
{
  // data is a dictionary with the data with the form: {values:[1, 2, 3], labels:["categ1", "categ2", "categ3"]}
  data.type = 'pie';
  data.marker = {
    'colors': [
      '#e3e3e3',
      '#000000'
    ]};
  data = [data]; //we need to pass an array of different traces to plotly
  var layout = {
    height: 248,
    width: 248,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 0
    }
  };

  Plotly.newPlot(containerId, data, layout, {displayModeBar: false});
}
// var data = [{
//   values: [19, 26, 55],
//   labels: ['Residential', 'Non-Residential', 'Utility'],
//   type: 'pie'
// }];



