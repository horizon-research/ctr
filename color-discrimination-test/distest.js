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
  set_keyboard_cb(false, false, false, false); // equivalent to $("body").off('keydown');

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
  });
} else {
  set_new_test();
}

set_keyboard_cb(true, false, false, false);
$(document).on("fullscreenchange", fullscreenchanged);

$('#alertbox').css('visibility', 'hidden');
$('#trainbox').css('visibility', 'hidden');
$('#fbbox').css('visibility', 'hidden');
$('#fsbox').css('visibility', 'hidden');
