function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function prepare_matching() {
  $("#nextpair").on('click', next_pair);

  $('#match-tab').trigger('click');
  $('#title').text('Color Matching');
  set_keyboard_cb(false, false, false, false);
}

function prepare_training() {
  for (var i = 0; i < all_tests.length; i++) {
    page.disColors[i] = all_tests[i].id;
    state.colors[i] = new colorObj(hex_to_srgb(all_tests[i].color), 'srgb');
    all_tests[i].obj = state.colors[i];
    $(all_tests[i].id).text(state.colors[i].srgb_name);
    prof.all_colors[i] = {name: all_tests[i].obj.srgb_name,
                          rgb: all_tests[i].obj.v_rgb};
  }

  // initial update of the patches
  updatePlot(0, 3);

  $('#train-tab').trigger('click');
  $('#title').text('Training');
  set_keyboard_cb(true, true, false, false);
  prof.start = Date.now();
}

function prepare_test() {
  prof.time_in_training = Date.now() - prof.start;
  prof.start = Date.now();

  page.slider = '#t_customRange';

  // shuffle all_tests
  indices = Array.from(Array(all_tests.length).keys());
  shuffle(indices);

  // must set both page.disColors (for display) and state.colors (for computation)
  page.disColors = ['#testcolor'];
  state.colors = [all_tests[indices[0]].obj];

  $('#testcolor').css('background-color', all_tests[indices[0]].color);
  prof.test_color_id.push(indices[0]);

  // show a list of answers
  ans_indices = Array.from(Array(all_tests.length).keys());
  shuffle(ans_indices);
  for (var i = 0; i < all_tests.length; i++) {
    $('label[for=ans' + (i+1).toString() + ']').text((i+1).toString() + ' ' +  all_tests[ans_indices[i]].obj.srgb_name);
  }

  // update the next color
  $("body").on('keydown', get_ans_cb);

  $('#test-tab').trigger('click');
  $('#title').text('Which Color is This?');
  set_keyboard_cb(false, true, true, false);
}

function prepare_results() {
  page.slider = '#r_customRange';

  page.disColors = ['#res1_color', '#res2_color', '#res3_color', '#res4_color', '#res5_color', '#res6_color'];

  for (var i = 0; i < all_tests.length; i++) {
    state.colors[i] = all_tests[indices[i]].obj;
    $('#res' + (i+1).toString() + '_color').css('background-color', all_tests[indices[i]].color);
    $('#res' + (i+1).toString() + '_ans').text(all_tests[indices[i]].obj.srgb_name);
    $('#res' + (i+1).toString() + '_your').text(all_answers[i]);
    $('#res' + (i+1).toString() + '_sim').html((all_answers[i] == all_tests[indices[i]].obj.srgb_name) ? '&#10004;' : '&#10060;');
  }

  send_results();

  $('#res-tab').trigger('click');
  $('#title').text('Results');
  set_keyboard_cb(false, true, false, false);
}

function send_results() {
  delete prof.incs;
  delete prof.start;
  post_data(prof);
}









