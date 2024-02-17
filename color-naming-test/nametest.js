var indices, ans_indices, testId, phaseId = 0;
var prof, dashboardName;
var pageId = 0, cid = 0, colorId = 1;
var training_colors = [];
var test_colors = [];
var all_answers = [];

// TODO: change this based on cvd type
// Dark Red, Brown, Blue, Dark Violet, Yellow, Light Green
//var match_colors = ['#E00201', '#975B39', '#3A3EE9', '#9400D3', '#EDEE33', '#'];

// Dark Red, Dark Green, Blue, Dark Violet, Yellow, Light Green
//var match_colors = ['#8D1B1A', '#015A00', '#3A3EE9', '#9400D3', '#EDEE33', '#7FFF00'];

// Light Pink, Turquoise, Blue, Dark Violet, Yellow, Light Green
//var match_colors = ['#FC8FB7', '#37D4B2', '#3A3EE9', '#9400D3', '#EDEE33', '#7FFF00'];

// Light Pink, Turquoise, Blue, Dark Violet, Yellow, Light Green, Dark Red, Dark Green
var match_colors = ['#FC8FB7', '#37D4B2', '#3A3EE9', '#9400D3', '#EDEE33', '#7FFF00','#8D1B1A', '#015A00'];

class Profiler {
  constructor(currentDate) {
    this.start = 0;
    this.time_in_training = 0;
    this.time_in_test = [];
    this.end_pos = [];
    this.all_colors = [];
    this.test_color_id = [];
    this.answer_color_id = [];
    this.time = currentDate.toLocaleString('en-US', {timeZone: 'America/New_York'});
  }
}

prof = new Profiler(new Date());

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const para_sim = urlParams.get('sim');
const para_single = (urlParams.get('single')) == "true"; 

page = new pageObj('srgb');
page.type = 0;
page.sim = (para_sim == "true") ? true : false;
page.simMethod = 0;
page.preserveLum = false;

state = new discTestState(new colorObj([0, 0, 0], 'srgb'), 0.1,
    ()=>{}, ()=>{},
    ()=>{}, ()=>{});

set_keyboard_cb(true, false, false, false);

$('#matchbox').css('visibility', 'hidden');
$('#resbox').css('visibility', 'hidden');

// reload memorized data; uncomment below for debugging
if (para_single) {
  window.localStorage.removeItem('dashboardName');
  window.localStorage.removeItem('matchedResults');
  //window.localStorage.removeItem('info');
}

var item = window.localStorage.getItem('dashboardName');
if (item) {
  dashboardName = item;
}
var matched_res = window.localStorage.getItem('matchedResults');
if (matched_res) {
  match_colors = JSON.parse(matched_res);
  // setting |training_colors| so that we could skip matching
  for (var id = 0; id < match_colors.length; id++) {
    training_colors[id] = {
      color: match_colors[id],
      id: '#color'+(id+1).toString(),
    };

    // these are part of prepare_training. we do them here so that we can skip training
    training_colors[id].obj = new colorObj(hex_to_srgb(training_colors[id].color), 'srgb');
    prof.all_colors[id] = {name: training_colors[id].obj.srgb_name,
                            rgb: training_colors[id].obj.v_quan_rgb};
  }
}
var info = window.localStorage.getItem('info');
if (info) {
  info = JSON.parse(info);
  page.info = info; // page.info will later be used in |prepare_choice| to set localStorage
  $("#cvdtype").val(info.cvdType); 
  $("#sex").val(info.sex); 
  $("#eth").val(info.ethnicity); 
  $("#age").val(info.age); 
}

