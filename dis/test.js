var prot_all_tests = [
                      [[211, 211, 2], 'srgb', 0.1], // reach gamut limit on the first trial
                      [[17, 233, 11], 'srgb', -0.1],
                      [[58, 62, 233], 'srgb', 0.1],
                      [[141, 3, 216], 'srgb', -0.1], // reach gamut limit on the first trial
                      [[206, 4, 2], 'srgb', 0.1],
                      [[141, 74, 45], 'srgb', -0.1]
                     ];

var deut_all_tests = [
                      //[[146, 33, 33], 'srgb', 0.1],    // dark red
                      //[[146, 33, 33], 'srgb', -0.1],    // dark red
                      ////[[121, 57, 19], 'srgb', 0.1],   // brown
                      ////[[121, 57, 19], 'srgb', -0.1],   // brown
                      ////[[136, 136, 136], 'srgb', 0.1],  // gray
                      ////[[136, 136, 136], 'srgb', -0.1],  // gray
                      //[[170, 121, 131], 'srgb', 0.1], // pink
                      //[[170, 121, 131], 'srgb', -0.1], // pink
                      ////[[184, 74, 74], 'srgb', 0.1],    // dark red
                      ////[[184, 74, 74], 'srgb', -0.1],    // dark red
                      [[39, 126, 39], 'srgb', 0.1],   // dark green
                      [[39, 126, 39], 'srgb', -0.1],   // dark green
                     ];
var testId = 0;
var confusion_lines = [];
var start, time_elapsed = [];

// init canvas size here so that it doesn't conflict with canvas in dis
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var num_cal = 0;

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

$('#toCme').on('click', function(evt) {
  if (page.sim) {
    $('#inst-tab').trigger('click');
  } else {
    // TODO: these are to be updated according to blindness type
    $('#cmepicker1').val(new colorObj([211, 211, 2], 'srgb').legacy_hex_css);
    $('#cmepicker2').val(new colorObj([17, 233, 11], 'srgb').legacy_hex_css);
    $('#cme-tab').trigger('click');
  }
});

$('#toInst').on('click', function(evt) {
  num_cal++;

  var color1 = hex_to_srgb($('#cmepicker1').val());
  var color2 = hex_to_srgb($('#cmepicker2').val());
  color1 = new colorObj(color1, 'srgb');
  color2 = new colorObj(color2, 'srgb');
  // push twice to match all_tests
  confusion_lines.push(normalize(math.subtract(color1.linear_srgb, color2.linear_srgb)));
  confusion_lines.push(normalize(math.subtract(color1.linear_srgb, color2.linear_srgb)));

  if (num_cal == 1) {
    $('#cmepicker1').val(new colorObj([58, 62, 233], 'srgb').legacy_hex_css);
    $('#cmepicker2').val(new colorObj([141, 3, 216], 'srgb').legacy_hex_css);
  } else if (num_cal == 2) {
    $('#cmepicker1').val(new colorObj([206, 4, 2], 'srgb').legacy_hex_css);
    $('#cmepicker2').val(new colorObj([141, 74, 45], 'srgb').legacy_hex_css);
  } else if (num_cal == 3) {
    $('#inst-tab').trigger('click');
  }
});

$('#toTest').on('click', function(evt) {
  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', start_cb, finish_cb);

  var test = deut_all_tests[0];
  state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, confusion_lines[0]);
  page.submit();

  $("body").keydown(function(e){
    var current = parseFloat($('#customRange').val());

    function set_next(ang) {
      // cyclic rotation
	  // technically no need to do since since sinusoids are periodic. we do
	  // this here because we use the slider, which has to have a range.
      if (ang < -3.14) ang += 3.14*2;
      else if (ang > 3.14) ang -= 3.14*2;

      $('#customRange').val(ang);
      $('#customRange').trigger('input');

      state.incs++;
    }

    if (e.which == 37) {
      // left arrow
      set_next(current- 0.02);
    } else if (e.which == 39) {
      // right arrow
      set_next(current + 0.02);
    } else if (e.which == 32) {
      // space
      set_next(0);
    }
  });

  $('body').css('background-color', 'rgb(120, 120, 120)');
  $('#test-tab').trigger('click');
  start = Date.now();
});

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

  $('input[type=radio][name=pick]').prop('disabled', false);
}

function registerSimMode() {
  $('input[type=radio][name=sim]').change(function() {
    if (this.id == 'yes') {
      page.sim = true;
      $('input[type=radio][name=method]').prop('disabled', false);
    } else {
      page.sim = false;
      $('input[type=radio][name=method]').prop('disabled', true);
    }
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
      state.num_incrs.push(state.incs);
      state.incs = 0;
      time_elapsed.push(Date.now() - start);
      getAnswer(map[e.which]);
      start = Date.now();
    }
  });
}

// called during page.submit, which is called once per test
function start_cb() {
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
  state.exp_plot = plotExp('expDiv'+testId.toString());
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
    num_incrs: state.num_incrs,
    time_elapsed: time_elapsed,
  };
  all_test_stats['test'+testId.toString()] = stats;

  $('#test-tab-pane').trigger('finishOneTest');

  if (testId != deut_all_tests.length) {
    var test = deut_all_tests[testId];
    state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, confusion_lines[testId]);
    page.submit();
    start = Date.now();
  } else {
    post_data(all_test_stats);

    $('#res-tab').trigger('click');
    $("body").unbind('keydown');
    $('body').css('background-color', '#FFFFFF');
  }
}

page = new pageObj('p3');

var showConfig = true;
page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig);

