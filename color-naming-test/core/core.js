function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

function prepare_training() {
  all_tests[0] = {
    color: $('#base1').val(),
    id: '#color1',
  };
  all_tests[1] = {
    color: $('#match1').val(),
    id: '#color2',
  };
  all_tests[2] = {
    color: $('#base2').val(),
    id: '#color3',
  };
  all_tests[3] = {
    color: $('#match2').val(),
    id: '#color4',
  };
  all_tests[4] = {
    color: $('#base3').val(),
    id: '#color5',
  };
  all_tests[5] = {
    color: $('#match3').val(),
    id: '#color6',
  };

  for (var i = 0; i < all_tests.length; i++) {
    page.disColors[i] = all_tests[i].id;
    $(all_tests[i].id).css('background-color', all_tests[i].color);
    state.colors[i] = new colorObj(hex_to_srgb(all_tests[i].color), 'srgb');
    all_tests[i].obj = state.colors[i];
    $(all_tests[i].id).text(state.colors[i].srgb_name);
  }

  $(page.slider).on('input', function() {
    updatePlot(this.value, 0)
  });

  $('#train-tab').trigger('click');
  $('#title').text('Training');
  set_keyboard_cb(true, true, false, false);
}

var all_answers = [];

function prepare_test() {
  page.slider = '#t_customRange';
  page.slider_reset = '#t_reset';
  page.disColors = ['#testcolor'];

  state.colors = [all_tests[0].obj];
  $('#testcolor').css('background-color', all_tests[0].color);

  for (var i = 0; i < all_tests.length; i++) {
    $('label[for=ans' + (i+1).toString() + ']').text((i+1).toString() + ' ' +  all_tests[i].obj.srgb_name);
  }

  $(page.slider).on('input', function() {
    updatePlot(this.value, 0);
  });

  $("body").on('keydown', get_ans_cb);

  $('#test-tab').trigger('click');
  $('#title').text('Test');
  set_keyboard_cb(false, true, true, false);
}

function show_results() {
}
