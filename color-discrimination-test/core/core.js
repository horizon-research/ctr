function gen_all_tests() {
  return [
          // navy blue
          [[86, 95, 214], 'srgb',  0.1, p_line],
          [[86, 95, 214], 'srgb', -0.1, p_line],
          [[86, 95, 214], 'srgb',  0.1, d_line],
          [[86, 95, 214], 'srgb', -0.1, d_line],
          [[86, 95, 214], 'srgb',  0.3, t_line],
          [[86, 95, 214], 'srgb', -0.3, t_line],
          [[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
          [[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
          //[[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
          //[[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
          //[[86, 95, 214], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],
          //[[86, 95, 214], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],

          // dark red
          [[184, 74, 74], 'srgb',  0.1, p_line],
          [[184, 74, 74], 'srgb', -0.1, p_line],
          [[184, 74, 74], 'srgb',  0.1, d_line],
          [[184, 74, 74], 'srgb', -0.1, d_line],
          [[184, 74, 74], 'srgb',  0.3, t_line],
          [[184, 74, 74], 'srgb', -0.3, t_line],
          [[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
          [[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
          //[[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
          //[[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
          //[[184, 74, 74], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],
          //[[184, 74, 74], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],

          // pale green
          [[100, 204, 102], 'srgb',  0.3, p_line],
          [[100, 204, 102], 'srgb', -0.3, p_line],
          [[100, 204, 102], 'srgb',  0.3, d_line],
          [[100, 204, 102], 'srgb', -0.3, d_line],
          [[100, 204, 102], 'srgb',  0.3, t_line],
          [[100, 204, 102], 'srgb', -0.3, t_line],
          [[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
          [[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
          //[[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
          //[[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
          //[[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],
          //[[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],

          // gray
          [[136, 136, 136], 'srgb',  0.1, p_line],
          [[136, 136, 136], 'srgb', -0.1, p_line],
          [[136, 136, 136], 'srgb',  0.1, d_line],
          [[136, 136, 136], 'srgb', -0.1, d_line],
          [[136, 136, 136], 'srgb',  0.3, t_line],
          [[136, 136, 136], 'srgb', -0.3, t_line],
          [[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
          [[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
          //[[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
          //[[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
          //[[136, 136, 136], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
          //[[136, 136, 136], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
         ];
}

function restore_test() {
  var prev_page = JSON.parse(window.localStorage.getItem('results'));

  page_stats = prev_page.page_stats;
  page = new pageObj((page_stats.cs == 0) ? 'srgb' : 'p3');
  page.configPage(() => {}, //registerPickType,
                  () => {}, //registerSimMode,
                  () => {}, //registerPickSimMethod,
                  () => {}, //registerGetAns,
                  false, //showConfig
                 );
  page.sim = page_stats.sim;
  page.type = page_stats.type;
  page.simMethod = page_stats.simMethod;

  if (!alerted) {
    // check if the store sim setting is compatible with what the query string asks for
    var map = {sim: {yes: true,
                     no: false,},
               type: {p: 0,
                      d: 1,
                      t: 2},
               method: {1: 1,
                        2: 0,},
              };
    // check simMethod only when sim is true
    var setting_bad = (para_sim && (map.sim[para_sim] != page.sim)) ||
        (para_plane && page.sim && (map.method[para_plane] != page.simMethod));
    // so far page.color_supports (which determines bitdepth) is created based on
    // querying the current system. so we check if the new system setting is
    // compatible with the to-be-restored setting.
    var color_bad = (page.bitdepth < page_stats.bitdepth) || (page_stats.cs > page.cs);
    if (setting_bad || color_bad) {
      $('#alertbox').css('visibility', 'visible');
      alerted = true;
      return alerted;
    }
  } else {
    alerted = false;
  }

  Object.assign(page.color_supports, page_stats.color_supports); // so that page.bitdepth is correctly set
 
  // these lines must change depending on whether we use srgb or P3, so it must
  // be initialized only after initializing page, when we know how to
  // concretize v_rgb 
  p_line = normalize((new colorObj([1, 0, 0], 'lms')).v_rgb);
  d_line = normalize((new colorObj([0, 1, 0], 'lms')).v_rgb);
  t_line = normalize((new colorObj([0, 0, 1], 'lms')).v_rgb);
  all_tests = prev_page.all_tests;

  indices = prev_page.indices;

  testId = prev_page.testId;
  prof = new Profiler();

  all_test_stats = prev_page.all_test_stats;
}

function set_new_test() {
  // TODO: can consider calling configPage from page constructor, but we need
  // to move the initialization code in the three handler out of the
  // constructor
  page = new pageObj('p3'); // intended cs; could be adjusted later if system doesn't support it
  page.configPage(registerPickType,
                  registerSimMode,
                  registerPickSimMethod,
                  registerGetAns,
                  false, //showConfig
                 );

  // these lines must change depending on whether we use srgb or P3
  p_line = normalize((new colorObj([1, 0, 0], 'lms')).v_rgb);
  d_line = normalize((new colorObj([0, 1, 0], 'lms')).v_rgb);
  t_line = normalize((new colorObj([0, 0, 1], 'lms')).v_rgb);
  all_tests = gen_all_tests();

  indices = Array.from(Array(all_tests.length).keys());
  shuffle(indices);

  testId = 0;
  prof = new Profiler();

  all_test_stats = {};

  pageId = 0;

  var map = {sim: {yes: true,
                   no: false,},
             type: {p: 0,
                    d: 1,
                    t: 2},
             method: {1: 1,
                      2: 0,},
            };

  if (queryString != "") {
    // null or incorrect para names will simply be ignored (no error)
    if (para_sim) {
      page.sim = map.sim[para_sim];
    }
    if (para_plane) {
      page.simMethod = map.method[para_plane];
    }
  }

  $('#cvdtype').on('change', set_cvdtype_cb);
  $('#sex').on('change', set_sex_cb);
  $('#eth').on('change', set_eth_cb);
  $('#age').on('change', set_age_cb);
}

// TODO: complete duck tapes
function prepare_training() {
  page.s11 = '#t_s11';
  page.s12 = '#t_s12';
  page.s13 = '#t_s13';
  page.s14 = '#t_s14';
  page.slider = '#t_customRange';
  page.slider_reset = '#t_reset';

  $(page.slider).on('input', function() {
    $('.rot-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
    updatePlot(this.value, 0)
  });
  $(page.slider).prop('disabled', false);

  $(page.slider_reset).on('click', function(evt) {
    $(page.slider).val(0);
    // need to explicitly trigger input event
    $(page.slider).trigger('input');
  });
  $(page.slider_reset).prop('disabled', false);

  page.num_con_cors = 0;

  // baseColor and scale are meaningless here
  state = new discTestState(new colorObj([0.2, 0.15, 0.65], 'xyz'), 0.1,
      ()=>{}, ()=>{},
      ()=>{}, ()=>{});
  state.colors[0] = new colorObj([210, 200, 203], 'srgb');
  state.colors[1] = new colorObj([210, 200, 203], 'srgb');
  state.colors[2] = new colorObj([210, 200, 203], 'srgb');
  state.colors[3] = new colorObj([255, 18, 18], 'srgb');
  page.train_id = 3;

  updatePlot(0, 3);

  $('#train-tab').trigger('click');
  $('#title').text('Training');
  set_keyboard_cb(false, true, false, true);
}

function prepare_test(evt) {
  page.s11 = '#s11';
  page.s12 = '#s12';
  page.s13 = '#s13';
  page.s14 = '#s14';
  page.slider = '#customRange';
  page.slider_reset = '#reset';

  openFullScreen();

  // https://dmitripavlutin.com/screen-window-page-sizes/
  // TODO: on MBP for some reaon screen.height is higher than screen height
  //canvas.width = window.screen.width;
  //canvas.height = window.screen.height;
  canvas.width = window.screen.availWidth;
  canvas.height = window.screen.availHeight-50; // TODO: not sure why it's always taller

  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', test_start_cb, test_finish_cb);

  var test = all_tests[indices[testId % all_tests.length]]; // because prepare_test can be called by resume
  state = new discTestState(new colorObj(test[0], test[1]), test[2],
      test_start_cb, test_finish_cb,
      ans_start_cb, ans_finish_cb,
      test[3]);
  page.submit();

  $('body').css('background-color', 'rgb(120, 120, 120)');

  $('#test-tab').trigger('click');
  $('#title').text('');
  // no need to call set_key_cb here; it will be set in test_start_cb for each test

  prof.start = Date.now();
};

function registerPickType() {
  page.type = 0; // TODO: we need something here since updatePlot does simulation anyways. could init in constructor
}

function registerSimMode() {
  page.sim = false;
}

function registerPickSimMethod() {
  page.simMethod = 0;
}

function registerGetAns() {
}

function setupNextColor() {
  // briefly blank the colors to reset the visual field
  var bg_color = $('#patches').css('background-color');
  $(page.s11).css('background-color', bg_color);
  $(page.s12).css('background-color', bg_color);
  $(page.s13).css('background-color', bg_color);
  $(page.s14).css('background-color', bg_color);

  $(page.slider).val(0);
  $(page.slider).css('visibility', 'hidden');
  set_keyboard_cb(false, false, false, false); // first disable all key cbs

  $('#c11').css('zIndex', '10');
  let start = Date.now();
  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
  
    if (timePassed >= 300) {
      clearInterval(timer);
      $('#c11').css('zIndex', '-10');
      context.clearRect(0, 0, canvas.width, canvas.height);

      testOneColor(true);
      if (testId <= all_tests.length) {
        $(page.slider).css('visibility', 'visible');
        set_keyboard_cb(false, true, true, false); // enable slider and get_anc
      } else {
        set_keyboard_cb(false, false, true, false); // enable only get_anc
      }

      return;
    }
  
    createDots();
  }, 20);
}

function ans_start_cb() {
  state.scales.push(state.scale);
}

function ans_finish_cb(correct, rev) {
  state.corrects.push(correct);
  state.revs.push(rev);

  if (state.numRevs == 4) {
    // terminate
    state.test_finish_cb();
  } else {
    setupNextColor();
  }
}

// called during page.submit, which is called once per test
function test_start_cb() {
  testId++;

  // display "Next Trial" in-between tests
  var bg_color = $('#patches').css('background-color');
  $(page.s11).css('background-color', bg_color);
  $(page.s12).css('background-color', bg_color);
  $(page.s13).css('background-color', bg_color);
  $(page.s14).css('background-color', bg_color);

  context.font = "bold 60px Arial";
  context.textAlign = "center";
  context.fillStyle = "#eeeeee";
  context.fillText("Trial " +testId.toString()+"/"+(2*all_tests.length).toString(),
      canvas.width/2, canvas.height/2);

  // https://javascript.info/promise-basics
  $(page.slider).css('visibility', 'hidden');
  set_keyboard_cb(false, false, false, false); // first disable all key cbs

  return promise = new Promise(function(resolve, reject) {
    setTimeout(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      resolve("done");
      if (testId <= all_tests.length) {
        $(page.slider).css('visibility', 'visible');
        set_keyboard_cb(false, true, true, false); // enable slider and get_anc
      } else {
        set_keyboard_cb(false, false, true, false); // enable only get_anc
      }
    }, 700);
  });
}

function startNextTest() {
  var test = all_tests[indices[testId % all_tests.length]];
  state = new discTestState(new colorObj(test[0], test[1]), test[2],
      test_start_cb, test_finish_cb,
      ans_start_cb, ans_finish_cb,
      test[3]);
  page.submit();
  prof = new Profiler();
  prof.start = Date.now();
}

// called after each test terminates
function test_finish_cb() {
  var threshold = math.mean(state.scalesAtRevs.slice(-2)); // TODO: average last 2 since we do only 4 reversals (more general)
  var thresholdColor = new colorObj(
      math.add(state.baseColor.v_rgb, math.multiply(state.test_line_rgb, state.dir * threshold)), 'v_rgb');

  var test_stats = {
    base_rgb: state.baseColor.v_rgb,
    base_xy: state.baseColor.xy,
    dir: state.dir,
    line: state.test_line_rgb,
    threshold: threshold,
    threshold_color: thresholdColor.v_rgb,
    scales: state.scales,
    corrects: state.corrects,
    revs: state.revs,
    num_incrs: prof.num_incrs,
    time_elapsed: prof.time_elapsed,
  };

  all_test_stats['test'+testId.toString()] = test_stats;

  // TODO: move to inst page? must be after the user has picked the config and
  // is in at least the inst page (can't be just after the page obj is created,
  // where all sim related vars are init to null)
  if (testId == 1) {
    page_stats = {
      sim: page.sim,
      type: page.type,
      simMethod: page.simMethod,

      info: page.info,

      color_supports: page.color_supports,
      bitdepth: page.bitdepth, // bitdepth is technically derived; save it for convenience
      cs: page.cs,
    };
  }

  window.localStorage.setItem('results', JSON.stringify({page_stats: page_stats,
                                                         all_test_stats: all_test_stats,
                                                         all_tests: all_tests,
                                                         indices: indices,
                                                         testId: testId,
                                                        }));

  if (testId < all_tests.length) {
    // with slider
    startNextTest();
  } else if (testId == all_tests.length) {
    // display info when switching to no slider
    set_keyboard_cb(false, false, false, false); // first disable all key cbs
    $(page.slider).css('visibility', 'hidden');

    var bg_color = $('#patches').css('background-color');
    $(page.s11).css('background-color', bg_color);
    $(page.s12).css('background-color', bg_color);
    $(page.s13).css('background-color', bg_color);
    $(page.s14).css('background-color', bg_color);

    context.font = "bold 50px Arial";
    context.textAlign = "center";
    context.fillStyle = "#eeeeee";
    context.fillText("For the remaining tests, there is no slider.", canvas.width/2, canvas.height/2-80);
    context.fillText("The task remains the same: identify the differing patch.", canvas.width/2, canvas.height/2);
    context.fillText("Press Enter to continue.", canvas.width/2, canvas.height/2+80);

    function switch_test_cb(e) {
      if (e.which == 13) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        startNextTest();
        $("body").off('keydown', switch_test_cb);
        set_keyboard_cb(false, false, true, false);
      }
    }
    $("body").on('keydown', switch_test_cb);
  } else if (testId < 2 * all_tests.length) {
    // without slider
    startNextTest();
  } else {
    // done with all tests
    post_data({page_stats: page_stats,
               all_test_stats: all_test_stats,
              });
    window.localStorage.removeItem('results');

    $(document).off("fullscreenchange", fullscreenchanged);
    closeFullScreen();

    $('#res-tab').trigger('click');
    $('#title').text('Optional Feedback');
    $('#feedback').on('click', get_fb_cb);
    $('#seeres').on('click', open_dashboard_cb);
    set_keyboard_cb(false, false, false, false); // equivalent to $("body").off('keydown');

    canvas.width = 0;
    canvas.height = 0;

    $('body').css('background-color', '#FFFFFF');
  }
}
