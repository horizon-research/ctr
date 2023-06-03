// init canvas size here so that it doesn't conflict with canvas in dis
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

$('#toInst').on('click', function(evt) {
  $('#inst-tab').trigger('click');
});

$('#toTest').on('click', function(evt) {
  page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));

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
  $('#res-tab').trigger('click');
  $("body").unbind('keydown');
  $('body').css('background-color', '#FFFFFF');
});

page = new pageObj(1);
state = new discTestState();

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

var showXy = false, showRGB = false, showLab = false, showExp = true, showConfig = true, useKey = true;

page.configPage(registerPickType, registerSimMode, registerPickSimMethod,
    showXy, showRGB, showLab, showExp, showConfig, useKey);

