function updatePlot(theta, action) {
  // |action|:
  // 0: rotate (slider)
  // 1: show simulation/actual colors
  // 2: pick simulation algorithm (1 vs. 2 planes)
  // 3: submit
  // 4: pick blindness type

  function update_rgb(rotColors_css, simColors_css) {
    var rotPoints_RGB = math.transpose(state.rotColorsMapped.map(c => c.v_rgb));
    var simPoints_RGB = math.transpose(state.simColors.map(c => c.v_rgb));

    // update actual colors
    var data_update = {'x': [rotPoints_RGB[0]], 'y': [rotPoints_RGB[1]], 'z': [rotPoints_RGB[2]],
                       'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(state.rgb_plot, data_update, {}, [13]);

    // update simulated colors
    data_update = {'x': [simPoints_RGB[0]], 'y': [simPoints_RGB[1]], 'z': [simPoints_RGB[2]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(state.rgb_plot, data_update, {}, [14]);
  }

  function update_lab(rotColors_css, simColors_css) {
    // update actual colors
    var rotPoints_Lab = math.transpose(state.rotColorsMapped.map(c => c.lab));
    data_update = {'x': [rotPoints_Lab[1]], 'y': [rotPoints_Lab[2]], 'z': [rotPoints_Lab[0]],
                   'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(state.lab_plot, data_update, {}, [0]);

    // update simulated colors
    var simPoints_Lab = math.transpose(state.simColors.map(c => c.lab));
    data_update = {'x': [simPoints_Lab[1]], 'y': [simPoints_Lab[2]], 'z': [simPoints_Lab[0]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(state.lab_plot, data_update, {}, [1]);
  }

  function update_xy(rotColors_css, simColors_css) {
    var rotPoints_xy = math.transpose(state.rotColorsMapped.map(c => c.xy));
    data_update = {'x': [rotPoints_xy[0]], 'y': [rotPoints_xy[1]],
                   'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(state.xy_plot, data_update, {}, [5]);

    var simPoints_xy = math.transpose(state.simColors.map(c => c.xy));
    data_update = {'x': [simPoints_xy[0]], 'y': [simPoints_xy[1]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(state.xy_plot, data_update, {}, [6]);
  }

  /* update iso-chrome planes/lines visibility */
  function update_legends(update_xy, update_rgb) {
    if (action == 2 || action == 3 || action == 4) {
      if (page.type == 0 || page.type == 1) { // P and D
        if (page.simMethod == 0) { // 2-plane {
          data_update = {'visible': ['legendonly', false, false, false,
              (page.type==0)?'legendonly':false, (page.type==1)?'legendonly':false, false]};
          if (state.xy_plot) Plotly.update(state.xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': ['legendonly', 'legendonly', false, false, false, false, 'legendonly', false]};
          if (state.rgb_plot) Plotly.update(state.rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        } else { // 1-plane
          data_update = {'visible': [false, false, 'legendonly', false,
              (page.type==0)?'legendonly':false, (page.type==1)?'legendonly':false, false]};
          if (state.xy_plot) Plotly.update(state.xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, false, false, 'legendonly', false, false, false]};
          if (state.rgb_plot) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        }
      } else { // T
        if (page.simMethod == 0) { // 2-plane {
          data_update = {'visible': [false, 'legendonly', false, false, false, false, 'legendonly']};
          if (state.xy_plot) Plotly.update(state.xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, 'legendonly', 'legendonly', false, false, false, 'legendonly']};
          if (state.rgb_plot) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        } else { // 1-plane
          data_update = {'visible': [false, false, false, 'legendonly', false, false, 'legendonly']};
          if (state.xy_plot) Plotly.update(state.xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, false, false, false, 'legendonly', false, false]};
          if (state.rgb_plot) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        }
      }
    }
  }

  // state.rotColors now has the rotated colors
  state.rotate_colors(theta);
  // state.rotColorsMapped has gamut-mapped rotated colors
  state.dichromatic_gamut_mapping(state.rotColors, 1); // 0 for no mapping; 1 for clipping; 2 for confusion line mapping
  // state.simColors has simulated, gamut-mapped rotated colors
  state.simulate(); // always run simulation (might not be needed in test if page.sim = 0)

  // The reason to use the legacy rgb format is because plotly supports only that
  // will be an issue if display supports HDR because then we would be using 10 bits but that's not supported by plotly
  var rotColors_css = state.rotColorsMapped.map(c => c.legacy_rgb_css);
  var simColors_css = state.simColors.map(c => c.legacy_rgb_css);

  if (state.rgb_plot) update_rgb(rotColors_css, simColors_css);
  if (state.lab_plot) update_lab(rotColors_css, simColors_css);
  if (state.xy_plot) update_xy(rotColors_css, simColors_css);
  update_legends(state.xy_plot, state.rgb_plot);

  if (page.sim) {
    /* update square colors */
    var temp = state.simColors.map(c => c.v_rgb_css);
    $('#s11').css('background-color', temp[0]);
    $('#s12').css('background-color', temp[1]);
    $('#s13').css('background-color', temp[2]);
    $('#s14').css('background-color', temp[3]);
  } else {
    var temp = state.rotColorsMapped.map(c => c.v_rgb_css);
    $('#s11').css('background-color', temp[0]);
    $('#s12').css('background-color', temp[1]);
    $('#s13').css('background-color', temp[2]);
    $('#s14').css('background-color', temp[3]);
  }

  // good for debugging
  //$('#s11').text(rotColors_css[0]);
  //$('#s12').text(rotColors_css[1]);
  //$('#s13').text(rotColors_css[2]);
  //$('#s14').text(rotColors_css[3]);
}

function registerSlider() {
  $('#customRange').on('input', function() {
    $('.rot-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
    updatePlot(this.value, 0)
  });

  $('#customRange').prop('disabled', false);
}

function registerReset() {
  $('#reset').on('click', function(evt) {
    $('#customRange').val(0);
    // need to explicitly trigger input event
    $('#customRange').trigger('input');
  });

  $('#reset').prop('disabled', false);
}

function getLimits(base, line){
  function inCube(p) {
    if (p[0] >= 0 && p[0] <= 1 && p[1] >= 0 && p[1] <= 1 && p[2] >= 0 && p[2] <= 1)
      return true;
    return false;
  }

  var Tr0 = -base[0]/line[0]; // R=0
  var Tr1 = (1-base[0])/line[0];
  var Tg0 = -base[1]/line[1];
  var Tg1 = (1-base[1])/line[1];
  var Tb0 = -base[2]/line[2];
  var Tb1 = (1-base[2])/line[2];

  var hits = [Tr0, Tr1, Tg0, Tg1, Tb0, Tb1];
  var res = [];

  for (var i = 0; i < hits.length; i++) {
    var p = math.add(base, math.multiply(line, hits[i]));

    // override numerical precision issue
    if (i == 0) p[0] = 0;
    else if (i == 1) p[0] = 1;
    else if (i == 2) p[1] = 0;
    else if (i == 3) p[1] = 1;
    else if (i == 4) p[2] = 0;
    else p[2] = 1; // i == 5

    if (inCube(p)) {
      res.push(hits[i])
    }
  }

  return res.sort();
}

function genTestColor(mode) {
  var line_RGB = state.test_line_rgb;
  var testColor;

  var hits = getLimits(state.baseColor.v_rgb, line_RGB);
  state.scale = (state.dir == 1) ? Math.min(state.scale, hits[1]) : Math.min(state.scale, Math.abs(hits[0]));

  var target = math.add(state.baseColor.v_rgb, math.multiply(line_RGB, state.dir * state.scale));
  testColor = new colorObj(target, 'v_rgb');

  if (mode == 0) {
    // sample in xy space using equi-luminance (for trichromats)
    var baseLum = state.baseColor.xyz[1]; // the Y channel
    var targetLum = testColor.xyz[1];
    var mag = baseLum / targetLum;
    testColor = new colorObj(math.multiply(testColor.xyz, mag), 'xyz');
  }

  return testColor;
}

function testOneColor(random) {
  // set all four colors
  state.testColor = genTestColor(1);
  //random = false;
  state.testId = random ? Math.floor(Math.random() * 4) : 0;
  for (var i = 0; i <= 3; i++) {
    if (i == state.testId) state.colors[i] = state.testColor;
    else state.colors[i] = state.baseColor;
  }

  updatePlot(0, 3);
}

function setupNextColor() {
  // briefly blank the colors to reset the visual field
  var bg_color = $('#patches').css('background-color');
  $('#s11').css('background-color', bg_color);
  $('#s12').css('background-color', bg_color);
  $('#s13').css('background-color', bg_color);
  $('#s14').css('background-color', bg_color);

  $('#customRange').val(0);
  $('.rot-label').html('Rotation Angle (Degree): 0&#176;')
  //$('#customRange').prop('disabled', true);
  $('#customRange').css('visibility', 'hidden');
  $('#s11, #s12, #s13, #s14').unbind("click");

  $('#c11').css('zIndex', '10');
  let start = Date.now();
  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
  
    if (timePassed >= 300) {
      clearInterval(timer);
      $('#c11').css('zIndex', '-10');
      context.clearRect(0, 0, canvas.width, canvas.height);

      testOneColor(true);
	  // TODO: previously we toggle enable/disable of the range bar, but we now
	  // toggle visibility, because the distest app doesn't want the range bar
	  // during dots. need to have a better logic to reconcile demo and distest.
      //$('#customRange').prop('disabled', false);
      $('#customRange').css('visibility', 'visible');

	  // TODO: this always bind click even if an app uses keyboard. need a
	  // better logic, maybe specify keyboard vs. mouse mode at the beginning.
      $('#s11, #s12, #s13, #s14').bind("click", getAnswer);
      return;
    }
  
    createDots();
  }, 20);
}

var getAnswer = function(number) {
  var correct = true;
  var rev = false;

  state.ans_start_cb();

  state.numTrials++;
  var answer = Number.isInteger(number) ? number : Number(this.id[2]);
  if (answer != (state.testId + 1))
    correct = false;

  if ((!correct && (state.lastAns == 1)) ||
      (correct && (state.lastAns == 0))) { // reversal
    rev = true;
    state.scalesAtRevs.push(state.scale);
    state.numRevs++;
  }
  state.lastAns = correct;

  // enter phase 2 upon third reversal or when we will hit the baseColor using
  // the original step size.  use third reversal so that if we have an
  // incidental incorrect response very early the exp won't be dragged on
  // forever. we average the last three reversals to get the threshold so the
  // first three reversals get ignored anyways.  why third not the second?
  // first rev is incorrect, so second rev is correct. we want to enter phase 2
  // upon an incorrect response.
  if ((state.numRevs == 3) ||
      ((state.numRevs < 3) && ((state.scale - state.step) <= 0)))
    state.phase = 2;
  // in phase 2 we continuously adjust step size
  if (state.phase == 2)
    state.adjustStep();

  if (!correct) { // 1-up
    state.scale += state.step;
    state.numRight = 0; // reset numRight upon an incorrect answer
  } else if (state.numRevs < 3) { // 1-down before third reversal
    state.scale = Math.max(0, state.scale - state.step);
  } else { // 2-down
    state.numRight++;
    if (state.numRight == 2) {
      state.scale = Math.max(0, state.scale - state.step);
      state.numRight = 0;
    }
  }

  state.ans_finish_cb(correct, rev);

  if (state.numRevs == 2) {
    // terminate
    state.test_finish_cb();
  } else {
    setupNextColor();
  }
}

class pageObj {
  constructor(color_space) {
    this.init = false;

    // TODO: for now these three sim related vars are ignored when not doing simulation, but type is still useful when using real stimuli because we want to know the participant's blindness type for dichromatic gamut mapping
    this.simMethod = null; // 0 for Brettel 1997 (two planes) and 1 for Viénot 1999 (one plane)
    this.type = null; // 0 for P, 1 for D, 2 for T
    this.sim = null;

    this.hassRGB = false;
    this.hasP3 = false;
    this.hasRec2020 = false;
    this.hasHDR = false;
    this.color_supports = null;
    if (color_space == 'srgb')
      this.cs = 0;
    else if (color_space == 'p3')
      this.cs = 1;
    else if (color_space == 'rec2020') // no support for this yet
      this.cs = 2;

    this.test_color_support();
  }

  // https://dotnettutorials.net/lesson/jquery-id-selector/#:~:text=getElementById()%20will%20throw%20an,document.
  // JavaScript’s document.getElementById() will throw an error if the specified element is not found. But $( ‘ID selector’ ) will not throw an error at all. jQuery will return only a jQuery object with zero elements.
  // TODO: take IDs as inputs
  displayConfig() {
    $('#usedcs').html(this.cs ? 'Display P3' : 'sRGB');
    $('#usedbd').html(this.bitdepth);
    $('#usedxyz').html(color_consts.useJV ? 'Judd-Vos Modified XYZ' : 'CIE 1931 XYZ');
    $('#usedlms').html(color_consts.useJV ? 'Smith & Pokorny (1975) 2-deg' : 'Hunt-Pointer-Estevez D65-adapted');
    $('#bsrgb').html(this.color_supports.srgb_b ? '&#10003;' : '');
    $('#bp3').html(this.color_supports.p3_b ? '&#10003;' : '');
    $('#b2020').html(this.color_supports.rec2020_b ? '&#10003;' : '');
    $('#dsrgb').html(this.color_supports.srgb_d ? '&#10003;' : '');
    $('#dp3').html(this.color_supports.p3_d ? '&#10003;' : '');
    $('#d2020').html(this.color_supports.rec2020_d ? '&#10003;' : '');
  }

  configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns, showConfig) {
    registerSlider();
    registerReset();
    registerSimMode();
    registerPickType();
    registerPickSimMethod();
    registerGetAns();
  
    this.init = true;

    if (showConfig) this.displayConfig();
  }

  test_color_support() {
    // https://developer.chrome.com/articles/high-definition-css-color-guide/#checking-for-gamut-and-color-space-support
    // This checks browser support of the css syntax
    var srgb_browser = CSS.supports('background: color(srgb 1 1 1)');
    var p3_browser = CSS.supports('background: color(display-p3 1 1 1)');
    var rec2020_browser = CSS.supports('background: color(rec2020 1 1 1)');
    
    // This checks display support (using the current ICC profile)
    var srgb_display = window.matchMedia('(color-gamut: srgb)').matches;
    var p3_display = window.matchMedia('(color-gamut: p3)').matches;
    var rec2020_display = window.matchMedia('(color-gamut: rec2020)').matches;

    this.color_supports = {srgb_b: srgb_browser,
                           p3_b: p3_browser,
                           rec2020_b: rec2020_browser,
                           srgb_d: srgb_display,
                           p3_d: p3_display,
                           rec2020_d: rec2020_display,
                          };
  
    this.hassRGB = srgb_browser && srgb_display;
    this.hasP3 = p3_browser && p3_display;
    this.hasRec2020 = rec2020_browser && rec2020_display;
    this.hasHDR = window.matchMedia('(dynamic-range: high)').matches;
  
    if (this.cs == 1 && !this.hasP3)
      this.cs = 0;
  }

  submit() {
    $('#customRange').val(0);
    $('.rot-label').html('Rotation Angle (Degree): 0&#176;');

    state.test_start_cb().then(() => testOneColor(true));
  }

  // TODO: true to assume that sRGB is always 8 bits?
  // TODO: can we query the exact depth?
  get bitdepth() {
    return (this.hasHDR && this.cs) ? 10 : 8;
  }
}

var page, state;

