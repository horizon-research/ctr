page = new pageObj('srgb');

// these lines must change depending on whether we use srgb or P3
var p_line = normalize((new colorObj([1, 0, 0], 'lms')).v_rgb);
var d_line = normalize((new colorObj([0, 1, 0], 'lms')).v_rgb);
var t_line = normalize((new colorObj([0, 0, 1], 'lms')).v_rgb);

// must use the base color for t1, because we want to get the orthogonal lines wrt to base color
// also t2_new can be arbitrary
function get_ortho_line_rgb(line_rgb, baseColor) {
  // take |line| in xy and return an rgb line that when projected in xy is orthogonal to |line|
  var t1 = baseColor;
  var t2 = new colorObj(math.add(t1.linear_p3, math.multiply(line_rgb, 0.2)), 'linear_p3');
  var line_xy = normalize(math.subtract(t1.xy, t2.xy)); 
  var line_ortho_xy = normalize([line_xy[1], -line_xy[0]]);
  //var t1_new = new colorObj([86, 95, 214], 'srgb');
  var t2_new_xy = math.add(t1.xy, math.multiply(line_ortho_xy, 1)); 
  var t2_new = new colorObj([t2_new_xy[0], t2_new_xy[1], 1-t2_new_xy[0]-t2_new_xy[1]], 'xyz'); // up to scaling
  var line_ortho_rgb = normalize(math.subtract(t1.linear_p3, t2_new.linear_p3));

  return line_ortho_rgb;
}

var all_tests = [
                 // navy blue
                 [[86, 95, 214], 'srgb',  0.1, p_line],
                 [[86, 95, 214], 'srgb', -0.1, p_line],
                 [[86, 95, 214], 'srgb',  0.1, d_line],
                 [[86, 95, 214], 'srgb', -0.1, d_line],
                 [[86, 95, 214], 'srgb',  0.3, t_line],
                 [[86, 95, 214], 'srgb', -0.3, t_line],
                 [[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
                 [[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
                 [[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
                 [[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
                 [[86, 95, 214], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],
                 [[86, 95, 214], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],

                 // dark red
                 [[184, 74, 74], 'srgb',  0.1, p_line],
                 [[184, 74, 74], 'srgb', -0.1, p_line],
                 [[184, 74, 74], 'srgb',  0.1, d_line],
                 [[184, 74, 74], 'srgb', -0.1, d_line],
                 [[184, 74, 74], 'srgb',  0.3, t_line],
                 [[184, 74, 74], 'srgb', -0.3, t_line],
                 [[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
                 [[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
                 [[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
                 [[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
                 [[184, 74, 74], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],
                 [[184, 74, 74], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],

                 // pale green
                 [[100, 204, 102], 'srgb',  0.3, p_line],
                 [[100, 204, 102], 'srgb', -0.3, p_line],
                 [[100, 204, 102], 'srgb',  0.3, d_line],
                 [[100, 204, 102], 'srgb', -0.3, d_line],
                 [[100, 204, 102], 'srgb',  0.3, t_line],
                 [[100, 204, 102], 'srgb', -0.3, t_line],
                 [[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
                 [[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
                 [[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
                 [[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
                 [[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],
                 [[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],

                 // gray
                 [[136, 136, 136], 'srgb',  0.1, p_line],
                 [[136, 136, 136], 'srgb', -0.1, p_line],
                 [[136, 136, 136], 'srgb',  0.1, d_line],
                 [[136, 136, 136], 'srgb', -0.1, d_line],
                 [[136, 136, 136], 'srgb',  0.3, t_line],
                 [[136, 136, 136], 'srgb', -0.3, t_line],
                 [[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
                 [[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
                 [[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
                 [[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
                 [[136, 136, 136], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
                 [[136, 136, 136], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
                ];

var indices = Array.from(Array(all_tests.length).keys());
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
shuffle(indices);

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

function prepare_test(evt) {
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;

  // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
  document.documentElement.requestFullscreen();

  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', start_cb, finish_cb);

  var test = all_tests[indices[0]];
  // TODO: we should differentiate between test line and actual confusion line
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

// TODO: this is also called after each test, so maybe lump that into finish_cb()?
$('#test-tab-pane').on('finishOneTest', function(evt) {
  // update disDiv plot
  var trace_id = page.dis_plot.data.length - 1;
  page.dis_plot.data[trace_id].x.push(state.thresholdColor.xy[0]);
  page.dis_plot.data[trace_id].y.push(state.thresholdColor.xy[1]);
  page.dis_plot.data[trace_id].marker.size.push(7);
  page.dis_plot.data[trace_id].marker.color.push(state.thresholdColor.legacy_rgb_css);
  page.dis_plot.data[trace_id].text.push('Test'+testId.toString()+' threshold');
  var data_update = {'x': [page.dis_plot.data[trace_id].x],
                     'y': [page.dis_plot.data[trace_id].y],
                     'marker.size': [page.dis_plot.data[trace_id].marker.size],
                     'marker.color': [page.dis_plot.data[trace_id].marker.color],
                     'text': [page.dis_plot.data[trace_id].text]};
  Plotly.update(page.dis_plot, data_update, {}, [trace_id]);
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

function add_new_base_trace(plot) {
  var new_trace = {
    x: [state.baseColor.xy[0]],
    y: [state.baseColor.xy[1]],
    text: ['Base'],
    mode: 'markers',
    marker: {
      size: [10],
      opacity: 1,
      color: [state.baseColor.legacy_rgb_css],
    },
    //line: {
    //  width: 1,
    //  color: '#000000',
    //},
    name: 'Thresholds',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
}

// called during page.submit, which is called once per test
function start_cb() {
  function updatePlots() {
    if (testId == 0) {
      d3.csv('ciexyzjv.csv').then(function(rows){
        // dis_plot needs to be part of page, because we will get a new state for each test
        page.dis_plot = plotDis('disDiv', rows);

        add_new_base_trace(page.dis_plot);
      });
    } else {
      if (testId % 12 == 0) { // TODO: this assumes that we always do 6 in a group
        // push a new base 
        // hopefully by the time we get to the second base csv is loaded
        add_new_base_trace(page.dis_plot);
      }
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
  $('#customRange').css('visibility', 'hidden');
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

  //if (testId % 6 == 0) // testId won't be 0
  //  plot_ellipse();

  if (testId != all_tests.length) {
    var test = all_tests[indices[testId]];
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

function plot_ellipse() {
  var trace_id = page.dis_plot.data.length - 1;
  var xs = page.dis_plot.data[trace_id].x;
  var ys = page.dis_plot.data[trace_id].y;

  var e_x_center = xs[0];
  var e_y_center = ys[0];
  var end = xs.length;

  var e_x_offset = math.subtract(xs.slice(1, end), e_x_center);
  var e_y_offset = math.subtract(ys.slice(1, end), e_y_center);

  var e_xx = math.dotMultiply(e_x_offset, e_x_offset);
  var e_xy = math.dotMultiply(e_x_offset, e_y_offset);
  var e_yy = math.dotMultiply(e_y_offset, e_y_offset);

  var e_X = math.transpose([e_xx, e_xy, e_yy]);
  var e_Y = math.transpose([1, 1, 1, 1, 1, 1]);

  // XT=Y
  var e_XTX = math.multiply(math.transpose(e_X), e_X);
  var e_XTX_inv = math.inv(e_XTX);
  var e_T = math.multiply(math.multiply(e_XTX_inv, math.transpose(e_X)), e_Y);
  var a = e_T[0];
  var b = e_T[1];
  var c = e_T[2];

  var x_max_h = Math.sqrt(b**2 / (4 * a**2 * c - a * b**2));
  var x_min_h = -x_max_h;
  var y_max_h = -2 * a * x_max_h / b;
  var y_min_h = -y_max_h;

  var ellip_h = {
    x: [x_min_h+e_x_center, x_max_h+e_x_center],
    y: [y_min_h+e_y_center, y_max_h+e_y_center],
    text: [''],
    mode: 'lines+markers',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'x',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Ellipses',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var y_max_v = Math.sqrt(b**2 / (4 * a * c**2 - c * b**2));
  var y_min_v = -y_max_v;
  var x_max_v = -2 * c * y_max_v / b;
  var x_min_v = -x_max_v;

  var ellip_v = {
    x: [x_min_v+e_x_center, x_max_v+e_x_center],
    y: [y_min_v+e_y_center, y_max_v+e_y_center],
    text: [''],
    mode: 'lines+markers',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'x',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Ellipses',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  Plotly.addTraces(page.dis_plot, ellip_h);
  Plotly.addTraces(page.dis_plot, ellip_v);
}

var showConfig = true;
page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig);
$('#customRange').prop('disabled', true);
$('#customRange').css('visibility', 'hidden');
