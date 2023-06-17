var p_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [1, 0, 0]));
var d_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [0, 1, 0]));
var t_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [0, 0, 1]));

var all_tests = [
                 // navy blue
                 [[86, 95, 214], 'srgb',  0.1, p_line],
                 [[86, 95, 214], 'srgb', -0.1, p_line],
                 [[86, 95, 214], 'srgb',  0.1, d_line],
                 [[86, 95, 214], 'srgb', -0.1, d_line],
                 [[86, 95, 214], 'srgb',  0.2, t_line],
                 [[86, 95, 214], 'srgb', -0.2, t_line],

                 // dark red
                 [[184, 74, 74], 'srgb',  0.1, p_line],
                 [[184, 74, 74], 'srgb', -0.1, p_line],
                 [[184, 74, 74], 'srgb',  0.1, d_line],
                 [[184, 74, 74], 'srgb', -0.1, d_line],
                 [[184, 74, 74], 'srgb',  0.2, t_line],
                 [[184, 74, 74], 'srgb', -0.2, t_line],

                 // pale green
                 [[100, 204, 102], 'srgb',  0.1, p_line],
                 [[100, 204, 102], 'srgb', -0.1, p_line],
                 [[100, 204, 102], 'srgb',  0.1, d_line],
                 [[100, 204, 102], 'srgb', -0.1, d_line],
                 [[100, 204, 102], 'srgb',  0.2, t_line],
                 [[100, 204, 102], 'srgb', -0.2, t_line],

                 // gray
                 [[136, 136, 136], 'srgb',  0.1, p_line],
                 [[136, 136, 136], 'srgb', -0.1, p_line],
                 [[136, 136, 136], 'srgb',  0.1, d_line],
                 [[136, 136, 136], 'srgb', -0.1, d_line],
                 [[136, 136, 136], 'srgb',  0.2, t_line],
                 [[136, 136, 136], 'srgb', -0.2, t_line],
                ];

var testId = 0;

class Profiler {
  constructor() {
    // time used in each trial
    this.start = 0;
    this.time_elapsed = [];
    // number of rotations in each trial
    this.incs = 0;
    this.num_incrs = [];
  }
}
var prof = new Profiler();

function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

var all_test_stats = {};

function post_data() {
  const jsonData = JSON.stringify(all_test_stats);

  fetch('http://localhost:3000/upload-data', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => console.log(response.ok))
  //.then(response => response.text())
  //.then(result => {
  //  console.log(result);
  //  // Handle the server response here
  //})
  .catch(error => console.error(error));
}

var pageId = 0; // 0: config; 1: inst; 2: test; 3: res

$("body").keydown(function(e){
  if (e.which == 32) { // Space key
    if (pageId == 0) {
      $('#inst-tab').trigger('click');
      pageId = 1;
    } else if (pageId == 1) {
      prepare_test();
      pageId = 2;
    }
  }
});

//$('#toInst').on('click', function(evt) {
//  $('#inst-tab').trigger('click');
//});

//$('#toTest').on('click', prepare_test(evt));

function prepare_test(evt) {
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;

  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
  document.documentElement.requestFullscreen();

  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', start_cb, finish_cb);

  var test = all_tests[0];
  state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, test[3]);
  page.submit();

  $("body").keydown(function(e){
    var current = parseFloat($('#customRange').val());

    function set_next(ang) {
      // TODO: change the unit to degree (in html as well) so that it's more precise.
      // this is a cyclic rotation.
	  // technically no need to do since since sinusoids are periodic. we do
	  // this here because we use the slider, which has to have a range.
      if (ang < -3.14) ang += 3.14*2;
      else if (ang > 3.14) ang -= 3.14*2;

      $('#customRange').val(ang);
      $('#customRange').trigger('input');

      prof.incs++;
    }

    if (e.which == 37) {
      // left arrow
      set_next(current - 0.06);
    } else if (e.which == 39) {
      // right arrow
      set_next(current + 0.06);
    } else if (e.which == 32) {
      // space
      set_next(0);
    }
  });

  $('body').css('background-color', 'rgb(120, 120, 120)');
  $('#test-tab').trigger('click');
  prof.start = Date.now();
};

$('#test-tab-pane').on('finishOneTest', function(evt) {
  // update disDiv plot
  page.dis_plot.data[1].x.push(state.thresholdColor.xy[0]);
  page.dis_plot.data[1].y.push(state.thresholdColor.xy[1]);
  page.dis_plot.data[1].marker.size.push(7);
  page.dis_plot.data[1].marker.color.push(state.thresholdColor.legacy_rgb_css);
  page.dis_plot.data[1].text.push('Test'+testId.toString()+' threshold');
  var data_update = {'x': [page.dis_plot.data[1].x],
                     'y': [page.dis_plot.data[1].y],
                     'marker.size': [page.dis_plot.data[1].marker.size],
                     'marker.color': [page.dis_plot.data[1].marker.color],
                     'text': [page.dis_plot.data[1].text]};
  Plotly.update(page.dis_plot, data_update, {}, [1]);
});

function registerPickType() {
  $('input[type=radio][name=pick]').change(function() {
    if (this.id == 'pickp') {
      page.type = 0;
    } else if (this.id == 'pickd') {
      page.type = 1;
    } else if (this.id == 'pickt') {
      page.type = 2;
    }
  });

  // init color blindness type
  $('#pickd').prop("checked", true).trigger('change');

  $('input[type=radio][name=pick]').prop('disabled', true);
}

function registerSimMode() {
  $('input[type=radio][name=sim]').change(function() {
    if (this.id == 'yes') {
      page.sim = true;
      $('input[type=radio][name=method]').prop('disabled', false);
      $('input[type=radio][name=pick]').prop('disabled', false);
    } else {
      page.sim = false;
      $('input[type=radio][name=method]').prop('disabled', true);
      $('input[type=radio][name=pick]').prop('disabled', true);
    }
  });

  // choose to show actual colors
  $('#no').prop("checked", true).trigger('change');

  $('input[type=radio][name=sim]').prop('disabled', false);
}

function registerPickSimMethod() {
  $('input[type=radio][name=method]').change(function() {
    if (this.id == 'm1') {
    // TODO: could disable keyboard events
      // one plane
      page.simMethod = 1;
    } else {
      // two planes
      page.simMethod = 0;
    }
  });

  $('#m2').prop("checked", true).trigger('change');

  // only enable when simulation is on
  $('input[type=radio][name=method]').prop('disabled', true);
}

function registerGetAns() {
  var map = {81: 1,
             87: 2,
             65: 3,
             83: 4,};

  $("body").keydown(function(e){
    // https://stackoverflow.com/questions/4471582/keycode-vs-which
    if (e.which == 81 || e.which == 87 || e.which == 65 || e.which == 83) {
      prof.num_incrs.push(prof.incs);
      prof.incs = 0;
      prof.time_elapsed.push(Date.now() - prof.start);
      getAnswer(map[e.which]);
      prof.start = Date.now();
    }
  });
}

// called during page.submit, which is called once per test
function start_cb() {
  function updatePlots() {
    if (testId == 0) {
      d3.csv('ciexyzjv.csv').then(function(rows){
        // dis_plot needs to be part of page, because we will get a new state for each test
        page.dis_plot = plotDis('disDiv', rows);

        var data_update = {'x': [[state.baseColor.xy[0]]],
                           'y': [[state.baseColor.xy[1]]],
                           'marker.size': [[10]],
                           'marker.color': [[state.baseColor.legacy_rgb_css]],
                           'text': [['Base']]};
        Plotly.update(page.dis_plot, data_update, {}, [1]);
      });
    } else {
      // always push base 
      // hopefully by the time we get to the second base csv is loaded
      page.dis_plot.data[1].x.push(state.baseColor.xy[0]);
      page.dis_plot.data[1].y.push(state.baseColor.xy[1]);
      page.dis_plot.data[1].marker.size.push(10);
      page.dis_plot.data[1].marker.color.push(state.baseColor.legacy_rgb_css);
      page.dis_plot.data[1].text.push('base');
      var data_update = {'x': [page.dis_plot.data[1].x],
                         'y': [page.dis_plot.data[1].y],
                         'marker.size': [page.dis_plot.data[1].marker.size],
                         'marker.color': [page.dis_plot.data[1].marker.color],
                         'text': [page.dis_plot.data[1].text]};
      Plotly.update(page.dis_plot, data_update, {}, [1]);
    }

    testId++;

    if (testId >= 2) {
      $("#resTab").append('<li class="nav-item" role="presentation"><button class="nav-link" id="e'+testId.toString()+'-tab" data-bs-toggle="tab" data-bs-target="#e'+testId.toString()+'-tab-pane" type="button" role="tab">Test '+testId.toString()+'</button></li>');
      $("#resTabContent").append('<div class="tab-pane" id="e'+testId.toString()+'-tab-pane"><div id="expDiv'+testId.toString()+'"></div></div>');
    }

    state.exp_plot = plotExp('expDiv'+testId.toString());
  }

  updatePlots();

  // display "Next Trial" in-between tests
  var bg_color = $('#patches').css('background-color');
  $('#s11').css('background-color', bg_color);
  $('#s12').css('background-color', bg_color);
  $('#s13').css('background-color', bg_color);
  $('#s14').css('background-color', bg_color);

  context.font = "bold 60px Arial";
  context.textAlign = "center";
  context.fillStyle = "#eeeeee";
  context.fillText("Trial " +testId.toString()+"/"+all_tests.length.toString(),
      canvas.width/2, canvas.height/2);

  // https://javascript.info/promise-basics
  return promise = new Promise(function(resolve, reject) {
    // TODO: could unbind keyboard events
    setTimeout(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      resolve("done");
      $('#customRange').css('visibility', 'visible');
    }, 700);
  });
}

// called after each test terminates
function finish_cb() {
  var stats = {
    sim: page.sim,
    blindness_type: page.type,
    simMethod: page.simMethod,
    has_srgb: page.hassRGB,
    has_p3: page.hasP3,
    has_rec2020: page.hasRec2020,
    has_hdr: page.hasHDR,
    bitdepth: page.bitdepth,

    base_rgb: state.baseColor.v_rgb,
    base_xy: state.baseColor.xy,
    cs: page.cs,
    dir: state.dir,
    line: state.confusion_lines_rgb,
    threshold: state.threshold,
    threshold_color: state.thresholdColor.v_rgb,
    scales: state.scales,
    num_incrs: prof.num_incrs,
    time_elapsed: prof.time_elapsed,
  };
  all_test_stats['test'+testId.toString()] = stats;

  $('#test-tab-pane').trigger('finishOneTest');

  if (testId != all_tests.length) {
    var test = all_tests[testId];
    state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, test[3]);
    page.submit();
    prof.start = Date.now();
  } else {
    // done with all tests
    post_data(all_test_stats);

    document.exitFullscreen();

    $('#res-tab').trigger('click');

    canvas.width = 0;
    canvas.height = 0;

    $("body").unbind('keydown');
    $('body').css('background-color', '#FFFFFF');
  }
}

page = new pageObj('p3');

var showConfig = true;
page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig);
$('#customRange').prop('disabled', true);
$('#customRange').css('visibility', 'hidden');
