function quantize(value, bitdepth = 8) {
  return Math.round(value * (Math.pow(2, bitdepth) - 1));
}

function applyGamma(color) {
  var out;

  if (color <= 0.0031308) out = 12.92 * color;
  else out = 1.055 * Math.pow(color, 1/2.4) - 0.055;

  return out;
}

// remove gamma from a normalized sRGB color
function removeGamma(color) {
  var out;

  if (color <= 0.04045) out = color / 12.92;
  else out = Math.pow((color + 0.055) / 1.055, 2.4);

  return out;
}

function normalize(vec) {
  return math.divide(vec, math.norm(vec));
}

function project(colors_LMS) {
  // in input each column is a color

  if (page.simMethod == 1) {
    // one plane
    return math.multiply(state.proj_mat[page.type], colors_LMS);
  } else {
    // two planes
    var outColors1 = math.multiply(state.proj_mat[page.type], colors_LMS);
    var outColors2 = math.multiply(state.proj_mat[page.type + 3], colors_LMS);
    var outColors = [];

    var whiteLMS = color_consts.aEEW_lms; // EEW is used as white
    var wL = whiteLMS[0], wM = whiteLMS[1], wS = whiteLMS[2];

    for (var i = 0; i < colors_LMS[0].length; i++) {
      var L = colors_LMS[0][i];
      var M = colors_LMS[1][i];
      var S = colors_LMS[2][i];

      if (page.type == 0) {
        if (S/M < wS/wM) mask = 0;
        else mask = 1;
      } else if (page.type == 1) {
        if (S/L < wS/wL) mask = 0;
        else mask = 1;
      } else {
        if (M/L < wM/wL) mask = 0;
        else mask = 1;
      }

      if (mask == 0) outColors.push(math.transpose(outColors2)[i]);
      else outColors.push(math.transpose(outColors1)[i]);
    }

    return math.transpose(outColors);
  }
}

function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

function dichromatic_gamut_mapping(colors, line, mode) {
  if (mode == 0) return colors;

  // mode:
  // 0: clipping
  // 1: confusion line

  function inCube(p) {
    //if (p[0] >= 0 && p[0] <= 1 && p[1] >= 0 && p[1] <= 1 && p[2] >= 0 && p[2] <= 1)
    if (p[0] >= 0 && p[1] >= 0 && p[2] >= 0)
      return true;
    return false;
  }

  function reduce_lum(p) {
    if (Math.max(...p) > 1) {
      return math.divide(p, Math.max(...p));
    }

    return p;
  }

  var mapped_colors = [];

  if (mode == 1) {
    colors.forEach((color) => {
      for (var j = 0; j < 3; j++) {
        color[j] = clamp(color[j], 0, 1)
      }
      mapped_colors.push(color);
    });

    return mapped_colors;
  }

  // a dichromatic gamut mapping algorithm, which has two components: 1. move
  // an OOG gamut along its confusion line until it hits the cube; this mapping
  // doesn't change the color perception of a dichromate 2. if a color is OOG
  // simply because its absolute luminance is too high, we reduce its
  // luminance; this mapping will reduce the brightness of the color by a
  // dichromate
  for (base of colors) {
    if (inCube(base)) {
      mapped_colors.push(base);
      continue;
    }

    var hit = Number.MAX_VALUE;
    var hit_pos = [0, 0, 0];

    var Tr0 = -base[0]/line[0]; // R=0
    var Tr1 = (1-base[0])/line[0];
    var Tg0 = -base[1]/line[1];
    var Tg1 = (1-base[1])/line[1];
    var Tb0 = -base[2]/line[2];
    var Tb1 = (1-base[2])/line[2];

    var hits = [Tr0, Tr1, Tg0, Tg1, Tb0, Tb1];

    for (var i = 0; i < hits.length; i++) {
      var p = math.add(base, math.multiply(line, hits[i]));

      // override numerical precision issue
      if (i == 0) p[0] = 0;
      else if (i == 1) p[0] = 1;
      else if (i == 2) p[1] = 0;
      else if (i == 3) p[1] = 1;
      else if (i == 4) p[2] = 0;
      else p[2] = 1; // i == 5

      if (inCube(p) && Math.abs(hits[i]) < hit) {
        // pick the one with the absolute shortest t
        hit = Math.abs(hits[i]);
        hit_pos = reduce_lum(p);
      }
    }

    mapped_colors.push(hit_pos);
  }

  return mapped_colors;
}

class colorObj {
  constructor(value, space) {
    this._value = value; // an array
    if (space == 'v_rgb') {
      this._space = page.cs ? 'linear_p3' : 'linear_srgb';
    } else {
      this._space = space;
    }
    this._srgb = null;
    this._norm_srgb = null;
    this._linear_srgb = null;
    this._xyz = null;
    this._xy = null;
    this._lms = null;
    this._lab = null;
    this._p3 = null;
    this._norm_p3 = null;
    this._linear_p3 = null;
    this._bitdepth = page.bitdepth;

    // _space:
    // norm_srgb: [0, 1] with gamma; this is 'srgb' in CSS Color L4/L5
    // linear_srgb: [0, 1] without gamma
    // srgb: [0, 255] with gamma
    if (this.space == 'srgb') {
      this._linear_srgb = this.value.map(c => removeGamma(c/255));
    } else if (this.space == 'linear_srgb') {
      this._linear_srgb = this.value;
    } else if (this.space == 'norm_srgb') {
      this._linear_srgb = this.value.map(c => removeGamma(c));
    } else if (this.space == 'lms') {
      this._linear_srgb = math.multiply(color_consts.LMS_to_lin_sRGB, this.value);
    } else if (this.space == 'xyz') {
      this._linear_srgb = math.multiply(color_consts.XYZ_to_lin_sRGB, this.value);
    } else if (this.space == 'linear_p3') {
      this._linear_srgb = math.multiply(color_consts.lin_P3_to_lin_sRGB, this.value);
    } else if (this.space == 'norm_p3') {
      this._linear_srgb = this.value.map(c => math.multiply(color_consts.lin_P3_to_lin_sRGB, removeGamma(c)));
    } else if (this.space == 'p3') {
      this._linear_srgb = this.value.map(c => math.multiply(color_consts.lin_P3_to_lin_sRGB, removeGamma(c/255)));
    }
    this._norm_srgb = this._linear_srgb.map(c => applyGamma(c));
    this._srgb = this._norm_srgb.map(c => quantize(c, this._bitdepth)); 
    this._lms = math.multiply(color_consts.lin_sRGB_to_LMS, this._linear_srgb);
    this._xyz = math.multiply(color_consts.lin_sRGB_to_XYZ, this._linear_srgb);
    this._xy = math.divide(this._xyz, math.sum(this._xyz)).slice(0, 2);
    this._linear_p3 = math.multiply(color_consts.lin_sRGB_to_lin_P3, this._linear_srgb);
    this._norm_p3 = this._linear_p3.map(c => applyGamma(c));
    this._p3 = this._linear_p3.map(c => quantize(applyGamma(c), this._bitdepth));
    // TODO: this is problematic since Lab is defined over CIE 1931 XYZ but we might use JV XYZ
    // also we don't allow create colorObj in Lab
    var c = new Color("srgb-linear", this._linear_srgb);
    this._lab = c.lab_d65;
  }

  get space() {
    return this._space;
  }

  get value() {
    return this._value;
  }

  // an interface for either linear_srgb or linear_p3;
  get v_rgb() {
    return page.cs ? this.linear_p3 : this.linear_srgb;
  }

  get norm_srgb() {
    return this._norm_srgb;
  }

  get linear_srgb() {
    return this._linear_srgb;
  }

  get v_quan_rgb() {
    return page.cs ? this.p3 : this.srgb;
  }

  get srgb() {
    return this._srgb;
  }

  get xyz() {
    return this._xyz;
  }

  get xy() {
    return this._xy;
  }

  get lms() {
    return this._lms;
  }

  get lab() {
    return this._lab;
  }

  get p3() {
    return this._p3;
  }

  get norm_p3() {
    return this._norm_p3;
  }

  get linear_p3() {
    return this._linear_p3;
  }

  get v_rgb_css() {
    return page.cs ? this.p3_css : this.linear_srgb_css;
  }

  // there is no support for linear P3 in CSS yet
  get p3_css() {
    return 'color(display-p3 '+
        this.norm_p3[0].toString()+' '+
        this.norm_p3[1].toString()+' '+
        this.norm_p3[2].toString()+')';
  }

  get linear_srgb_css() {
    return 'color(srgb-linear '+
        this.linear_srgb[0].toString()+' '+
        this.linear_srgb[1].toString()+' '+
        this.linear_srgb[2].toString()+')';
  }

  get srgb_css() {
    return 'color(srgb '+
        this.norm_srgb[0].toString()+' '+
        this.norm_srgb[1].toString()+' '+
        this.norm_srgb[2].toString()+')';
  }

  get legacy_rgb_css() {
    return 'rgb('+
        this.srgb[0].toString()+', '+
        this.srgb[1].toString()+', '+
        this.srgb[2].toString()+')';
  }

  get legacy_hex_css() {
    // It converts an array [255, 255, 255] to '#FFFFFF'
    function srgbToHex(c) {
      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
    
      return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
    }

    return srgbToHex(this.srgb);
  }

  get srgb_name() {
    // https://chir.ag/projects/ntc/
    var n_match  = ntc.name(this.legacy_hex_css);
    //var n_rgb        = n_match[0]; // This is the RGB value of the closest matching color
    var n_name       = n_match[1]; // This is the text string for the name of the match
    //var n_exactmatch = n_match[2]; // True if exact color match, False if close-match
    return n_name;
  }

}

// contains the state one baseColor test (multiple testColors)
class discTestState {
  constructor() {
    this._baseColor = null; // one single color
    this._testColor = null; // one single color
    this._colors = []; // four initial colors (three test + one base) without rotation; one color per row
    this._rotColors = []; // rotated colors; one color per row
    this._rotColorsMapped = []; // rotated colors after gamut mapping; one color per row
    this._simColors = []; // simulated dichromatic colors; one color per row
    this._scalesAtRevs = [];
    this._scale = 0.1; // must be positive. TODO: need to figure out how to better set this
    this._numRight = 0;
    this._numRevs = 0;
    this._lastAns = true; // just so that if the first respose is incorrect it gets counted as a reversal
    this._numTrials = 1;
    this._step = 0.02; // TODO: need to figure out how to better set this
    this._proj_mat = null;
    this._dir = 1; // 1 for add 0 for sub

    // compute once and cache for later
    this._confusion_lines_lin_srgb = this.get_confusion_lines_lin_srgb();
    this._confusion_lines_lin_p3 = this.get_confusion_lines_lin_p3();
    this._confusion_lines_xy = this.get_confusion_lines_xy();
  }

  get_proj_mat() {
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

  get_confusion_lines_xy() {
    var lines = [];

    for (var t of [0, 1, 2]) {
      for (var p of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
        // using srgb is just fine, since the lines in xy won't change
        var line_RGB = this.confusion_lines_rgb[t];
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
    return page.cs ? this._confusion_lines_lin_p3 : this._confusion_lines_lin_srgb;
  }

  get confusion_lines_xy() {
    return this._confusion_lines_xy;
  }

  adjustStep() {
	// TODO: the idea is to make sure in each step at least one channel changes
	// by setting the step size based on the first reversal color, but the
	// implementation using deltaLUT is a hack and for now works only for sRGB
    var line_RGB = this.confusion_lines_rgb[page.type];

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
    var mapped_colors_value = dichromatic_gamut_mapping(colors_value, this.confusion_lines_rgb[page.type], mode);

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

  get proj_mat() {
    return this._proj_mat;
  }
  set proj_mat(v) {
    this._proj_mat = v;
  }

  get dir() {
    return this._dir;
  }
  set dir(v) {
    this._dir = v;
  }
}

