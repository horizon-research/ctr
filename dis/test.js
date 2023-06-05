var all_tests = [[[0.5, 0.9, 0.25], 'linear_srgb', 0.1],
                 [[0.5, 0.9, 0.25], 'linear_srgb', -0.1],
                 [[0.9, 0.1, 0.1], 'linear_srgb', 0.1],
                 [[0.9, 0.1, 0.1], 'linear_srgb', -0.1],
                 [[0.2, 0.2, 0.85], 'linear_srgb', 0.1],
                 [[0.2, 0.2, 0.85], 'linear_srgb', -0.1]
                ];
var testId = 0;
var confusion_lines = [];

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

function post_data() {
  const data = {
    test1: {
      base: [0.5, 0.9, 0.25],
      cs: 'linear_srgb',
      scale: 0.1,
    },

    test2: {
      base: [0.9, 0.1, 0.1],
      cs: 'linear_srgb',
      scale: 0.1,
    },

    test3: {
    base: [0.2, 0.2, 0.85],
    cs: 'linear_srgb',
    scale: 0.1,
    },
  };

  const jsonData = JSON.stringify(data);

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
  post_data();

  if (page.sim) {
    $('#inst-tab').trigger('click');
  } else {
    $('#cmepicker1').val('#3354ab');
    $('#cmepicker2').val('#98f12a');
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
    $('#cmepicker1').val('#34ab35');
    $('#cmepicker2').val('#1298fa');
  } else if (num_cal == 2) {
    $('#cmepicker1').val('#1298fa');
    $('#cmepicker2').val('#34ab35');
  } else if (num_cal == 3) {
    $('#inst-tab').trigger('click');
  }
});

$('#toTest').on('click', function(evt) {
  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', start_cb, finish_cb);

  var test = all_tests[0];
  state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, confusion_lines[0]);
  page.submit();

  $("body").keydown(function(e){
    var current = parseFloat($('#customRange').val());
    if ((e.keyCode || e.which) == 37) {
      // left arrow
      current = (current - 0.02);
      $('#customRange').val(current);
      $('#customRange').trigger('input');
    } else if ((e.keyCode || e.which) == 39) {
      // right arrow
      current = (current + 0.02);
      $('#customRange').val(current);
      $('#customRange').trigger('input');
    } else if ((e.keyCode || e.which) == 32) {
      // space
      current = 0;
      $('#customRange').val(current);
      $('#customRange').trigger('input');
    }
  });

  $('body').css('background-color', 'rgb(120, 120, 120)');
  $('#test-tab').trigger('click');
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
  $("body").keydown(function(e){
    if ((e.keyCode || e.which) == 81) {
      getAnswer(1);
    } else if ((e.keyCode || e.which) == 87) {
      getAnswer(2);
    } else if ((e.keyCode || e.which) == 65) {
      getAnswer(3);
    } else if ((e.keyCode || e.which) == 83) {
      getAnswer(4);
    }
  });
}

// called during page.submit, which is called once per test
function start_cb() {
  if (testId == 0) {
    d3.csv('../ciexyzjv.csv').then(function(rows){
      // dis_plot needs to be part of page, because we will get a new state for each test
      page.dis_plot = plotDis('disDiv', rows);

      var data_update = {'x': [[state.baseColor.xy[0]]],
                         'y': [[state.baseColor.xy[1]]],
                         'marker.size': [[10]],
                         'marker.color': [[state.baseColor.legacy_rgb_css]],
                         'text': [['Base']]};
      Plotly.update(page.dis_plot, data_update, {}, [1]);
    });
  } else if (testId % 2 == 0) {
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
  $('#test-tab-pane').trigger('finishOneTest');

  if (testId != all_tests.length) {
    var test = all_tests[testId];
    state = new discTestState(new colorObj(test[0], test[1]), test[2], start_cb, finish_cb, confusion_lines[testId]);
    page.submit();
  } else {
    $('#res-tab').trigger('click');
    $("body").unbind('keydown');
    $('body').css('background-color', '#FFFFFF');
  }
}

page = new pageObj('p3');

var showConfig = true;
page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig);

