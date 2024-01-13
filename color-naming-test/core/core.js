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

function prepare_info() {
  $('#cvdtype').on('change', set_cvdtype_cb);
  $('#sex').on('change', set_sex_cb);
  $('#eth').on('change', set_eth_cb);
  $('#age').on('change', set_age_cb);

  $('#setting-tab').trigger('click');
  $('#title').text('Information About You');
  set_keyboard_cb(true, false, false, false);
}

function prepare_matching() {
  $("#nextpair").on('click', next_pair_cb);

  $("#sat_customRange").on('input', change_sat_cb);
  $("#val_customRange").on('input', change_sat_cb);
  var rgb = ($('#match').css('background-color')).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  var match = new Color("srgb", [rgb[1]/255, rgb[2]/255, rgb[3]/255]);
  $('#sat_customRange').val(match.hsv.s);
  $('#val_customRange').val(match.hsv.v);
  $('#hue_customRange').val(match.hsv.h);

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
    // colors in |all_colors| follow the color matching order
    prof.all_colors[i] = {name: all_tests[i].obj.srgb_name,
                          rgb: all_tests[i].obj.v_quan_rgb};
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

  // perturbe all tests (+/- 1 making sure it's less than one Delta E 2000)
  // https://zschuessler.github.io/DeltaE/learn/
  // Note that the json file will still have the original colors
  // TODO: make it more principled
  for (var i = 0; i < all_tests.length; i++) {
    //var c0 = new Color("srgb-linear", all_tests[i].obj.linear_srgb);
    all_tests[i].obj = new colorObj(all_tests[i].obj.srgb.map(c => Math.max(0, c-1)), 'srgb');
    //var c1 = new Color("srgb-linear", all_tests[i].obj.linear_srgb);
    //var delta_e = Color.deltaE(c0, c1, "2000");
    //console.log(delta_e);
  }

  // shuffle all_tests
  indices = Array.from(Array(all_tests.length).keys());
  shuffle(indices);

  // must set both page.disColors (for display) and state.colors (for computation)
  page.disColors = ['#testcolor'];
  state.colors = [all_tests[indices[0]].obj];

  // update patch colors
  updatePlot(0, 3);
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

function prepare_fb() {
  send_results();

  $('#fb-tab').trigger('click');
  $('#title').text('Optional Feedback');
  $('#feedback').on('click', get_fb_cb);
  $('#seeres').on('click', open_dashboard_cb);
  set_keyboard_cb(false, false, false, false);
}

function prepare_results() {
  page.slider = '#r_customRange';

  page.disColors = ['#res1_color', '#res2_color', '#res3_color', '#res4_color', '#res5_color', '#res6_color'];

  for (var i = 0; i < all_tests.length; i++) {
    state.colors[i] = all_tests[indices[i]].obj;
    $('#res' + (i+1).toString() + '_ans').text(all_tests[indices[i]].obj.srgb_name);
    $('#res' + (i+1).toString() + '_your').text(all_answers[i]);
    $('#res' + (i+1).toString() + '_sim').html((all_answers[i] == all_tests[indices[i]].obj.srgb_name) ? '&#10004;' : '&#10060;');
  }
  // update patch colors
  updatePlot(0, 3);

  send_results();

  $('#res-tab').trigger('click');
  $('#title').text('Results');
  set_keyboard_cb(false, true, false, false);
}

function send_results() {
  delete prof.incs;
  delete prof.start;
  post_data({prof: prof,
             page_stats: {
               sim: page.sim,
               type: page.type,
               simMethod: page.simMethod,

               info: page.info,

               color_supports: page.color_supports,
               bitdepth: page.bitdepth, // bitdepth is technically derived; save it for convenience
               cs: page.cs,
             },
             //info: page.info,
             //color_supports: page.color_supports,
             //bitdepth: page.bitdepth,
             //cs: page.cs,
  });
}

