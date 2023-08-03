var p_line, d_line, t_line;
var indices, testId;
var prof, all_test_stats, dashboardName;
var pageId = 0;
var all_tests = [];
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

prof = new Profiler();

page = new pageObj('srgb');
page.slider = '#customRange';
page.slider_reset = '#reset';
page.type = 0;
page.sim = false;
page.simMethod = 0;

state = new discTestState(new colorObj([0, 0, 0], 'srgb'), 0.1,
    ()=>{}, ()=>{},
    ()=>{}, ()=>{});

set_keyboard_cb(true, false, false, false);

