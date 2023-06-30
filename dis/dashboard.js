function add_new_base_trace(plot, baseColor) {
  var new_trace = {
    x: [baseColor.xy[0]],
    y: [baseColor.xy[1]],
    text: ['Base'],
    mode: 'markers',
    marker: {
      size: [15],
      symbol: ['triangle-up'],
      opacity: 1,
      color: [baseColor.legacy_rgb_css],
    },
    line: {
      width: 0.5,
      color: '#000000',
    },
    name: 'Thresholds',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
}

var baseColorSets = {baseColor: [],
                     traceId: [],
                    };

const compareArrays = (a, b) => {
  return a.toString() === b.toString();
};

function update_dis_plot(res, testId) {
  // add a new trace (because we have a new base color)
  var found = false;
  var traceId;
  for (var i = 0; i < baseColorSets.baseColor.length; i++) {
    if (compareArrays(baseColorSets.baseColor[i], res.base_rgb)) {
      found = true;
      traceId = baseColorSets.traceId[i];
      break;
    }
  }
  if (!found) {
    baseColorSets.baseColor.push(res.base_rgb);
    var base = new colorObj(res.base_rgb, 'v_rgb');
    add_new_base_trace(dis_plot, base);
    trace_id = dis_plot.data.length - 1;
    baseColorSets.traceId.push(trace_id);
  }

  // add result for this test
  var thresholdColor = new colorObj(res.threshold_color, 'v_rgb');

  dis_plot.data[trace_id].x.push(thresholdColor.xy[0]);
  dis_plot.data[trace_id].y.push(thresholdColor.xy[1]);
  dis_plot.data[trace_id].marker.size.push(7);
  dis_plot.data[trace_id].marker.color.push(thresholdColor.legacy_rgb_css);
  dis_plot.data[trace_id].text.push('Test'+testId.toString()+' threshold');
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
    if (res.corrects && res.revs) {
      res.scales.forEach((element, index) => {
        exp_plot.data[1].marker.color.push(res.corrects[index] ? '#63bf7d' : '#d61e49');
        exp_plot.data[1].marker.line.width.push(res.revs[index]? 2 : 0);
      });
    } else {
      // TODO: remove this at some point (if not, need to consider the fact that scale has an upper bound)
      var cur_correct, prev_correct = true;
      for (var i = 0; i < res.scales.length - 1; i++) {
        var rev = false;

        if (res.scales[i+1] > res.scales[i]) cur_correct = false;
        else cur_correct = true;

        if (cur_correct != prev_correct) rev = true;
        prev_correct = cur_correct;

        exp_plot.data[1].marker.color.push(cur_correct ? '#63bf7d' : '#d61e49');
        exp_plot.data[1].marker.line.width.push(rev ? 2 : 0);
      }
      // deal with the last response, which is necessarily a reversal so we check if the previous response was correct
      if (prev_correct == false) cur_correct = true;
      else cur_correct = false;
      exp_plot.data[1].marker.color.push(cur_correct ? '#63bf7d' : '#d61e49');
      exp_plot.data[1].marker.line.width.push(2);
    }

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

function displayConfig(test) {
  $('#usedcs').html(test.cs ? 'Display P3' : 'sRGB');
  $('#usedbd').html(test.bitdepth);
  $('#usedxyz').html('CIE 1931 XYZ');
  $('#usedlms').html('Hunt-Pointer-Estevez D65-adapted');
  $('#bsrgb').html(test.color_supports.srgb_b ? '&#10003;' : '');
  $('#bp3').html(test.color_supports.p3_b ? '&#10003;' : '');
  $('#b2020').html(test.color_supports.rec2020_b ? '&#10003;' : '');
  $('#dsrgb').html(test.color_supports.srgb_d ? '&#10003;' : '');
  $('#dp3').html(test.color_supports.p3_d ? '&#10003;' : '');
  $('#d2020').html(test.color_supports.rec2020_d ? '&#10003;' : '');
}

var page, dis_plot, exp_plot;

var fileName = location.href.split("/").at(-1);
var jsonFileName = fileName.split(".")[0];

fetch(jsonFileName+'.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var cs = data.test1.cs;
    page = new pageObj((cs == 0) ? 'srgb' : 'p3');
    gen_plot(data);
    displayConfig(data.test1); // TODO: should read json file rather than using this, which would query the device that shows the dashboard
  })

