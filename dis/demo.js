canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function registerPickType() {
  $('input[type=radio][name=pick]').change(function() {
    if (this.id == 'pickp') {
      page.type = 0;
    } else if (this.id == 'pickd') {
      page.type = 1;
    } else if (this.id == 'pickt') {
      page.type = 2;
    }

    // automatically update colors and re-plot
    if (page.init) updatePlot($('#customRange').val(), 4);
  });

  // init color blindness type
  $('#pickd').prop("checked", true).trigger('change');

  // we don't want to change blindness type during test
  //$('input[type=radio][name=pick]').prop('disabled', true);
}

function registerSimMode() {
  $('input[type=radio][name=sim]').change(function() {
    if (this.id == 'yes') {
      page.sim = true;
    } else {
      page.sim = false;
    }

    if (page.init) updatePlot($('#customRange').val(), 1);
  });

  // choose to show actual colors
  $('#no').prop("checked", true).trigger('change');

  $('input[type=radio][name=sim]').prop('disabled', false);
}

function registerPickSimMethod() {
  $('input[type=radio][name=method]').change(function() {
    if (this.id == 'm1') {
      // one plane
      page.simMethod = 1;
    } else {
      // two planes
      page.simMethod = 0;
    }

    // automatically update colors and re-plot
    if (page.init) updatePlot($('#customRange').val(), 2);
  });

  // init simulation method
  $('#m2').prop("checked", true).trigger('change');

  $('input[type=radio][name=method]').prop('disabled', false);
}

function registerGetAns() {
  $('#s11, #s12, #s13, #s14').bind("click", getAnswer);
}

function test_start_cb() {
  d3.csv('ciexyzjv.csv').then(function(rows){
    state.xy_plot = plotXy('xyDiv', rows);
    updatePlot(0, 1);
  });
  state.exp_plot = plotExp('expDiv');
  state.lab_plot = plotLab('labDiv');

  return promise = new Promise(function(resolve, reject) {
    // start_cb must return a promise
    resolve("done");
  });
}

function test_finish_cb() {
  var threshold = math.mean(state.scalesAtRevs.slice(-3));

  // add threshold line
  data_update = {'x': [[0, 30]], 'y': [[threshold, threshold]]};
  var layout_update = {
    'annotations[0].visible': true,
    'annotations[0].text': 'threshold is:&nbsp;&nbsp;' + threshold.toFixed(4)
  };
  Plotly.update(state.exp_plot, data_update, layout_update, [0]);

  // show marker legends
  data_update = {'visible': [true, true, true]};
  Plotly.update(state.exp_plot, data_update, {}, [2, 3, 4]);

  $('#expDiv').trigger('finish');
}

function ans_start_cb() {
  // add a new result to the threshold plot
  state.exp_plot.data[1].x.push(state.numTrials);
  state.exp_plot.data[1].y.push(state.scale);
  var data_update = {'x': [state.exp_plot.data[1].x], 'y': [state.exp_plot.data[1].y]};
  Plotly.update(state.exp_plot, data_update, {}, [1]);
}

function ans_finish_cb(correct, rev) {
  // restyle markers to better visualize results
  state.exp_plot.data[1].marker.color.push(correct ? '#63bf7d' : '#d61e49');
  state.exp_plot.data[1].marker.line.width.push(rev ? 2 : 0);
  data_update = {'marker.color': [state.exp_plot.data[1].marker.color],
                 'marker.line.width': [state.exp_plot.data[1].marker.line.width]};
  Plotly.update(state.exp_plot, data_update, {}, [1]);
}

page = new pageObj('srgb');
// configPage should immediate follow page creation, as it sets the three sim related vars
page.configPage(registerPickType,
                registerSimMode,
                registerPickSimMethod,
                registerGetAns,
                true, //showConfig,
               );
// define state after configPage so that we know page.type, which is needed to
// get test_line_rgb when it's not explicitly defined
state = new discTestState(new colorObj([0.2, 0.15, 0.65], 'xyz'), 0.1,
    test_start_cb, test_finish_cb,
    ans_start_cb, ans_finish_cb);


page.submit();

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tab = urlParams.get('tab')
$('#' + tab + '-tab').trigger('click');

