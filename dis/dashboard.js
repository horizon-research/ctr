function add_new_base_trace(plot, baseColor) {
  var new_trace = {
    x: [baseColor.xy[0]],
    y: [baseColor.xy[1]],
    text: ['Base'],
    mode: 'markers',
    marker: {
      size: [10],
      opacity: 1,
      color: [baseColor.legacy_rgb_css],
    },
    //line: {
    //  width: 1,
    //  color: '#000000',
    //},
    name: 'Thresholds',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
}

function update_dis_plot(res, testId) {
  if (testId % 12 == 1) { // TODO: this assumes that we always do 12 in a group (should be based on base_rgb changes)
    // push a new base 
    // hopefully by the time we get to the second base csv is loaded
    var baseColor = new colorObj(res.base_rgb, 'v_rgb');
    add_new_base_trace(dis_plot, baseColor);
  }

  // add result for this test
  var trace_id = dis_plot.data.length - 1;
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

function update_exp_plot(res, testId) {
  if (testId >= 2) {
    $("#resTab").append('<li class="nav-item" role="presentation"><button class="nav-link" id="e'+testId.toString()+'-tab" data-bs-toggle="tab" data-bs-target="#e'+testId.toString()+'-tab-pane" type="button" role="tab">Test '+testId.toString()+'</button></li>');
    $("#resTabContent").append('<div class="tab-pane" id="e'+testId.toString()+'-tab-pane"><div id="expDiv'+testId.toString()+'"></div></div>');
  }

  exp_plot = plotExp('expDiv'+testId.toString());

  // plot the response markers without style
  var xs = Array.from(Array(res.scales.length).keys());
  exp_plot.data[1].x.push(...xs);
  exp_plot.data[1].y.push(...res.scales);
  var data_update = {'x': [exp_plot.data[1].x], 'y': [exp_plot.data[1].y]};
  Plotly.update(exp_plot, data_update, {}, [1]);

  // TODO: should check whether res.corrects and res.revs exist
  // restyle markers to better visualize results
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

  data_update = {'marker.color': [exp_plot.data[1].marker.color],
                 'marker.line.width': [exp_plot.data[1].marker.line.width]};
  Plotly.update(exp_plot, data_update, {}, [1]);

  // add threshold line
  data_update = {'x': [[0, res.scales.length]], 'y': [[res.threshold, res.threshold]]};
  var layout_update = {
    'annotations[0].visible': true,
    'annotations[0].text': 'threshold is:&nbsp;&nbsp;' + res.threshold.toFixed(4),
    'annotations[0].x': res.scales.length/2,
    'xaxis.range': [0, res.scales.length],
  };
  Plotly.update(exp_plot, data_update, layout_update, [0]);

  // show marker legends
  data_update = {'visible': [true, true, true]};
  Plotly.update(exp_plot, data_update, {}, [2, 3, 4]);
}

function gen_plot(data) {
  var i = 0;
  d3.csv('ciexyzjv.csv').then(function(rows){
    dis_plot = plotDis('disDiv', rows);

    Object.keys(data).forEach(key => {
      var test_res = data[key];
      update_dis_plot(test_res, ++i);
      update_exp_plot(test_res, i);
    });
  });
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
    page.displayConfig(); // TODO: should read json file rather than using this, which would query the device that shows the dashboard
  })

