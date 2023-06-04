num_tests = 2;
// init canvas size here so that it doesn't conflict with canvas in dis
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

$('#toInst').on('click', function(evt) {
  $('#inst-tab').trigger('click');
});

function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

$('#toTest').on('click', function(evt) {
  var base_hex = $('#colorpicker').val();
  var base_srgb = hex_to_srgb(base_hex);

  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', start_cb, finish_cb);
  state = new discTestState(new colorObj([0.5, 0.9, 0.25], 'v_rgb'), 0.1, start_cb, finish_cb);
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

$('#expDiv').on('finish', function(evt) {
  // update disDiv plot
  var dis_plot = document.getElementById('disDiv');
  dis_plot.data[1].x.push(page.threshold_color.xy[0]);
  dis_plot.data[1].y.push(page.threshold_color.xy[1]);
  dis_plot.data[1].marker.color.push(page.threshold_color.legacy_rgb_css);
  dis_plot.data[1].text.push('threshold');
  var data_update = {'x': [dis_plot.data[1].x],
                     'y': [dis_plot.data[1].y],
                     'marker.color': [dis_plot.data[1].marker.color],
                     'text': [dis_plot.data[1].text]};
  Plotly.update(dis_plot, data_update, {}, [1]);
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

function start_cb() {
  if (num_tests == 2) {
    var dis_plot = document.getElementById('disDiv');
    var data_update = {'x': [[state.baseColor.xy[0]]],
                       'y': [[state.baseColor.xy[1]]],
                       'marker.color': [[state.baseColor.legacy_rgb_css]],
                       'text': [['base']]};
    Plotly.update(dis_plot, data_update, {}, [1]);
  }

  num_tests--;

  state.exp_plot = plotExp('expDiv');
}

function finish_cb() {
  $('#expDiv').trigger('finish');

  if (num_tests != 0) {
    state = new discTestState(new colorObj([0.5, 0.9, 0.25], 'v_rgb'), -0.1, start_cb, finish_cb);
    page.submit();
  } else {
    $('#res-tab').trigger('click');
    $("body").unbind('keydown');
    $('body').css('background-color', '#FFFFFF');
  }
}

page = new pageObj(0);

// TODO: this is done once each page rather than once each test. have a callback for it in page?
d3.csv('../ciexyzjv.csv').then(function(rows){
  plotDis('disDiv', rows);
});

var showConfig = true;
page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig);

