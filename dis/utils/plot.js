var redColor = '#FF0000';
var greenColor = '#00FF00';
var blueColor = '#0000FF';
var magentaColor = '#FF00FF';
var cyanColor = '#00FFFF';
var yellowColor = '#FFFF00';

var blackColor = '#000000';
var greyColor = '#888888';
var purpleColor = '#5c32a8';
var brightYellowColor = '#fcd303'; 
var orangeColor = '#DC7B2E';
var blueGreenColor = '#63BFAB'; 
var oRedColor = 'rgba(218, 37, 0, 0.3)';
var oGreenColor = 'rgba(0, 143, 0, 0.3)';
var oBlueColor = 'rgba(1, 25, 147, 0.5)';

function plotExp(plotId) {
  if (!page.showExp) return;

  var trace = {
    x: [],
    y: [],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: 'rgb(0, 0, 0)',
    },
    marker: {
      size: 15,
      color: [],
      line: {
        color: '#000000',
        width: []
      }
    },
    showlegend: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var threshold = {
    x: [],
    y: [],
    mode: 'lines',
    name: 'Experimental threshold',
    line: {
      dash: 'dot',
      width: 3,
      color: 'rgb(92, 50, 168)',
    }
  };

  var rev = {
    x: [-1],
    y: [-1],
    mode: 'markers',
    name: 'Reversal',
    visible: false,
    marker: {
      size: 15,
      color: '#FFFFFF',
      line: {
        color: '#000000',
        width: 2
      }
    },
  };

  var corRes = {
    x: [-1],
    y: [-1],
    mode: 'markers',
    name: 'Correct response',
    visible: false,
    marker: {
      size: 15,
      color: '#63bf7d',
    },
  };

  var incorRes = {
    x: [-1],
    y: [-1],
    mode: 'markers',
    name: 'Incorrect response',
    visible: false,
    marker: {
      size: 15,
      color: '#d61e49',
    },
  };

  var data = [threshold, trace, rev, corRes, incorRes];

  var layout = {
    height: 600,
    width: 600,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    title: 'Results',
    xaxis: {
      title: 'Trial Number',
      showgrid: true,
      zeroline: true,
      range: [0, 30],
    },
    yaxis: {
      title: 'Scale',
      showline: true,
      range: [-0.02, 0.12],
    },
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    annotations: [
      {
        x: 25,
        y: 0.06,
        xref: 'x',
        yref: 'y',
        //text: 'Annotation Text',
        visible: false,
        showarrow: false,
        font: {
          family: 'Helvetica Neue',
          size: 20,
          color: 'rgb(92, 50, 168)',
        },
      },
    ],
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotDis(plotId, rows) {
  function unpack(rows, key, toNum) {
    return rows.map(function(row) {
        if (toNum == false) return row[key];
        else return parseFloat(row[key]);
      });
  }

  function range(start, end, stride) {
    return Array((end - start) / stride + 1).fill().map((_, idx) => start + idx*stride)
  }

  var stride = 5;

  wlen = unpack(rows, 'wavelength');
  var firstW = wlen[0];
  var lastW = wlen[wlen.length - 1];

  var x_data = range(firstW, lastW, stride);

  x_cmf = unpack(rows, 'x');
  y_cmf = unpack(rows, 'y');
  z_cmf = unpack(rows, 'z');

  var x_chrm = math.dotDivide(x_cmf, math.add(x_cmf, y_cmf, z_cmf));
  var y_chrm = math.dotDivide(y_cmf, math.add(x_cmf, y_cmf, z_cmf));

  var a475 = (475 - firstW) / stride;
  var a575 = (575 - firstW) / stride;
  var a485 = (485 - firstW) / stride;
  var a660 = (660 - firstW) / stride;

  var xyTrace = {
    x: x_chrm,
    y: y_chrm,
    text: wlen,
    mode: 'lines+markers',
    line: {
      color: blackColor,
      width: 1,
      shape: 'spline',
    },
    name: 'Spectral Locus',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>wavelength: %{text}<extra></extra>',
  };

  var R_xy = (new colorObj([1, 0, 0], 'v_rgb')).xy;
  var G_xy = (new colorObj([0, 1, 0], 'v_rgb')).xy;
  var B_xy = (new colorObj([0, 0, 1], 'v_rgb')).xy;
  var rgb_gamut_lines = {
    x: [R_xy[0], G_xy[0], B_xy[0], R_xy[0]],
    y: [R_xy[1], G_xy[1], B_xy[1], R_xy[1]],
    text: ['R', 'G', 'B', 'R'],
    mode: 'lines',
    line: {
      width: 1,
      color: orangeColor,
    },
    name: page.cs ? 'Display P3 gamut' : 'sRGB gamut',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var line = {
    x: [0],
    y: [0],
    text: ['base', 'threshold'],
    mode: 'lines+markers',
    marker: {
      size: 5,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Colors',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var data = [xyTrace, line,
              rgb_gamut_lines,
             ];

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 80,
      t: 50
    },
    showlegend: true,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
    },
    xaxis: {
      //range: [0, 1],
      title: {
        text: 'x'
      },
      // https://community.plotly.com/t/get-mouses-position-on-click/4145/3
      constrain: 'domain',
      dtick: 0.2,
      zerolinewidth: 1,
    },
    yaxis: {
      //range: [-0.2, 1],
      title: {
        text: 'y'
      },
      scaleanchor: 'x',
      dtick: 0.2,
      zerolinewidth: 1,
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotXy(plotId, rows) {
  if (!page.showXy) return;

  function unpack(rows, key, toNum) {
    return rows.map(function(row) {
        if (toNum == false) return row[key];
        else return parseFloat(row[key]);
      });
  }

  function range(start, end, stride) {
    return Array((end - start) / stride + 1).fill().map((_, idx) => start + idx*stride)
  }

  var stride = 5;

  wlen = unpack(rows, 'wavelength');
  var firstW = wlen[0];
  var lastW = wlen[wlen.length - 1];

  var x_data = range(firstW, lastW, stride);

  x_cmf = unpack(rows, 'x');
  y_cmf = unpack(rows, 'y');
  z_cmf = unpack(rows, 'z');

  var x_chrm = math.dotDivide(x_cmf, math.add(x_cmf, y_cmf, z_cmf));
  var y_chrm = math.dotDivide(y_cmf, math.add(x_cmf, y_cmf, z_cmf));

  var a475 = (475 - firstW) / stride;
  var a575 = (575 - firstW) / stride;
  var a485 = (485 - firstW) / stride;
  var a660 = (660 - firstW) / stride;

  var xyTrace = {
    x: x_chrm,
    y: y_chrm,
    text: wlen,
    mode: 'lines+markers',
    line: {
      color: blackColor,
      width: 1,
      shape: 'spline',
    },
    name: 'Spectral Locus',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>wavelength: %{text}<extra></extra>',
  };


  // Viénot 1999 single-plane approach
  var W = (new colorObj([1, 1, 1], 'v_rgb')).xy;
  var B = (new colorObj([0, 0, 1], 'v_rgb')).xy;
  var R = (new colorObj([1, 0, 0], 'v_rgb')).xy;
  var Y = (new colorObj([1, 1, 0], 'v_rgb')).xy;
  var C = (new colorObj([0, 1, 1], 'v_rgb')).xy;

  var isochrome_line_pd_single = {
    x: [B[0], W[0], Y[0]],
    y: [B[1], W[1], Y[1]],
    text: ['B', 'W', 'Y'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#FFFFFF','#FFFFFF','#FFFFFF'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var isochrome_line_tri_single = {
    x: [R[0], W[0], C[0]],
    y: [R[1], W[1], C[1]],
    text: ['R', 'W', 'C'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#888888','#888888','#888888'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };


  // Brettel projection planes
  var isochrome_line_pd = {
    x: [x_chrm[a475], 1/3, x_chrm[a575]],
    y: [y_chrm[a475], 1/3, y_chrm[a575]],
    text: ['475 nm', 'EEW', '575 nm'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#FFFFFF','#FFFFFF','#FFFFFF'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var isochrome_line_tri = {
    x: [x_chrm[a485], 1/3, x_chrm[a660]],
    y: [y_chrm[a485], 1/3, y_chrm[a660]],
    text: ['485 nm', 'EEW', '660 nm'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#888888','#888888','#888888'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var line = {
    x: [0],
    y: [0],
    text: wlen,
    mode: 'markers',
    marker: {
      size: 15,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Actual',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>Actual: %{text}<extra></extra>',
  };

  var sim_line = {
    x: [0],
    y: [0],
    text: wlen,
    mode: 'markers',
    marker: {
      size: 13,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Simulation',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>Simulation: %{text}<extra></extra>',
  };

  var R_xy = (new colorObj([1, 0, 0], 'v_rgb')).xy;
  var G_xy = (new colorObj([0, 1, 0], 'v_rgb')).xy;
  var B_xy = (new colorObj([0, 0, 1], 'v_rgb')).xy;
  var rgb_gamut_lines = {
    x: [R_xy[0], G_xy[0], B_xy[0], R_xy[0]],
    y: [R_xy[1], G_xy[1], B_xy[1], R_xy[1]],
    text: ['R', 'G', 'B', 'R'],
    mode: 'lines',
    line: {
      width: 1,
      color: orangeColor,
    },
    name: page.cs ? 'Display P3 gamut' : 'sRGB gamut',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  line_p_R = math.transpose(
     [math.add(R_xy, math.multiply(state.confusion_lines_xy[0*3+0], 2)),
      math.add(R_xy, math.multiply(state.confusion_lines_xy[0*3+0], -2))]);
  line_p_G = math.transpose(
     [math.add(G_xy, math.multiply(state.confusion_lines_xy[0*3+1], -2)),
      math.add(G_xy, math.multiply(state.confusion_lines_xy[0*3+1], 2))]);
  line_p_B = math.transpose(
     [math.add(B_xy, math.multiply(state.confusion_lines_xy[0*3+2], 2)),
      math.add(B_xy, math.multiply(state.confusion_lines_xy[0*3+2], -2))]);

  line_d_R = math.transpose(
     [math.add(R_xy, math.multiply(state.confusion_lines_xy[1*3+0], 2)),
      math.add(R_xy, math.multiply(state.confusion_lines_xy[1*3+0], -2))]);
  line_d_G = math.transpose(
     [math.add(G_xy, math.multiply(state.confusion_lines_xy[1*3+1], -2)),
      math.add(G_xy, math.multiply(state.confusion_lines_xy[1*3+1], 2))]);
  line_d_B = math.transpose(
     [math.add(B_xy, math.multiply(state.confusion_lines_xy[1*3+2], 2)),
      math.add(B_xy, math.multiply(state.confusion_lines_xy[1*3+2], -2))]);

  line_t_R = math.transpose(
     [math.add(R_xy, math.multiply(state.confusion_lines_xy[2*3+0], 2)),
      math.add(R_xy, math.multiply(state.confusion_lines_xy[2*3+0], -2))]);
  line_t_G = math.transpose(
     [math.add(G_xy, math.multiply(state.confusion_lines_xy[2*3+1], -2)),
      math.add(G_xy, math.multiply(state.confusion_lines_xy[2*3+1], 2))]);
  line_t_B = math.transpose(
     [math.add(B_xy, math.multiply(state.confusion_lines_xy[2*3+2], 2)),
      math.add(B_xy, math.multiply(state.confusion_lines_xy[2*3+2], -2))]);

  var p_conf = {
    x: line_p_R[0].concat(line_p_G[0]).concat(line_p_B[0]),
    y: line_p_R[1].concat(line_p_G[1]).concat(line_p_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var d_conf = {
    x: line_d_R[0].concat(line_d_G[0]).concat(line_d_B[0]),
    y: line_d_R[1].concat(line_d_G[1]).concat(line_d_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var t_conf = {
    x: line_t_R[0].concat(line_t_G[0]).concat(line_t_B[0]),
    y: line_t_R[1].concat(line_t_G[1]).concat(line_t_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var data = [xyTrace,
              isochrome_line_pd, isochrome_line_tri, isochrome_line_pd_single, isochrome_line_tri_single,
              line, sim_line, rgb_gamut_lines,
              p_conf, d_conf, t_conf,
             ];

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 50,
      t: 50
    },
    showlegend: true,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
    },
    xaxis: {
      range: [0, 1],
      title: {
        text: 'x'
      },
      // https://community.plotly.com/t/get-mouses-position-on-click/4145/3
      constrain: 'domain',
      dtick: 0.2,
      zerolinewidth: 3,
    },
    yaxis: {
      range: [-0.2, 1],
      title: {
        text: 'y'
      },
      scaleanchor: 'x',
      dtick: 0.2,
      zerolinewidth: 3,
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotLab(plotId) {
  if (!page.showLab) return;

  var traces = [];

  var line = {
    x: [0], // a*
    y: [0], // b*
    z: [0], // L
    text: [0, 0, 0],
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 10,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    //mode: 'markers',
    showlegend: true,
    name: 'Actual colors',
    opacity:0.8,
    hovertemplate: 'Actual: %{text}<br>' +
      '<br>L: %{z}' +
      '<br>a<sup>*</sup>: %{x}' +
      '<br>b<sup>*</sup>: %{y}<extra></extra>',
  };
  traces.push(line);

  var sim_line = {
    x: [0], // a*
    y: [0], // b*
    z: [0], // L
    text: [0, 0, 0],
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 10,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    //mode: 'markers',
    showlegend: true,
    name: 'Simulation',
    opacity:0.8,
    hovertemplate: 'Simulation: %{text}<br>' +
      '<br>L: %{z}' +
      '<br>a<sup>*</sup>: %{x}' +
      '<br>b<sup>*</sup>: %{y}<extra></extra>',
  };
  traces.push(sim_line);

  var data = traces;

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    showlegend: true,
    legend: {
      x: 0,
      xanchor: 'left',
      y: 0.9,
    },
    //title: 'Spectral locus in RGB color space',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    scene: {
      camera: {
        projection: {
          type: 'orthographic'
        }
      },
      // https://plotly.com/javascript/3d-axes/
      aspectmode: 'cube',
      xaxis: {
        //autorange: true,
        range: [-200, 500],
        constrain: 'domain',
        dtick: 100,
        showspikes: false,
        title: {
          text: 'a<sup>*</sup>'
        }
      },
      yaxis: {
        //autorange: true,
        range: [-300, 500],
        scaleanchor: 'x',
        scaleratio: 1,
        dtick: 100,
        showspikes: false,
        title: {
          text: 'b<sup>*</sup>'
        }
      },
      zaxis: {
        //autorange: true,
        range: [-100, 100],
        scaleanchor: 'y',
        scaleratio: 1,
        dtick: 20,
        showspikes: false,
        title: {
          text: 'L'
        }
      },
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotRGB(plotId) {
  if (!page.showRGB) return;

  var allPoints = math.transpose([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]]);

  var traces = [];

  // O: 0; R: 1; G: 2: B: 3
  // RG: 4; RB: 5; GB: 6; RGB: 7
  var indices = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7], [0, 7]];
  var names = ['O', 'R', 'G', 'B', 'R+G', 'R+B', 'G+B', 'W'];
  var hoverInfo = [true, true, true, 'skip', 'skip', 'skip', 'skip', 'skip', 'skip', true, true, true, 'skip'];
  var colors = ['#000000', redColor, greenColor, blueColor, yellowColor, magentaColor, cyanColor, '#FFFFFF'];
  var modes = Array(3).fill('lines+markers+text').concat(Array(6).fill('lines')).concat(Array(3).fill('lines+markers+text'));

  // plot the RGB cube
  for (var i = 0; i < indices.length; i++) {
    var start = indices[i][0];
    var end = indices[i][1];
    var line = {
      x: [allPoints[0][start], allPoints[0][end]],
      y: [allPoints[1][start], allPoints[1][end]],
      z: [allPoints[2][start], allPoints[2][end]],
      text: [names[start], names[end]],
      mode: modes[i],
      type: 'scatter3d',
      showlegend: false,
      line: {
        width: 2,
        color: '#20ac37',
      },
      marker: {
        size: 8,
        opacity: 1,
        color: [colors[start], colors[end]],
        line: {
          width: 4,
          color: '#000000',
        },
      },
      hoverinfo: hoverInfo[i],
    };
    // hovertemplate overwrites hoverinfo, so add it later
    if (hoverInfo[i] == true) {
      line.hovertemplate = '%{text}<br>R: %{x}' +
        '<br>G: %{y}' +
        '<br>B: %{z}<extra></extra>';
    }
    traces.push(line);
  }

  var line = {
    x: [0],
    y: [0],
    z: [0],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'markers',
    showlegend: true,
    name: 'Actual colors',
    opacity:0.8,
    hovertemplate: 'Actual: %{text}<br>' +
      '<br>R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var sim_line = {
    x: [0],
    y: [0],
    z: [0],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'markers',
    showlegend: true,
    name: 'Simulation',
    opacity:0.8,
    hovertemplate: 'Simulation: %{text}<br>' +
      '<br>R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  // Viénot 1999 single-plane approach
  var prot_plane_single = {
    x: [0, 0, 1, 1],
    y: [0, 0, 1, 1],
    z: [0, 1, 0, 1],
    i: [0, 1],
    j: [1, 2],
    k: [2, 3],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  var tri_plane_single = {
    x: [0, 1, 0, 1],
    y: [0, 0, 1, 1],
    z: [0, 0, 1, 1],
    i: [0, 1],
    j: [1, 2],
    k: [2, 3],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  // Brettel projection planes
  var a475_RGB = math.multiply(math.multiply(lms2RGB, a475_lms), 200);
  var a575_RGB = math.multiply(math.multiply(lms2RGB, a575_lms), 200);
  var a485_RGB = math.multiply(math.multiply(lms2RGB, a485_lms), 500);
  var a660_RGB = math.multiply(math.multiply(lms2RGB, a660_lms), 500);
  var aEEW_RGB = math.multiply(math.multiply(lms2RGB, aEEW_lms), 200);

  // planes for protanopia and deutanopia
  var prot_plane1 = {
    x: [-aEEW_RGB[0], a475_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a475_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a475_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane 1',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  var prot_plane2 = {
    x: [-aEEW_RGB[0], a575_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a575_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a575_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#E5DF24',
    showlegend: true,
    name: 'Iso-chrome Plane 2',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  // planes for tritanopia
  var tri_plane1 = {
    x: [-aEEW_RGB[0], a485_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a485_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a485_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    color: oGreenColor,
    hoverinfo: 'skip',
    showlegend: true,
    name: 'Iso-chrome Plane 1',
    visible: 'legendonly',
  };

  var tri_plane2 = {
    x: [-aEEW_RGB[0], a660_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a660_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a660_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    color: oRedColor,
    hoverinfo: 'skip',
    showlegend: true,
    name: 'Iso-chrome Plane 2',
    visible: 'legendonly',
  };

  var isochromes_pd = {
    x: [a475_RGB[0]/a475_RGB[2], aEEW_RGB[0]/aEEW_RGB[2]*0.9, a575_RGB[0]*(-0.1)/a575_RGB[2]],
    y: [a475_RGB[1]/a475_RGB[2], aEEW_RGB[1]/aEEW_RGB[2]*0.9, a575_RGB[1]*(-0.1)/a575_RGB[2]],
    z: [1, 0.9, -0.1],
    text: ['475 nm', 'EEW', '575 nm'],
    type: 'scatter3d',
    marker: {
      size: 6,
      opacity: 1,
      color: '#000000',
      symbol: 'cross'
    },
    mode: 'markers+text',
    visible: 'legendonly',
    showlegend: true,
    name: 'Iso-chromes',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var isochromes_t = {
    x: [a485_RGB[0]/a485_RGB[2]*0.3, aEEW_RGB[0]/aEEW_RGB[2]*0.9, a660_RGB[0]/a660_RGB[2]*(-0.008)],
    y: [a485_RGB[1]/a485_RGB[2]*0.3, aEEW_RGB[1]/aEEW_RGB[2]*0.9, a660_RGB[1]/a660_RGB[2]*(-0.008)],
    z: [0.3, 0.9, -0.008],
    text: ['485 nm', 'EEW', '660 nm'],
    type: 'scatter3d',
    marker: {
      size: 6,
      opacity: 1,
      color: '#000000',
      symbol: 'cross'
    },
    mode: 'markers+text',
    visible: 'legendonly',
    showlegend: true,
    name: 'Iso-chromes',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  traces.push(line, sim_line,
              prot_plane1, prot_plane2, tri_plane1, tri_plane2, prot_plane_single, tri_plane_single,
              isochromes_pd, isochromes_t,
             );

  var data = traces;

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    showlegend: true,
    legend: {
      x: 0,
      xanchor: 'left',
      y: 1,
    },
    //title: 'Spectral locus in RGB color space',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    scene: {
      camera: {
        projection: {
          type: 'orthographic'
        }
      },
      // https://plotly.com/javascript/3d-axes/
      //aspectmode: 'data', // to enforce the same scale across axes
      aspectmode: 'cube',
      xaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'R'
        }
      },
      yaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        scaleanchor: 'x',
        //scaleratio: 1,
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'G'
        }
      },
      zaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        scaleanchor: 'x',
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'B'
        }
      },
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

