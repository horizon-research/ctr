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

  //page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));
  page.submit(new colorObj(base_srgb, 'srgb'));

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
  var data_update = {'x': [[state.baseColor.xy[0], page.threshold_color.xy[0]]],
                     'y': [[state.baseColor.xy[1], page.threshold_color.xy[1]]],
                     'marker.color': [[state.baseColor.legacy_rgb_css, page.threshold_color.legacy_rgb_css]]};
  Plotly.update(dis_plot, data_update, {}, [1]);

  $('#res-tab').trigger('click');
  $("body").unbind('keydown');
  $('body').css('background-color', '#FFFFFF');
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
    state.proj_mat = state.get_proj_mat();
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

page = new pageObj(1);
state = new discTestState('+');

var showXy = false, showRGB = false, showLab = false, showExp = true, showConfig = true;

d3.csv('../ciexyzjv.csv').then(function(rows){
  plotDis('disDiv', rows);
});

page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns,
    showXy, showRGB, showLab, showExp, showConfig);

