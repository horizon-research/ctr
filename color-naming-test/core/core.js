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

  // shuffle all_tests
  indices = Array.from(Array(all_tests.length).keys());
  shuffle(indices);

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

  state.colors = [all_tests[indices[0]].obj];
  $('#testcolor').css('background-color', all_tests[indices[0]].color);

  // show a list of answers
  ans_indices = Array.from(Array(all_tests.length).keys());
  shuffle(ans_indices);
  for (var i = 0; i < all_tests.length; i++) {
    $('label[for=ans' + (i+1).toString() + ']').text((i+1).toString() + ' ' +  all_tests[ans_indices[i]].obj.srgb_name);
  }

  // TODO: could move this into key_slider_cb, but then we can't use mouse (better)?
  $(page.slider).on('input', function() {
    updatePlot(this.value, 0);
  });

  // update the next color
  $("body").on('keydown', get_ans_cb);

  $('#test-tab').trigger('click');
  $('#title').text('Which Color is This?');
  set_keyboard_cb(false, true, true, false);
}

function prepare_results() {
  for (var i = 0; i < all_tests.length; i++) {
    $('#res' + (i+1).toString() + '_color').css('background-color', all_tests[indices[i]].color);
    $('#res' + (i+1).toString() + '_ans').text(all_tests[indices[i]].obj.srgb_name);
    $('#res' + (i+1).toString() + '_your').text(all_answers[i]);
    $('#res' + (i+1).toString() + '_sim').html((all_answers[i] == all_tests[indices[i]].obj.srgb_name) ? '&#10004;' : '&#10060;');
  }

  $('#res-tab').trigger('click');
  $('#title').text('Results');
  set_keyboard_cb(true, true, false, false);
}










