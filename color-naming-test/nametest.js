var indices, ans_indices, testId;
var prof, all_test_stats, dashboardName;
var pageId = 0, cid = 0;
var all_tests = [];
var all_answers = [];
// TODO: change this based on cvd type
var match_colors = ['#E00201', '#975B39', '#3A3EE9', '#9400D3', '#EDEE33', '#7FFF00'];

class Profiler {
  constructor() {
    this.start = 0;
    this.time_in_training = 0;
    this.time_in_test = [];
    this.end_pos = [];
    this.all_colors = [];
    this.test_color_id = [];
    this.answer_color_id = [];
  }
}

prof = new Profiler();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const para_sim = urlParams.get('sim')

page = new pageObj('srgb');
page.slider = '#customRange';
page.slider_reset = '#reset';
page.type = 0;
page.sim = (para_sim == "true") ? true : false;
page.simMethod = 0;

state = new discTestState(new colorObj([0, 0, 0], 'srgb'), 0.1,
    ()=>{}, ()=>{},
    ()=>{}, ()=>{});

set_keyboard_cb(true, false, false, false);

$('#matchbox').css('visibility', 'hidden');
$('#resbox').css('visibility', 'hidden');
