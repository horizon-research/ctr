function updatePlot(theta, plotId_rgb, plotId_lab, plotId_xy, action) {
  // |action|:
  // 0: rotate (slider)
  // 1: show simulation/actual colors
  // 2: pick simulation algorithm (1 vs. 2 planes)
  // 3: submit
  // 4: pick blindness type

  function update_rgb(rotColors_css, simColors_css) {
    var rgb_plot = document.getElementById(plotId_rgb);

    var rotPoints_RGB = math.transpose(state.rotColorsMapped.map(c => c.v_rgb));
    var simPoints_RGB = math.transpose(state.simColors.map(c => c.v_rgb));

    // update actual colors
    var data_update = {'x': [rotPoints_RGB[0]], 'y': [rotPoints_RGB[1]], 'z': [rotPoints_RGB[2]],
                       'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(rgb_plot, data_update, {}, [13]);

    // update simulated colors
    data_update = {'x': [simPoints_RGB[0]], 'y': [simPoints_RGB[1]], 'z': [simPoints_RGB[2]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(rgb_plot, data_update, {}, [14]);
  }

  function update_lab(rotColors_css, simColors_css) {
    var lab_plot = document.getElementById(plotId_lab);

    // update actual colors
    var rotPoints_Lab = math.transpose(state.rotColorsMapped.map(c => c.lab));
    data_update = {'x': [rotPoints_Lab[1]], 'y': [rotPoints_Lab[2]], 'z': [rotPoints_Lab[0]],
                   'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(lab_plot, data_update, {}, [0]);

    // update simulated colors
    var simPoints_Lab = math.transpose(state.simColors.map(c => c.lab));
    data_update = {'x': [simPoints_Lab[1]], 'y': [simPoints_Lab[2]], 'z': [simPoints_Lab[0]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(lab_plot, data_update, {}, [1]);
  }

  function update_xy(rotColors_css, simColors_css) {
    var xy_plot = document.getElementById(plotId_xy);

    var rotPoints_xy = math.transpose(state.rotColorsMapped.map(c => c.xy));
    data_update = {'x': [rotPoints_xy[0]], 'y': [rotPoints_xy[1]],
                   'marker.color': [rotColors_css], 'text': [rotColors_css]};
    Plotly.update(xy_plot, data_update, {}, [5]);

    var simPoints_xy = math.transpose(state.simColors.map(c => c.xy));
    data_update = {'x': [simPoints_xy[0]], 'y': [simPoints_xy[1]],
                   'marker.color': [simColors_css], 'text': [simColors_css]};
    Plotly.update(xy_plot, data_update, {}, [6]);
  }

  /* update iso-chrome planes/lines visibility */
  function update_legends(update_xy, update_rgb) {
    var rgb_plot = document.getElementById(plotId_rgb);
    var xy_plot = document.getElementById(plotId_xy);

    if (action == 2 || action == 3 || action == 4) {
      if (page.type == 0 || page.type == 1) { // P and D
        if (page.simMethod == 0) { // 2-plane {
          data_update = {'visible': ['legendonly', false, false, false,
              (page.type==0)?'legendonly':false, (page.type==1)?'legendonly':false, false]};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': ['legendonly', 'legendonly', false, false, false, false, 'legendonly', false]};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        } else { // 1-plane
          data_update = {'visible': [false, false, 'legendonly', false,
              (page.type==0)?'legendonly':false, (page.type==1)?'legendonly':false, false]};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, false, false, 'legendonly', false, false, false]};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        }
      } else { // T
        if (page.simMethod == 0) { // 2-plane {
          data_update = {'visible': [false, 'legendonly', false, false, false, false, 'legendonly']};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, 'legendonly', 'legendonly', false, false, false, 'legendonly']};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        } else { // 1-plane
          data_update = {'visible': [false, false, false, 'legendonly', false, false, 'legendonly']};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, false, false, false, 'legendonly', false, false]};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
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
  var rotColors_css = state.rotColorsMapped.map(c => c.legacy_rgb_css);
  var simColors_css = state.simColors.map(c => c.legacy_rgb_css);

  if (page.showRGB) update_rgb(rotColors_css, simColors_css);
  if (page.showLab) update_lab(rotColors_css, simColors_css);
  if (page.showXy) update_xy(rotColors_css, simColors_css);
  update_legends(page.showXy, page.showRGB);

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
  //$('#n11').text(rotColors_css[0].srgb_name);
  //$('#n12').text(rotColors_css[1].srgb_name);
  //$('#n13').text(rotColors_css[2].srgb_name);
  //$('#n14').text(rotColors_css[3].srgb_name);
}

function registerSlider() {
  $('#customRange').on('input', function() {
    $('.rot-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
    updatePlot(this.value, 'rgbDiv', 'labDiv', 'xyDiv', 0)
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
  var line_RGB = state.confusion_lines_rgb[page.type];
  var testColor;

  if (mode == 0) {
    // sample in xy space using equi-luminance (for trichromats)
    var p0_RGB = math.add(state.baseColor.v_rgb, math.multiply(line_RGB, 0.2));
    var p0_xy = XYZ2xy(math.multiply(RGB2xyz, p0_RGB));
    var p1_xy = XYZ2xy(math.multiply(RGB2xyz, state.baseColor.v_rgb));
    var dir = normalize(math.subtract(p1_xy, p0_xy));

    var baseColor_xy = XYZ2xy(math.multiply(RGB2xyz, state.baseColor.v_rgb));
    var testColor_xy = math.add(baseColor_xy, math.multiply(dir, state.scale));
    var baseLum = math.multiply(RGB2xyz[1], state.baseColor.v_rgb);
    var mag = baseLum / testColor_xy[1];

    testColor = new colorObj(math.multiply(XYZ2RGB, math.multiply(testColor_xy.concat([1-math.sum(testColor_xy)]), mag)),
        'v_rgb');
  } else if (mode == 1) {
    // TODO: only have to do this once
    var hits = getLimits(state.baseColor.v_rgb, line_RGB);
    if (state.scale > hits[1]) state.scale = hits[1];
    testColor = new colorObj(math.add(state.baseColor.v_rgb, math.multiply(line_RGB, state.scale)),
        'v_rgb');
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

  updatePlot(0, 'rgbDiv', 'labDiv', 'xyDiv', 3);
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
  $('#customRange').prop('disabled', true);
  $('#s11, #s12, #s13, #s14').unbind("click");


  $('#s12').css('zIndex', '-1');
  $('#s13').css('zIndex', '-1');
  $('#s14').css('zIndex', '-1');
  let start = Date.now();
  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
  
    if (timePassed >= 1000) {
      clearInterval(timer);
      $('#s12').css('zIndex', '1');
      $('#s13').css('zIndex', '1');
      $('#s14').css('zIndex', '1');
      context.clearRect(0, 0, canvas.width, canvas.height);

      testOneColor(true);
      $('#customRange').prop('disabled', false);
      $('#s11, #s12, #s13, #s14').bind("click", getAnswer);
      return;
    }
  
    createBlueDots();
  }, 20);
}

var getAnswer = function(number) {
  var correct = true;
  var rev = false;

  // add a new result to the threshold plot
  var exp_plot = document.getElementById('expDiv');
  exp_plot.data[1].x.push(state.numTrials);
  exp_plot.data[1].y.push(state.scale);
  var data_update = {'x': [exp_plot.data[1].x], 'y': [exp_plot.data[1].y]};
  Plotly.update(exp_plot, data_update, {}, [1]);

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

  // reduce step size upon the first reversal or when we will hit the baseColor if using the original step size
  if ((state.numRevs == 1) || ((state.numRevs == 0) && ((state.scale - state.step) <= 0)))
    state.adjustStep();

  if (!correct) { // 1-up
    state.scale += state.step;
    state.numRight = 0; // reset numRight upon an incorrect answer
  } else if (state.numRevs == 0) { // 1-down before first reversal
    state.scale = Math.max(0, state.scale - state.step);
  } else { // 2-down
    state.numRight++;
    if (state.numRight == 2) {
      state.scale = Math.max(0, state.scale - state.step);
      state.numRight = 0;
    }
  }

  // restyle markers to better visualize results
  exp_plot.data[1].marker.color.push(correct ? '#63bf7d' : '#d61e49');
  exp_plot.data[1].marker.line.width.push(rev ? 2 : 0);
  data_update = {'marker.color': [exp_plot.data[1].marker.color],
                 'marker.line.width': [exp_plot.data[1].marker.line.width]};
  Plotly.update(exp_plot, data_update, {}, [1]);

  if (state.numRevs == 6) {
    // terminate
    threshold = math.mean(state.scalesAtRevs.slice(-3));

    // add threshold line
    data_update = {'x': [[0, 30]], 'y': [[threshold, threshold]]};
    var layout_update = {
      'annotations[0].visible': true,
      'annotations[0].text': 'threshold is:&nbsp;&nbsp;' + threshold.toFixed(4)
    };
    Plotly.update(exp_plot, data_update, layout_update, [0]);

    // show marker legends
    data_update = {'visible': [true, true, true]};
    Plotly.update(exp_plot, data_update, {}, [2, 3, 4]);

    $('#expDiv').trigger('finish');
  } else {
    setupNextColor();
  }
}

class pageObj {
  constructor(color_space) {
    this._init = false;
    this._simMethod = null; // 0 for Brettel 1997 (two planes) and 1 for Viénot 1999 (one plane)
    this._type = null; // 0 for P, 1 for D, 2 for T
    this._sim = null;
    this._hassRGB = false;
    this._hasP3 = false;
    this._hasRec2020 = false;
    this._hasHDR = false;
    this._color_supports = null;
    this._cs = color_space; // 0 for sRGB, 1 for P3, 2 for Rec2020
    this._showXy = false;
    this._showRGB = false;
    this._showLab = false;
    this._showExp = false;

    this.test_color_support();
  }

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

  configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns,
      showXy, showRGB, showLab, showExp, showConfig, rows=null) {
    registerSlider();
    registerReset();
    registerSimMode();
    registerPickType();
    registerPickSimMethod();
    registerGetAns();
  
    this.init = true;
  
    // initial plot with no meaningful data
    this.showXy = showXy;
    this.showRGB = showRGB;
    this.showLab = showLab;
    this.showExp = showExp;
    plotXy('xyDiv', rows);
    plotRGB('rgbDiv');
    plotLab('labDiv');
    plotExp('expDiv');

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

    this._color_supports = {srgb_b: srgb_browser,
                            p3_b: p3_browser,
                            rec2020_b: rec2020_browser,
                            srgb_d: srgb_display,
                            p3_d: p3_display,
                            rec2020_d: rec2020_display
                           };
  
    this.hassRGB = srgb_browser && srgb_display;
    this.hasP3 = p3_browser && p3_display;
    this.hasRec2020 = rec2020_browser && rec2020_display;
    this.hasHDR = window.matchMedia('(dynamic-range: high)').matches;
  
    if (this.cs == 1 && !this.hasP3)
      this.cs = 0;
  }

  submit(color) {
    // set the base color.
    state.baseColor = color;
  
    $('#customRange').val(0);
    $('.rot-label').html('Rotation Angle (Degree): 0&#176;');
  
    testOneColor(true);
  }

  // TODO: true to assume that sRGB is always 8 bits?
  // TODO: can we query the exact depth?
  get bitdepth() {
    return (this.hasHDR && this.cs) ? 10 : 8;
  }

  get color_supports() {
    return this._color_supports;
  }

  get init() {
    return this._init;
  }
  set init(v) {
    this._init = v;
  }

  get simMethod() {
    return this._simMethod;
  }
  set simMethod(v) {
    this._simMethod = v;
  }

  get type() {
    return this._type;
  }
  set type(v) {
    this._type = v;
  }

  get sim() {
    return this._sim;
  }
  set sim(v) {
    this._sim = v;
  }

  get hassRGB() {
    return this._hassRGB;
  }
  set hassRGB(v) {
    this._hassRGB = v;
  }

  get hasP3() {
    return this._hasP3;
  }
  set hasP3(v) {
    this._hasP3 = v;
  }

  get hasRec2020() {
    return this._hasRec2020;
  }
  set hasRec2020(v) {
    this._hasRec2020 = v;
  }

  get hasHDR() {
    return this._hasHDR;
  }
  set hasHDR(v) {
    this._hasHDR = v;
  }

  get cs() {
    return this._cs;
  }
  set cs(v) {
    this._cs = v;
  }

  get showXy() {
    return this._showXy;
  }
  set showXy(v) {
    this._showXy = v;
  }

  get showRGB() {
    return this._showRGB;
  }
  set showRGB(v) {
    this._showRGB = v;
  }

  get showLab() {
    return this._showLab;
  }
  set showLab(v) {
    this._showLab = v;
  }

  get showExp() {
    return this._showExp;
  }
  set showExp(v) {
    this._showExp = v;
  }
}

var page, state;

