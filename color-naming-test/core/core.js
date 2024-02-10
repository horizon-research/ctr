// TODO: move the two below to color.js
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

function prepare_choice() {
  function trigger_enter_onbody() {
    // enable enter only right before click rather than when entering the page
    set_keyboard_cb(true, false, false, false);
    var event = $.Event("keydown");
    event.which = 13; // Key code for the Enter key
    $("body").trigger(event); 
  }

  // log demo info first
  window.localStorage.setItem('info', JSON.stringify(page.info));

  $('.ctt').on('click', function(){
    pageId = 2;
    trigger_enter_onbody();
  });
  $('.tt').on('click', function(){
    pageId = 3;
    trigger_enter_onbody();
  });
  $('.t').on('click', function(){
    pageId = 4;
    trigger_enter_onbody();
  });

  $('#choice-tab').trigger('click');
  $('#title').text('How Does the Study Work?');
}

function prepare_matching() {
  $("#nextpair").on('click', next_pair_cb);

  $('#base').css('background-color', match_colors[0]);
  $('#match').css('background-color', match_colors[1]);

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
  for (var i = 0; i < training_colors.length; i++) {
    page.disColors[i] = training_colors[i].id;
    state.colors[i] = new colorObj(hex_to_srgb(training_colors[i].color), 'srgb');
    training_colors[i].obj = state.colors[i];
    $(training_colors[i].id).text(state.colors[i].srgb_name);
    // colors in |all_colors| follow the color matching order
    prof.all_colors[i] = {name: training_colors[i].obj.srgb_name,
                          rgb: training_colors[i].obj.v_quan_rgb};
  }

  // initial update of the patches
  updatePlot(0, 3);

  $('#train-tab').trigger('click');
  $('#title').text('Training');
  set_keyboard_cb(true, true, false, false);
  prof.start = Date.now();
}

function gen_test_colors() {
  function sampleFromArray(a) {
    var randomIndex = Math.floor(Math.random() * a.length);
    return a[randomIndex];
  }

  // duplicate the indices so that we test twice as many colors
  // TODO: many ways to do this (e.g., completely randomly draw colors so that
  //   subjects don't know if a color will be tested at all)
  indices = Array.from(Array(training_colors.length).keys());
  indices = indices.concat([...indices]);
  shuffle(indices);

  // generate test colors (randomly +/- 1 so that test colors are
  // different from training colors but are still within one Delta E 2000).
  // https://zschuessler.github.io/DeltaE/learn/
  // Note that the json file will still have the original colors
  // TODO: a more principled to perturbe colors
  for (var i = 0; i < indices.length; i++) {
    test_colors[i] = new colorObj(training_colors[indices[i]].obj.srgb.map(
        c => Math.max(0, Math.min(255, c+sampleFromArray([-1, 0, 1])))), 'srgb');
  }
}

function prepare_test() {
  prof.time_in_training = Date.now() - prof.start;
  prof.start = Date.now();

  page.slider = '#t_customRange';

  gen_test_colors();

  // show a list of answers
  ans_indices = Array.from(Array(training_colors.length).keys());
  //shuffle(ans_indices);
  for (var i = 0; i < training_colors.length; i++) {
    $('label[for=ans' + (i+1).toString() + ']').text(
        (i+1).toString() + ' ' +  training_colors[ans_indices[i]].obj.srgb_name);
  }

  // must set both page.disColors (for display) and state.colors (for computation)
  page.disColors = ['#testcolor'];
  state.colors = [test_colors[0]];

  // update patch colors
  updatePlot(0, 3);
  prof.test_color_id.push(indices[0]);

  // update the next color
  $("body").on('keydown', get_ans_cb);

  $('#test-tab').trigger('click');
  $('#title').text('Which Color is This? (1/12)');
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

// the idea is that each subject's entire data across tests is stored in a single file on the server. the file is given by |dashboardName|, which is assigned upon the transmission of the first test data.
function send_results() {
  delete prof.incs;
  delete prof.start;
  post_data({
             // if a property is undefined it will be omitted (won't be written to the json obj)
             uid: dashboardName, // send only when it's not the first test so that the server can find which file to append new data
             page_stats: (dashboardName == undefined) ? {
               sim: page.sim,
               type: page.type,
               simMethod: page.simMethod,

               info: page.info,

               color_supports: page.color_supports,
               bitdepth: page.bitdepth, // bitdepth is technically derived; save it for convenience
               cs: page.cs,
             } : undefined,
             prof: [prof],
  });
}

