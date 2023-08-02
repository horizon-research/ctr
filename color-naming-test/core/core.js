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
  all_tests.base1 = $('#base1').val();
  all_tests.match1 = $('#match1').val();
  all_tests.base2 = $('#base2').val();
  all_tests.match2 = $('#match2').val();
  all_tests.base3 = $('#base3').val();
  all_tests.match3 = $('#match3').val();

  page.disColors[0] = '#color1';
  page.disColors[1] = '#color2';
  page.disColors[2] = '#color3';
  page.disColors[3] = '#color4';
  page.disColors[4] = '#color5';
  page.disColors[5] = '#color6';

  $('#color1').css('background-color', all_tests.base1);
  $('#color2').css('background-color', all_tests.match1);
  $('#color3').css('background-color', all_tests.base2);
  $('#color4').css('background-color', all_tests.match2);
  $('#color5').css('background-color', all_tests.base3);
  $('#color6').css('background-color', all_tests.match3);

  state.colors[0] = new colorObj(hex_to_srgb(all_tests.base1), 'srgb');
  state.colors[1] = new colorObj(hex_to_srgb(all_tests.match1), 'srgb');
  state.colors[2] = new colorObj(hex_to_srgb(all_tests.base2), 'srgb');
  state.colors[3] = new colorObj(hex_to_srgb(all_tests.match2), 'srgb');
  state.colors[4] = new colorObj(hex_to_srgb(all_tests.base3), 'srgb');
  state.colors[5] = new colorObj(hex_to_srgb(all_tests.match3), 'srgb');

  $('#color1').text(state.colors[0].srgb_name);
  $('#color2').text(state.colors[1].srgb_name);
  $('#color3').text(state.colors[2].srgb_name);
  $('#color4').text(state.colors[3].srgb_name);
  $('#color5').text(state.colors[4].srgb_name);
  $('#color6').text(state.colors[5].srgb_name);

  $(page.slider).on('input', function() {
    $('.rot-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
    updatePlot(this.value, 0)
  });
  $(page.slider).prop('disabled', false);

  $('#train-tab').trigger('click');
  $('#title').text('Training');
  set_keyboard_cb(true, true, false, false);
}

function prepare_test() {
  $('#test-tab').trigger('click');
  $('#title').text('Test');
  set_keyboard_cb(true, true, false, false);
}
