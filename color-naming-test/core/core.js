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

function trigger_enter_onbody() {
  // enable enter only right before click rather than when entering the page
  set_keyboard_cb(true, false, false, false);
  var event = $.Event("keydown");
  event.which = 13; // Key code for the Enter key
  $("body").trigger(event); 
}

function prepare_choice() {
  // log demo info first
  if (!para_single) window.localStorage.setItem('info', JSON.stringify(page.info));

  $('#phase1').on('click', function(){
    phaseId = 1;
    pageId = 2;
    trigger_enter_onbody();
  });
  $('#phase2').on('click', function(){
    phaseId = 2;
    pageId = 3;
    trigger_enter_onbody();
  });
  $('#phase3').on('click', function(){
    phaseId = 3;
    pageId = 4;
    trigger_enter_onbody();
  });
  $('#phase4').on('click', function(){
    phaseId = 4;
    pageId = 2;
    trigger_enter_onbody();
  });

  $('#choice-tab').trigger('click');
  $('#title').text('How Does the Study Work?');
  set_keyboard_cb(false, false, false, false); // disable enter event, which will be reenabled upon click
}

function prepare_matching() {
  $("#nextpair").on('click', next_pair_cb);

  $('#base').css('background-color', match_colors[0]);
  $('#match').css('background-color', match_colors[1]);

  $("#sat_customRange").on('input', change_sat_cb);
  $("#val_customRange").on('input', change_sat_cb);
  $("#hue_customRange").on('input', change_sat_cb);
  var rgb = ($('#match').css('background-color')).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  var match = new Color("srgb", [rgb[1]/255, rgb[2]/255, rgb[3]/255]);
  $('#sat_customRange').val(match.hsv.s);
  $('#val_customRange').val(match.hsv.v);
  $("#hue_customRange").attr({
     "max" : (match.hsv.h + 10) % 360,
     "min" : (match.hsv.h + 350) % 360,
  })
  $('#hue_customRange').val(match.hsv.h);

  $('#match-tab').trigger('click');
  $('#title').text('Color Matching');
  set_keyboard_cb(false, false, false, false);
}

function prepare_training() {
  page.slider = '#customRange';

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
  function clip(c) {
    return c.map(color => clamp(color, 0, 1));
  }

  function getRandBin() {
    return Math.floor(Math.random() * 2);
  }

  function swap(array, idx) {
    var t = array[idx];
    array[idx] = array[idx+1];
    array[idx+1] = t;
  }

  // five colors from each pair (always 2+3) so that a subject can't rely on
  // excluded middle to guess the color.
  // TODO: many ways to do this (e.g., completely randomly draw colors so that
  // subjects don't know if a color will be tested *at all*, but then we can't
  // guarantee that each color will be tested).
  indices = Array.from(Array(training_colors.length).keys());
  shuffle(indices);
  // shuffle before concat to minimize the change of consecutive colors having the same name
  indices = indices.concat([...shuffle([...indices])]);
  for (var i = 0; i < match_colors.length / 2; i++) {
    indices.push(getRandBin() + i * 2);
  }
  console.log(indices);

  // perturb so that the test colors are one JND away from training colors
  // we define JND in lab_d65, but color.js calculates DeltaE using lab with
  // D50 as the white point:
  // https://github.com/color-js/color.js/blob/main/src/distance.js
  // https://zschuessler.github.io/DeltaE/learn/
  // Note that the json file will still have the original colors

  // all JND definitions are for normal trichromacy, so what we are testing
  // here whether cvd individuals can generalize what they've learned to other
  // colors that look different *for trichromats* but still share the same
  // color name as the training colors.
  var delta = 4; // one JND is roughly about DeltaE 2.3 (defined in CIELAB)
  for (var i = 0; i < indices.length; i++) {
    var c0 = new Color("srgb-linear", training_colors[indices[i]].obj.linear_srgb);
    var theta = Math.floor(Math.random() *  Math.PI);
    var phi = Math.floor(Math.random() * 2 * Math.PI);

    //var l = Math.max(0, Math.min(100, c0.lab_d65.l + delta * Math.cos(theta)));
    //var a = Math.max(-125, Math.min(125, c0.lab_d65.a + delta * Math.sin(theta) * Math.cos(phi)));
    //var b = Math.max(-125, Math.min(125, c0.lab_d65.b + delta * Math.sin(theta) * Math.sin(phi)));
    var l = c0.lab_d65.l;
    var a = Math.max(-125, Math.min(125, c0.lab_d65.a + delta * Math.cos(phi)));
    var b = Math.max(-125, Math.min(125, c0.lab_d65.b + delta * Math.sin(phi)));

    var c1 = new Color("lab-d65", [l, a, b]); 
    //console.log(Color.deltaE(c0, c1, "76"), Math.sqrt(Math.pow(c1.lab_d65.l - c0.lab_d65.l, 2) + Math.pow(c1.lab_d65.a - c0.lab_d65.a, 2) + Math.pow(c1.lab_d65.b - c0.lab_d65.b, 2)), c0.srgb, c1.srgb);
    //var c1p = new Color("srgb-linear", clip([c1.srgb_linear.r, c1.srgb_linear.g, c1.srgb_linear.b])); 
    //console.log(Color.deltaE(c0, c1p, "76"), Color.deltaE(c0, c1p, "2000"));

	// still has to clip in srgb_linear even though we have clipped in lab:
	// clipping in lab makes sure the color is not imaginary and clipping in
	// srgb makes sure it's displayable
    test_colors[i] = new colorObj(clip([c1.srgb_linear.r, c1.srgb_linear.g, c1.srgb_linear.b]), 'linear_srgb');
    //console.log(training_colors[indices[i]].obj.srgb, test_colors[i].srgb);
  }
}

function prepare_test() {
  // if prof.start is 0 then we have skipped training
  prof.time_in_training = (prof.start != 0) ? (Date.now() - prof.start) : 0;

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
  $('#title').text('Which Color is This? (1/' + test_colors.length.toString() + ')');
  set_keyboard_cb(false, true, true, false);
  prof.start = Date.now();
}

function prepare_fb() {
  $('#resbox').css('visibility', 'hidden');
  send_results();

  var num_corrects = 0;
  prof.answer_color_id.forEach(function(ans, idx) {
    if (ans == prof.test_color_id[idx]) num_corrects++;
  });
  $('#counter').text(num_corrects.toString());
  //$('#').attr('href', '/color-naming-test/dashboard/'+dashboardName+'.html');
  $('#seeres').on('click', function(ev) {
    ev.preventDefault();
    open_dashboard_cb();
  });

  if ((phaseId == 1) || (phaseId == 2)) {
    console.assert(!para_single);
    if (num_corrects != test_colors.length) {
      $('#next_step').html('Since you are on Day 1 &#8212; 3 and you didn\'t get a perfect score, you <b>must</b> go through the training again and re-take the test until you get a perfect score. <a id="goto_training" href="">Click here</a> to go back to training.');
    } else {
      $('#next_step').html('');
    }
  }
  $('#goto_training').on('click', function(ev) {
    ev.preventDefault();
    prof = new Profiler(new Date());
    page.slider = '#customRange';
    pageId = 3;
    trigger_enter_onbody();
  });

  $('#fb-tab').trigger('click');
  $('#title').text('Results and (Optional) Feedback');
  $('#feedback').on('click', get_fb_cb);
  //$('#seeres').on('click', open_dashboard_cb);
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

