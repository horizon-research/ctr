function updatePlot(theta, plotId_rgb, plotId_lab, plotId_xy, action) {
  // |action|:
  // 0: rotate (slider)
  // 1: show simulation/actual colors
  // 2: pick simulation algorithm (1 vs. 2 planes)
  // 3: submit
  // 4: pick blindness type

  var rgb_plot = document.getElementById(plotId_rgb);
  var lab_plot = document.getElementById(plotId_lab);
  var xy_plot = document.getElementById(plotId_xy);

  function update_rgb(rotColors_css, simColors_css) {
    var rotPoints_RGB = math.transpose(state.rotColorsMapped.map(c => c.linear_srgb));
    var simPoints_RGB = math.transpose(state.simColors.map(c => c.linear_srgb));

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
    if (action == 2 || action == 3 || action == 4) {
      if (type == 0 || type == 1) { // P and D
        if (simMethod == 0) { // 2-plane {
          data_update = {'visible': ['legendonly', false, false, false,
              (type==0)?'legendonly':false, (type==1)?'legendonly':false, false]};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': ['legendonly', 'legendonly', false, false, false, false, 'legendonly', false]};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        } else { // 1-plane
          data_update = {'visible': [false, false, 'legendonly', false,
              (type==0)?'legendonly':false, (type==1)?'legendonly':false, false]};
          if (update_xy) Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
          data_update = {'visible': [false, false, false, false, 'legendonly', false, false, false]};
          if (update_rgb) Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
        }
      } else { // T
        if (simMethod == 0) { // 2-plane {
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
  state.simulate();

  // Convention: in |Points| each color is a column and in |Colors| each color is a row
  var rotColors_css = state.rotColorsMapped.map(c => c.legacy_rgb_css);
  var simColors_css = state.simColors.map(c => c.legacy_rgb_css);

  //update_rgb(rotColors_css, simColors_css);
  //update_lab(rotColors_css, simColors_css);
  update_xy(rotColors_css, simColors_css);

  update_legends(true, false);

  /* update square colors */
  if (sim) {
    var temp = state.simColors.map(c => c.linear_srgb_css);
    $('#s11').css('background-color', temp[0]);
    $('#s12').css('background-color', temp[1]);
    $('#s13').css('background-color', temp[2]);
    $('#s14').css('background-color', temp[3]);
  } else {
    var temp = state.rotColorsMapped.map(c => c.linear_srgb_css);
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
  //$('#n11').text(name1);
  //$('#n12').text(name2);
  //$('#n13').text(name3);
  //$('#n14').text(name4);
}

function registerSlider(id) {
  //$('input[type=range]').on('input', function() {
  $(id).on('input', function() {
    $('.rot-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
    updatePlot(this.value, 'rgbDiv', 'labDiv', 'xyDiv', 0)
  });
}

function registerSimMode() {
  $('input[type=radio][name=sim]').change(function() {
    if (this.id == 'yes') {
      sim = true;
    } else {
      sim = false;
    }

    if (init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 1);
  });
}

function registerPickType() {
  $('input[type=radio][name=pick]').change(function() {
    if (this.id == 'pickp') {
      type = 0;
    } else if (this.id == 'pickd') {
      type = 1;
    } else if (this.id == 'pickt') {
      type = 2;
    }

    // automatically update colors and re-plot
    if (init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 4);
  });
}

function registerPickSimMethod() {
  $('input[type=radio][name=method]').change(function() {
    if (this.id == 'm1') {
      // one plane
      simMethod = 1;
    } else {
      // two planes
      simMethod = 0;
    }
    proj_mat = get_proj_mat();

    // automatically update colors and re-plot
    if (init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 2);
  });
}

function registerReset(resetId) {
  $(resetId).on('click', function(evt) {
    $('#customRange').val(0);
    // need to explicitly trigger input event
    $('#customRange').trigger('input');
  });
}

function genTestColor(mode) {
  // TODO: the direction should be sampled
  var line_RGB = confusion_lines[1]; // D line in RGB
  var testColor;

  if (mode == 0) {
    // sample in xy space using equi-luminance (for trichromats)
    var p0_RGB = math.add(state.baseColor.linear_srgb, math.multiply(line_RGB, 0.2));
    var p0_xy = XYZ2xy(math.multiply(RGB2xyz, p0_RGB));
    var p1_xy = XYZ2xy(math.multiply(RGB2xyz, state.baseColor.linear_srgb));
    var dir = normalize(math.subtract(p1_xy, p0_xy));

    var baseColor_xy = XYZ2xy(math.multiply(RGB2xyz, state.baseColor.linear_srgb));
    var testColor_xy = math.add(baseColor_xy, math.multiply(dir, state.scale));
    var baseLum = math.multiply(RGB2xyz[1], state.baseColor.linear_srgb);
    var mag = baseLum / testColor_xy[1];

    testColor = new colorObj(math.multiply(XYZ2RGB, math.multiply(testColor_xy.concat([1-math.sum(testColor_xy)]), mag)),
        'linear_srgb');
  } else if (mode == 1) {
    // sample in RGB
    testColor = new colorObj(math.add(state.baseColor.linear_srgb, math.multiply(line_RGB, state.scale)),
        'linear_srgb');
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

    //names[i] = sRGB2Name(RGB2sRGB(state.colors[i], true));
  }

  updatePlot(0, 'rgbDiv', 'labDiv', 'xyDiv', 3);
}

function submit(rangeId) {
  // set the base color.
  //var baseColor_sRGB_linear = sRGB2RGB([0.85, 0.5, 0.25]);
  var baseColor_sRGB_linear = new colorObj([0.85, 0.5, 0.25], 'norm_srgb');
  state = new discTestState(baseColor_sRGB_linear);

  $(rangeId).val(0);
  $('.rot-label').html('Rotation Angle (Degree): 0&#176;');

  testOneColor(true);
}

function setupNextColor() {
  $("#p1").prop('checked', false); 
  $("#p2").prop('checked', false); 
  $("#p3").prop('checked', false); 
  $("#p4").prop('checked', false); 

  // briefly blank the colors to reset the visual field
  $('#s11').css('background-color', 'rgb(248, 249, 250)');
  $('#s12').css('background-color', 'rgb(248, 249, 250)');
  $('#s13').css('background-color', 'rgb(248, 249, 250)');
  $('#s14').css('background-color', 'rgb(248, 249, 250)');

  $('#customRange').val(0);
  $('.rot-label').html('Rotation Angle (Degree): 0&#176;')
  $('#customRange').prop('disabled', true);
  setTimeout(() => {
    testOneColor(true);
    $('#customRange').prop('disabled', false);
  }, 1000); // caveat: this is async
}

function registerGetAns() {
  $('#s11, #s12, #s13, #s14').click(function() {
    var correct;
    var rev = false;

    // add a new result to the threshold plot
    var exp_plot = document.getElementById('expDiv');
    exp_plot.data[1].x.push(state.numTrials);
    exp_plot.data[1].y.push(state.scale);
    var data_update = {'x': [exp_plot.data[1].x], 'y': [exp_plot.data[1].y]};
    Plotly.update(exp_plot, data_update, {}, [1]);

    state.numTrials++;

    if (Number(this.id[2]) != (state.testId + 1)) {
      // wrong answer

      correct = false;
      if (state.lastAns == 1) { // reversal
        rev = true;
        state.scalesAtRevs.push(state.scale);
        state.numRevs++;
      }
      state.lastAns = 0;

      if (state.numRevs == 1)
        state.setStep2(); // calculate step2 at the first reversal (practically the first incorrect answer)
      state.scale += state.step2; // TODO: figure out what to do if the first response is incorrect
      state.numRight = 0; // reset numRight upon an incorrect answer
    } else {
      // right answer

      correct = true;
      if (state.lastAns == 0) { // reversal
        rev = true;
        state.scalesAtRevs.push(state.scale);
        state.numRevs++;
      }
      state.lastAns = 1;

      // 1 up 2 down (except before the first reversal)
      if (state.numRevs == 0) state.scale = Math.max(0, state.scale-state.step1);
      else {
        state.numRight++;
        if (state.numRight == 2) {
          state.scale = Math.max(0, state.scale-state.step2);
          state.numRight = 0;
        }
      }
    }
    //console.log(state.scale)

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
    } else {
      setupNextColor();
    }
  });
}

var init = false;
var simMethod; // 0 for Brettel 1997 (two planes) and 1 for Viénot 1999 (one plane)
var type; // 0 for P, 1 for D, 2 for T
var sim;
var state;

d3.csv('ciexyzjv.csv').then(function(rows){
  function unpack(rows, key, toNum) {
    return rows.map(function(row) {
        if (toNum == false) return row[key];
        else return parseFloat(row[key]);
      });
  }

  function range(start, end, stride) {
    return Array((end - start) / stride + 1).fill().map((_, idx) => start + idx*stride)
  }

  var stride = 5;

  wlen = unpack(rows, 'wavelength');
  var firstW = wlen[0];
  var lastW = wlen[wlen.length - 1];

  var x_data = range(firstW, lastW, stride);

  x_cmf = unpack(rows, 'x');
  y_cmf = unpack(rows, 'y');
  z_cmf = unpack(rows, 'z');

  var x_chrm = math.dotDivide(x_cmf, math.add(x_cmf, y_cmf, z_cmf));
  var y_chrm = math.dotDivide(y_cmf, math.add(x_cmf, y_cmf, z_cmf));
  var z_chrm = math.dotDivide(z_cmf, math.add(x_cmf, y_cmf, z_cmf));

  //var lms_cmf = math.multiply(xyz2lms, [x_cmf, y_cmf, z_cmf]);
  //lms_cmf = math.dotMultiply(lms_cmf, 20);

  var a475 = (475 - firstW) / stride;
  var a575 = (575 - firstW) / stride;
  var a485 = (485 - firstW) / stride;
  var a660 = (660 - firstW) / stride;

  // initial plot with no meaningful data
  plotXy('xyDiv', [x_chrm, y_chrm, z_chrm], wlen, a475, a575, a485, a660);
  //plotRGB('rgbDiv');
  //plotLab('labDiv');
  plotExp('expDiv');

  registerSlider('#customRange');
  registerSimMode();
  registerPickType();
  registerPickSimMethod();
  registerReset('#reset');
  registerGetAns();

  // init color blindness type
  $('#pickd').prop("checked", true).trigger('change');
  
  // init simulation method
  $('#m2').prop("checked", true).trigger('change');
  
  // choose to show actual colors
  $('#yes').prop("checked", true).trigger('change');
  
  // set the mode to play and update the plot with the initial setting
  $('input[type=radio][name=sim]').prop('disabled', false);
  $('input[type=radio][name=method]').prop('disabled', false);
  $('#customRange').prop('disabled', false);
  $('#reset').prop('disabled', false);
  submit('#customRange');
  init = true;
});

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tab = urlParams.get('tab')
$('#' + tab + '-tab').trigger('click');

// https://developer.chrome.com/articles/high-definition-css-color-guide/#checking-for-gamut-and-color-space-support
// This checks browser support of the css syntax
var srgb_browser = CSS.supports('background: color(srgb 1 1 1)');
var p3_browser = CSS.supports('background: color(display-p3 1 1 1)');
var rec2020_browser = CSS.supports('background: color(rec2020 1 1 1)');

// This checks display support (using the current ICC profile)
var srgb_display = window.matchMedia('(color-gamut: srgb)').matches;
var p3_display = window.matchMedia('(color-gamut: p3)').matches;
var rec2020_display = window.matchMedia('(color-gamut: rec2020)').matches;

$('#bsrgb').html(srgb_browser ? '&#10003;' : '');
$('#bp3').html(p3_browser ? '&#10003;' : '');
$('#b2020').html(rec2020_browser ? '&#10003;' : '');
$('#dsrgb').html(srgb_display ? '&#10003;' : '');
$('#dp3').html(p3_display ? '&#10003;' : '');
$('#d2020').html(rec2020_display ? '&#10003;' : '');
