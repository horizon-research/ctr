function add_new_base_trace(plot, baseColor, traceName) {
  var new_trace = {
    x: [baseColor.xy[0]],
    y: [baseColor.xy[1]],
    text: ['Base'],
    mode: 'markers',
    marker: {
      size: [10],
      symbol: ['x'],
      opacity: 1,
      //color: [baseColor.legacy_rgb_css],
      color: ['rgb(0, 0, 0)'],
    },
    line: {
      width: 0.5,
      color: '#000000',
    },
    name: traceName,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
}

var baseColorSets_slider = {baseColor: [],
                            traceId: [],
                           };
var baseColorSets_no = {baseColor: [],
                        traceId: [],
                       };

const compareArrays = (a, b) => {
  return a.toString() === b.toString();
};

function update_dis_plot(res, testId) {
  // |testId| starts from 1
  // add a new trace (because we have a new base color)
  var found = false;
  var trade_id, baseColorSets, traceName, symbol;
  var base = new colorObj(res.base_rgb, 'v_rgb');

  if (testId <= total_num_tests/2) {
    baseColorSets = baseColorSets_slider;
    traceName = base.v_rgb_text + ' w/ shifts';
    symbol = 'circle-open';
  } else {
    baseColorSets = baseColorSets_no;
    traceName = base.v_rgb_text + ' w/o shifts';
    symbol = 'square';
  }

  for (var i = 0; i < baseColorSets.baseColor.length; i++) {
    if (compareArrays(baseColorSets.baseColor[i], res.base_rgb)) {
      found = true;
      trace_id = baseColorSets.traceId[i];
      break;
    }
  }
  if (!found) {
    baseColorSets.baseColor.push(res.base_rgb);
    add_new_base_trace(dis_plot, base, traceName);
    trace_id = dis_plot.data.length - 1;
    baseColorSets.traceId.push(trace_id);
  }

  // add result for this test
  var thresholdColor = new colorObj(res.threshold_color, 'v_rgb');

  // use unshift so that the trace name is based on the threshold markers rather than the base color
  dis_plot.data[trace_id].x.unshift(thresholdColor.xy[0]);
  dis_plot.data[trace_id].y.unshift(thresholdColor.xy[1]);
  dis_plot.data[trace_id].marker.size.unshift(7);
  dis_plot.data[trace_id].marker.symbol.unshift(symbol);
  dis_plot.data[trace_id].marker.color.unshift(thresholdColor.legacy_rgb_css);
  dis_plot.data[trace_id].text.unshift('Test'+testId.toString()+' threshold');
  var data_update = {'x': [dis_plot.data[trace_id].x],
                     'y': [dis_plot.data[trace_id].y],
                     'marker.size': [dis_plot.data[trace_id].marker.size],
                     'marker.color': [dis_plot.data[trace_id].marker.color],
                     'text': [dis_plot.data[trace_id].text]};
  Plotly.update(dis_plot, data_update, {}, [trace_id]);
}

function genSelectBox(data, id) {
  exp_plot = plotExp('expDiv');

  var select = document.getElementById(id);

  var values = Object.keys(data);
  for (const val of values)
  {
    var option = document.createElement("option");
    option.value = val;
    option.text = val;
    select.appendChild(option);
  }
}

function register_update_exp_plot(data) {
  $('#expId').on('change', function(evt) {
    var val = this.value;
    var res = data[val];

    // plot the response markers without style
    var xs = Array.from({length: res.scales.length}, (_, i) => i + 1)
    exp_plot.data[1].x = xs;
    exp_plot.data[1].y = res.scales;
    var data_update = {'x': [exp_plot.data[1].x], 'y': [exp_plot.data[1].y]};
    Plotly.update(exp_plot, data_update, {}, [1]);

    // restyle markers to better visualize results
    exp_plot.data[1].marker.color = [];
    exp_plot.data[1].marker.line.width = [];

    res.scales.forEach((element, index) => {
      exp_plot.data[1].marker.color.push(res.corrects[index] ? '#63bf7d' : '#d61e49');
      exp_plot.data[1].marker.line.width.push(res.revs[index]? 2 : 0);
    });

    data_update = {'marker.color': [exp_plot.data[1].marker.color],
                   'marker.line.width': [exp_plot.data[1].marker.line.width]};
    Plotly.update(exp_plot, data_update, {}, [1]);

    // add threshold line
    var xrange_max = Math.max(30, res.scales.length + 1);
    data_update = {'x': [[0, xrange_max]], 'y': [[res.threshold, res.threshold]]};
    var layout_update = {
      'annotations[0].visible': true,
      'annotations[0].text': 'threshold is:&nbsp;&nbsp;' + res.threshold.toFixed(4),
      'annotations[0].x': xrange_max/2,
      'xaxis.range': [0, xrange_max],
      'yaxis.range': [-0.02, Math.max(Math.max(...res.scales)+0.02, 0.2)],
    };
    Plotly.update(exp_plot, data_update, layout_update, [0]);

    // show marker legends
    data_update = {'visible': [true, true, true]};
    Plotly.update(exp_plot, data_update, {}, [2, 3, 4]);
  });
}

function gen_plot(data) {
  var i = 0;
  d3.csv('../ciexyzjv.csv').then(function(rows){
    dis_plot = plotDis('disDiv', rows);

    Object.keys(data).forEach(key => {
      var test_res = data[key];
      update_dis_plot(test_res, ++i);
    });

    genSelectBox(data, 'expId');
    register_update_exp_plot(data);
    $('#expId').val('test1').trigger('change');
  });
}

function displayConfig(page_stats) {
  $('#usedcs').html(page_stats.cs ? 'Display P3' : 'sRGB');
  $('#usedbd').html(page_stats.bitdepth);
  $('#usedxyz').html('CIE 1931 XYZ'); // TODO: add these two to page_stats?
  $('#usedlms').html('Hunt-Pointer-Estevez D65-adapted');
  $('#bsrgb').html(page_stats.color_supports.srgb_b ? '&#10003;' : '');
  $('#bp3').html(page_stats.color_supports.p3_b ? '&#10003;' : '');
  $('#b2020').html(page_stats.color_supports.rec2020_b ? '&#10003;' : '');
  $('#dsrgb').html(page_stats.color_supports.srgb_d ? '&#10003;' : '');
  $('#dp3').html(page_stats.color_supports.p3_d ? '&#10003;' : '');
  $('#d2020').html(page_stats.color_supports.rec2020_d ? '&#10003;' : '');
}

function displayFb(t, i) {
  $('#fbtext').text(t);
  $('#cvdtype').html(i.cvdType);
  $('#sex').html(i.sex);
  $('#eth').html(i.ethnicity);
  $('#age').html(i.age);
}

var page, dis_plot, exp_plot;
var total_num_tests;

var fileName = location.href.split("/").at(-1);
var jsonFileName = fileName.split(".")[0];

fetch(jsonFileName+'.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var cs = data.page_stats.cs;
    page = new pageObj((cs == 0) ? 'srgb' : 'p3');
    Object.assign(page.color_supports, data.page_stats.color_supports); // so that page.bitdepth is correctly set

    total_num_tests = Object.keys(data.all_test_stats).length;

    gen_plot(data.all_test_stats);
    displayConfig(data.page_stats);
    displayFb(data.fb, data.page_stats.info);
  })

