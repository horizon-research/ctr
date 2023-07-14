var p_line, d_line, t_line;
var indices, testId;
var prof, all_test_stats, dashboardName;
var pageId; // 0: config; 1: faq; 2: inst; 3: test; 4: fb
var all_tests;
var page_stats;

class Profiler {
  constructor() {
    // time used in each trial
    this.start = 0;
    this.time_elapsed = [];
    // number of rotations in each trial
    this.incs = 0;
    this.num_incrs = [];
  }
}

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const para_sim = urlParams.get('sim')
const para_plane = urlParams.get('plane')

if (window.localStorage.getItem('results')) {
  var alerted = false;

  $('#reset-tab').trigger('click');
  $('#title').text('Welcome Back');

  // start a new test
  $('#newtest').on('click', function(evt) {
    window.localStorage.removeItem('results');
    location.reload();
  });

  // restore a previous session with training
  $('#resume_train').on('click', function(evt) {
    restore_test();
    if (alerted) return;
    prepare_training();
    pageId = 3;
  });

  // restore a previous session without training
  $('#resume').on('click', function(evt) {
    restore_test();
    if (alerted) return;
    prepare_test();
    pageId = 4; // so that pressing space won't trigger an event
  });
} else {
  set_new_test();
}

$('#feedback').on('click', get_fb_cb);
$('#seeres').on('click', open_dashboard_cb);
$('#cvdtype').on('change', set_cvdtype_cb);
$('#sex').on('change', set_sex_cb);
$('#eth').on('change', set_eth_cb);
$('#age').on('change', set_age_cb);
$("body").on('keydown', advance_phase_cb);

$('#alertbox').css('visibility', 'hidden');
$('#trainbox').css('visibility', 'hidden');
$('#fbbox').css('visibility', 'hidden');





/*-------------------------------------*/
/* all the functions are defined below */
/*-------------------------------------*/

function set_age_cb() {
  var val = this.value;
  page.age = val;
}

function set_eth_cb() {
  var val = this.value;
  page.ethnicity = val;
}

function set_sex_cb() {
  var val = this.value;
  page.sex = val;
}

function set_cvdtype_cb() {
  var val = this.value;
  page.cvdType = val; // just for logging purpose 

  // page.type is used for actual simulation.
  // TODO: best effort simulation. right now supports only three strong CVD
  // types. mono, unknown, normal are simulated incorrectly
  if (val == 'prot' || val == 'proa') page.type = 0;
  else if (val == 'deut' || val == 'deua') page.type = 1;
  else if (val == 'trit' || val == 'tria') page.type = 2;
}

function open_dashboard_cb() {
  // open the dashboard page
  window.open('dashboard/'+dashboardName+'.html');
}

function get_fb_cb() {
  const feedbackData = {uid: dashboardName,
                        fb: $('#fbtext').val()};

  fetch('http://localhost:9812/upload-feedback', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    body: JSON.stringify(feedbackData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(result => {
    // show live toast, which will auto hide
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
  })
  .catch(error => console.error(error));
}

function gen_all_tests() {
  return [
          // navy blue
          [[86, 95, 214], 'srgb',  0.1, p_line],
          [[86, 95, 214], 'srgb', -0.1, p_line],
          //[[86, 95, 214], 'srgb',  0.1, d_line],
          //[[86, 95, 214], 'srgb', -0.1, d_line],
          //[[86, 95, 214], 'srgb',  0.3, t_line],
          //[[86, 95, 214], 'srgb', -0.3, t_line],
          //[[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
          //[[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([86, 95, 214], 'srgb'))],
          ////[[86, 95, 214], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
          ////[[86, 95, 214], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([86, 95, 214], 'srgb'))],
          ////[[86, 95, 214], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],
          ////[[86, 95, 214], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([86, 95, 214], 'srgb'))],

          //// dark red
          //[[184, 74, 74], 'srgb',  0.1, p_line],
          //[[184, 74, 74], 'srgb', -0.1, p_line],
          //[[184, 74, 74], 'srgb',  0.1, d_line],
          //[[184, 74, 74], 'srgb', -0.1, d_line],
          //[[184, 74, 74], 'srgb',  0.3, t_line],
          //[[184, 74, 74], 'srgb', -0.3, t_line],
          //[[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
          //[[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([184, 74, 74], 'srgb'))],
          ////[[184, 74, 74], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
          ////[[184, 74, 74], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([184, 74, 74], 'srgb'))],
          ////[[184, 74, 74], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],
          ////[[184, 74, 74], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([184, 74, 74], 'srgb'))],

          //// pale green
          //[[100, 204, 102], 'srgb',  0.3, p_line],
          //[[100, 204, 102], 'srgb', -0.3, p_line],
          //[[100, 204, 102], 'srgb',  0.3, d_line],
          //[[100, 204, 102], 'srgb', -0.3, d_line],
          //[[100, 204, 102], 'srgb',  0.3, t_line],
          //[[100, 204, 102], 'srgb', -0.3, t_line],
          //[[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
          //[[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(p_line, new colorObj([100, 204, 102], 'srgb'))],
          ////[[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
          ////[[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(d_line, new colorObj([100, 204, 102], 'srgb'))],
          ////[[100, 204, 102], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],
          ////[[100, 204, 102], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([100, 204, 102], 'srgb'))],

          //// gray
          //[[136, 136, 136], 'srgb',  0.1, p_line],
          //[[136, 136, 136], 'srgb', -0.1, p_line],
          //[[136, 136, 136], 'srgb',  0.1, d_line],
          //[[136, 136, 136], 'srgb', -0.1, d_line],
          //[[136, 136, 136], 'srgb',  0.3, t_line],
          //[[136, 136, 136], 'srgb', -0.3, t_line],
          //[[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
          //[[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(p_line, new colorObj([136, 136, 136], 'srgb'))],
          ////[[136, 136, 136], 'srgb',  0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
          ////[[136, 136, 136], 'srgb', -0.1, get_ortho_line_rgb(d_line, new colorObj([136, 136, 136], 'srgb'))],
          ////[[136, 136, 136], 'srgb',  0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
          ////[[136, 136, 136], 'srgb', -0.3, get_ortho_line_rgb(t_line, new colorObj([136, 136, 136], 'srgb'))],
         ];
}

function restore_test() {
  var prev_page = JSON.parse(window.localStorage.getItem('results'));

  page_stats = prev_page.page_stats;
  page = new pageObj((page_stats.cs == 0) ? 'srgb' : 'p3');
  page.configPage(() => {}, //registerPickType,
                  () => {}, //registerSimMode,
                  () => {}, //registerPickSimMethod,
                  registerGetAns,
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
}

// must use the base color for t1, because we want to get the orthogonal lines wrt to base color
// also t2_new can be arbitrary
function get_ortho_line_rgb(line_rgb, baseColor) {
  // take |line| in xy and return an rgb line that when projected in xy is orthogonal to |line|
  var t1 = baseColor;
  var t2 = new colorObj(math.add(t1.linear_p3, math.multiply(line_rgb, 0.2)), 'linear_p3');
  var line_xy = normalize(math.subtract(t1.xy, t2.xy)); 
  var line_ortho_xy = normalize([line_xy[1], -line_xy[0]]);
  //var t1_new = new colorObj([86, 95, 214], 'srgb');
  var t2_new_xy = math.add(t1.xy, math.multiply(line_ortho_xy, 1)); 
  var t2_new = new colorObj([t2_new_xy[0], t2_new_xy[1], 1-t2_new_xy[0]-t2_new_xy[1]], 'xyz'); // up to scaling
  var line_ortho_rgb = normalize(math.subtract(t1.linear_p3, t2_new.linear_p3));

  return line_ortho_rgb;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

function post_data(data) {
  const jsonData = JSON.stringify(data);

  //fetch('https://colorvision.cs.rochester.edu/upload-disc-data', {
  fetch('http://localhost:9812/upload-disc-data', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  //.then(response => console.log(response.ok))
  .then(response => response.text())
  .then(result => {
    dashboardName = result;
  })
  .catch(error => console.error(error));
}

function advance_phase_cb(e){
  if (e.which == 13) { // Enter key to advance to next phase
    if (pageId == 0) {
      $('#setting-tab').trigger('click');
      $('#title').text('Information About You');
      pageId = 1;
    } else if (pageId == 1) {
      $('#inst-tab').trigger('click');
      $('#title').text('Instructions');
      pageId = 2;
    } else if (pageId == 2) {
      prepare_training();
      pageId = 3;
    } else if (pageId == 3) {
      prepare_test();
      pageId = 4; // will be in 'test-tab'
    }
  }
}

function get_test_ans_cb(e) {
  // https://stackoverflow.com/questions/4471582/keycode-vs-which
  // arrows to pick answers
  if (e.which == 81 || e.which == 87 || e.which == 65 || e.which == 83) {
    var map = {81: 0,
               87: 1,
               65: 2,
               83: 3,};
    if (map[e.which] == page.train_id) page.num_con_cors++;
    else page.num_con_cors = 0;
    $('#counter').text(page.num_con_cors.toString());

    if (page.num_con_cors == 6) {
      $('#trainbox').css('visibility', 'visible');

      $("body").on('keydown', advance_phase_cb);
      $("body").off('keydown', get_test_ans_cb);

      return;
    }

    var id = Math.floor(Math.random() * 4);
    page.train_id = id;
    var sameC = shuffle([195, 200, 205]);
    for (var i = 0; i <= 3; i++) {
      if (i != id) state.colors[i] = new colorObj(sameC, 'srgb');
      else {
        var channel = 200 + Math.floor(Math.random() * 20);
        var idt = Math.floor(Math.random() * 3);
        var diffC = [18, 18, 18];
        diffC[idt] = channel;
        state.colors[i] = new colorObj(diffC, 'srgb');
      }
    }

    updatePlot(0, 3);
    $(page.slider).val(0);
  }
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
  //$(page.slider).css('visibility', 'hidden');

  $(page.slider_reset).on('click', function(evt) {
    $(page.slider).val(0);
    // need to explicitly trigger input event
    $(page.slider).trigger('input');
  });
  $(page.slider_reset).prop('disabled', false);

  page.num_con_cors = 0;

  $("body").off('keydown', advance_phase_cb);
  $("body").off('keydown', get_ans_cb);
  $("body").on('keydown', key_slider_cb);
  $("body").on('keydown', get_test_ans_cb);

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
}

//https://www.w3schools.com/jsref/met_element_exitfullscreen.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
function openFullScreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function key_slider_cb(e) {
  var current = parseFloat($(page.slider).val());

  function set_next(ang) {
    // TODO: change the unit to degree (in html as well) so that it's more precise.
    // this is a cyclic rotation.
    // technically no need to do since since sinusoids are periodic. we do
    // this here because we use the slider, which has to have a range.
    if (ang < -3.14) ang += 3.14*2;
    else if (ang > 3.14) ang -= 3.14*2;

    $(page.slider).val(ang);
    $(page.slider).trigger('input');

    prof.incs++;
  }

  if (e.which == 37) {
    // left arrow
    set_next(current - 0.06);
  } else if (e.which == 39) {
    // right arrow
    set_next(current + 0.06);
  } else if (e.which == 32) {
    // space
    set_next(0);
  }
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
  canvas.height = window.screen.availHeight;

  //var base_hex = $('#colorpicker').val();
  //var base_srgb = hex_to_srgb(base_hex);
  //state = new discTestState(new colorObj(base_srgb, 'srgb'), '+', test_start_cb, test_finish_cb);

  var test = all_tests[indices[testId]];
  state = new discTestState(new colorObj(test[0], test[1]), test[2],
      test_start_cb, test_finish_cb,
      ans_start_cb, ans_finish_cb,
      test[3]);
  page.submit();

  $("body").on('keydown', get_ans_cb);
  $("body").on('keydown', key_slider_cb);

  $('body').css('background-color', 'rgb(120, 120, 120)');

  $('#test-tab').trigger('click');
  $('#title').text('');
  prof.start = Date.now();
};

function registerPickType() {
  page.cvdType = $('#cvdtype').val();
  page.type = 0; // TODO: we need something here since updatePlot does simulation anyways. could init in constructor
  $('#cvdtype').on('change', set_cvdtype_cb);
}

function registerSimMode() {
  page.sim = false;
}

function registerPickSimMethod() {
  page.simMethod = 0;
}

function get_ans_cb(e) {
  var map = {81: 1,
             87: 2,
             65: 3,
             83: 4,};

  // https://stackoverflow.com/questions/4471582/keycode-vs-which
  if (e.which == 81 || e.which == 87 || e.which == 65 || e.which == 83) {
    prof.num_incrs.push(prof.incs);
    prof.incs = 0;
    prof.time_elapsed.push(Date.now() - prof.start);
    getAnswer(map[e.which]);
    prof.start = Date.now();
  }
}

function registerGetAns() {
  $("body").keydown(get_ans_cb);
}

function add_new_base_trace(plot) {
  var new_trace = {
    x: [state.baseColor.xy[0]],
    y: [state.baseColor.xy[1]],
    text: ['Base'],
    mode: 'markers',
    marker: {
      size: [10],
      opacity: 1,
      color: [state.baseColor.legacy_rgb_css],
    },
    //line: {
    //  width: 1,
    //  color: '#000000',
    //},
    name: 'Thresholds',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
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
  context.fillText("Trial " +testId.toString()+"/"+all_tests.length.toString(),
      canvas.width/2, canvas.height/2);

  // https://javascript.info/promise-basics
  $(page.slider).css('visibility', 'hidden');
  return promise = new Promise(function(resolve, reject) {
    // TODO: could unbind keyboard events
    setTimeout(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      resolve("done");
      $(page.slider).css('visibility', 'visible');
    }, 700);
  });
}

function ans_start_cb() {
  state.scales.push(state.scale);
}

function ans_finish_cb(correct, rev) {
  state.corrects.push(correct);
  state.revs.push(rev);
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

      cvdType: page.cvdType,
      eth: page.ethnicity,
      sex: page.sex,
      age: page.age,

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

  if (testId != all_tests.length) {
    var test = all_tests[indices[testId]];
    state = new discTestState(new colorObj(test[0], test[1]), test[2],
        test_start_cb, test_finish_cb,
        ans_start_cb, ans_finish_cb,
        test[3]);
    page.submit();
    prof = new Profiler();
    prof.start = Date.now();
  } else {
    // done with all tests
    post_data({page_stats: page_stats,
               all_test_stats: all_test_stats,
              });
    window.localStorage.removeItem('results');

    closeFullScreen();

    $('#res-tab').trigger('click');
    $('#title').text('Optinal Feedback');

    canvas.width = 0;
    canvas.height = 0;

    $("body").unbind('keydown');
    $('body').css('background-color', '#FFFFFF');
  }
}
