// contains the state one baseColor test (multiple testColors)
class discTestState {
  constructor(baseColor, scale, start_cb, finish_cb, line=null) {
    this._baseColor = baseColor ; // one single color
    this._thresholdColor = null;
    this._testColor = null; // one single color
    this._colors = []; // four initial colors (three test + one base) without rotation; one color per row
    this._rotColors = []; // rotated colors; one color per row
    this._rotColorsMapped = []; // rotated colors after gamut mapping; one color per row
    this._simColors = []; // simulated dichromatic colors; one color per row
    this._scalesAtRevs = [];
    this._dir = (scale > 0) ? 1 : -1;
    this._scale = Math.abs(scale); // always positive to simplify adjusting steps; TODO: need to figure out how to better set this
    this._numRight = 0;
    this._numRevs = 0;
    this._lastAns = true; // just so that if the first respose is incorrect it gets counted as a reversal
    this._numTrials = 1;
    this._step = 0.02; // TODO: need to figure out how to better set this

    this._start_cb = start_cb; // called every page.submit
    this._finish_cb = finish_cb; // called every time a test terminates

    this._xy_plot = null;
    this._rgb_plot = null;
    this._lab_plot = null;
    this._exp_plot = null;

    // compute once and cache for later
    this._confusion_lines_lin_srgb = this.get_confusion_lines_lin_srgb();
    this._confusion_lines_lin_p3 = this.get_confusion_lines_lin_p3();
    this._confusion_lines_xy = this.get_confusion_lines_xy();

    this._custom_confusion_line = line; // this will be in linear_srgb since CMEs are done in srgb
  }

  get_confusion_lines_lin_srgb() {
    // vectors for confusion lines (derived from Sharma LUTs)
    //var p_line = [0.9795006397, -0.2013704401, 0.005333160206];
    //var d_line = [-0.8959739281, 0.4425391762, -0.03727999099];
    //var t_line = [0.1428342021, -0.1413451732, 0.9796019256];
  
    var p_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [1, 0, 0]));
    var d_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [0, 1, 0]));
    var t_line = normalize(math.multiply(color_consts.LMS_to_lin_sRGB, [0, 0, 1]));
  
    return [p_line, d_line, t_line];
  }

  get_confusion_lines_lin_p3() {
    var p_line = normalize(math.multiply(color_consts.LMS_to_lin_P3, [1, 0, 0]));
    var d_line = normalize(math.multiply(color_consts.LMS_to_lin_P3, [0, 1, 0]));
    var t_line = normalize(math.multiply(color_consts.LMS_to_lin_P3, [0, 0, 1]));
  
    return [p_line, d_line, t_line];
  }

  // TODO: this will be wrong if custom lines are used
  get_confusion_lines_xy() {
    var lines = [];

    for (var t of [0, 1, 2]) {
      for (var p of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
        // using srgb is just fine, since the lines in xy won't change
        var line_RGB = this._confusion_lines_lin_srgb[t];
        var p0_RGB = new colorObj(math.add(p, math.multiply(line_RGB, 0.2)), 'linear_srgb');
        var p0_xy = p0_RGB.xy;
        var p1_RGB = new colorObj(p, 'linear_srgb');
        var p1_xy = p1_RGB.xy;
        lines.push(normalize(math.subtract(p1_xy, p0_xy)));
      }
    }
  
    return lines;
  }

  get confusion_lines_rgb() {
    return this._custom_confusion_line ? this._custom_confusion_line : (page.cs ? this._confusion_lines_lin_p3[page.type] : this._confusion_lines_lin_srgb[page.type]);
  }

  get confusion_lines_xy() {
    return this._confusion_lines_xy;
  }

  get proj_mat() {
    // https://daltonlens.org/understanding-cvd-simulation/
    if (page.simMethod == 1) {
      // Viénot 1999 (one plane); an approximation of Brettel 1997 (two planes).
      // for protanopia and deuteranopia they use the black-blue-yellow-white plane;
      // for tritanopia the paper didn't say what to do here we simply use black-red-cyan-white plane.
      var RGBBlue = (new colorObj([0, 0, 1], 'v_rgb')).lms;
      var RGBRed = (new colorObj([1, 0, 0], 'v_rgb')).lms;
      var RGBYellow = (new colorObj([1, 1, 0], 'v_rgb')).lms;
      var RGBCyan = (new colorObj([0, 1, 1], 'v_rgb')).lms;
  
      var p_norm1 = math.cross(RGBBlue, RGBYellow);
      var d_norm1 = p_norm1;
      var t_norm1 = math.cross(RGBRed, RGBCyan);
  
      var p_proj_mat = [[0, -p_norm1[1]/p_norm1[0], -p_norm1[2]/p_norm1[0]], [0, 1, 0], [0, 0, 1]];
      var d_proj_mat = [[1, 0, 0], [-d_norm1[0]/d_norm1[1], 0, -d_norm1[2]/d_norm1[1]], [0, 0, 1]];
      var t_proj_mat = [[1, 0, 0], [0, 1, 0], [-t_norm1[0]/t_norm1[2], -t_norm1[1]/t_norm1[2], 0]];
  
      return [p_proj_mat, d_proj_mat, t_proj_mat];
    } else {
      // Brettel 1997 (two planes).
      // in LMS space (transformed from JV-modified XYZ)
      var aWhite = color_consts.aEEW_lms; // (Brettel 97 uses EEW and Vienot 99 uses sRGBWhite)
  
      var p_norm1 = math.cross(aWhite, color_consts.a475_lms);
      var p_norm2 = math.cross(aWhite, color_consts.a575_lms);
      var d_norm1 = p_norm1;
      var d_norm2 = p_norm2;
      var t_norm1 = math.cross(aWhite, color_consts.a485_lms);
      var t_norm2 = math.cross(aWhite, color_consts.a660_lms);
  
      // the results are close to values calculated by https://daltonlens.org/understanding-cvd-simulation/
      var p_proj_mat1 = [[0, -p_norm1[1]/p_norm1[0], -p_norm1[2]/p_norm1[0]], [0, 1, 0], [0, 0, 1]]; // 475
      var d_proj_mat1 = [[1, 0, 0], [-d_norm1[0]/d_norm1[1], 0, -d_norm1[2]/d_norm1[1]], [0, 0, 1]]; // 475
      var t_proj_mat1 = [[1, 0, 0], [0, 1, 0], [-t_norm1[0]/t_norm1[2], -t_norm1[1]/t_norm1[2], 0]]; // 485
  
      var p_proj_mat2 = [[0, -p_norm2[1]/p_norm2[0], -p_norm2[2]/p_norm2[0]], [0, 1, 0], [0, 0, 1]]; // 575
      var d_proj_mat2 = [[1, 0, 0], [-d_norm2[0]/d_norm2[1], 0, -d_norm2[2]/d_norm2[1]], [0, 0, 1]]; // 575
      var t_proj_mat2 = [[1, 0, 0], [0, 1, 0], [-t_norm2[0]/t_norm2[2], -t_norm2[1]/t_norm2[2], 0]]; // 660
  
      return [p_proj_mat1, d_proj_mat1, t_proj_mat1, p_proj_mat2, d_proj_mat2, t_proj_mat2];
    }
  }

  adjustStep() {
	// TODO: the idea is to make sure in each step at least one channel changes
	// by setting the step size based on the first reversal color, but the
	// implementation using deltaLUT is a hack and for now works only for sRGB
    var line_RGB = this.confusion_lines_rgb;

    var deltaLUT = (page.bitdepth == 10) ? deltaLUT_10b : deltaLUT_8b;
    var deltaR = deltaLUT[this.testColor.v_quan_rgb[0]];
    var deltaG = deltaLUT[this.testColor.v_quan_rgb[1]];
    var deltaB = deltaLUT[this.testColor.v_quan_rgb[2]];
  
    this.step = Math.min(deltaR / Math.abs(line_RGB[0]),
                         deltaG / Math.abs(line_RGB[1]),
                         deltaB / Math.abs(line_RGB[2]));
  }

  // take in a set of colorObj (not a pure numerical array)
  geoTrans(transMat, fromColors) {
    var colors_in_linear_rgb = [fromColors[0].v_rgb,
                                fromColors[1].v_rgb,
                                fromColors[2].v_rgb,
                                fromColors[3].v_rgb]
    return math.multiply(transMat, math.transpose(colors_in_linear_rgb));
  }

  dichromatic_gamut_mapping(colors, mode) {
    var colors_value = colors.map(color => color.v_rgb);
    var mapped_colors_value = dichromatic_gamut_mapping(colors_value, this.confusion_lines_rgb, mode);

    this.rotColorsMapped = mapped_colors_value.map(c => new colorObj(c, 'v_rgb'));
  }

  rotate_colors(theta) {
    var u = 1/Math.sqrt(3)
    var cos = Math.cos(theta)
    var sin = Math.sin(theta)

    var rotMat = [
      [cos + u*u*(1-cos), u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin],
      [u*u*(1-cos)+u*sin, cos+u*u*(1-cos), u*u*(1-cos)-u*sin],
      [u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin, cos+u*u*(1-cos)]
    ];

    // TODO: rotated colors might be out of HVS gamut; we should black out those colors too
    // this is the actual position without mapping
    var rotated_colors_col = this.geoTrans(rotMat, this.colors);
    var rotated_colors_row = math.transpose(rotated_colors_col);

    this.rotColors = rotated_colors_row.map(c => new colorObj(c, 'v_rgb'));
  }

  simulate() {
    // simulate dichromatic color using current rotated mapped colors, which is what's actually displayed to users
    var colors_lms = this.rotColorsMapped.map(c => c.lms);
    var sim_colors_lms = math.transpose(project(math.transpose(colors_lms)));

    this.simColors = sim_colors_lms.map(c => new colorObj(c, 'lms'));
  }

  get scalesAtRevs() {
    return this._scalesAtRevs;
  }

  get colors() {
    return this._colors;
  }

  set baseColor(v) {
    this._baseColor = v;
  }
  get baseColor() {
    return this._baseColor;
  }

  get thresholdColor() {
    return this._thresholdColor;
  }
  set thresholdColor(v) {
    this._thresholdColor = v;
  }

  set rotColors(v) {
    this._rotColors = v;
  }
  get rotColors() {
    return this._rotColors;
  }

  set rotColorsMapped(v) {
    this._rotColorsMapped = v;
  }
  get rotColorsMapped() {
    return this._rotColorsMapped;
  }

  set simColors(v) {
    this._simColors = v;
  }
  get simColors() {
    return this._simColors;
  }

  set testColor(v) {
    this._testColor = v;
  }
  get testColor() {
    return this._testColor;
  }

  set scale(v) {
    this._scale = v;
  }
  get scale() {
    return this._scale;
  }

  set testId(v) {
    this._testId = v;
  }
  get testId() {
    return this._testId;
  }

  set numRight(v) {
    this._numRight = v;
  }
  get numRight() {
    return this._numRight;
  }

  set numRevs(v) {
    this._numRevs = v;
  }
  get numRevs() {
    return this._numRevs;
  }

  set lastAns(v) {
    this._lastAns = v;
  }
  get lastAns() {
    return this._lastAns;
  }

  set numTrials(v) {
    this._numTrials = v;
  }
  get numTrials() {
    return this._numTrials;
  }

  set step(v) {
    this._step = v;
  }
  get step() {
    return this._step;
  }

  get dir() {
    return this._dir;
  }
  set dir(v) {
    this._dir = v;
  }

  get start_cb() {
    return this._start_cb;
  }
  set start_cb(v) {
    this._start_cb = v;
  }

  get finish_cb() {
    return this._finish_cb;
  }
  set finish_cb(v) {
    this._finish_cb = v;
  }

  get xy_plot() {
    return this._xy_plot;
  }
  set xy_plot(v) {
    this._xy_plot = v;
  }

  get rgb_plot() {
    return this._rgb_plot;
  }
  set rgb_plot(v) {
    this._rgb_plot = v;
  }

  get lab_plot() {
    return this._lab_plot;
  }
  set lab_plot(v) {
    this._lab_plot = v;
  }

  get exp_plot() {
    return this._exp_plot;
  }
  set exp_plot(v) {
    this._exp_plot = v;
  }
}

