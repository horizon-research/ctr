var redColor = '#FF0000';
var greenColor = '#00FF00';
var blueColor = '#0000FF';
var magentaColor = '#FF00FF';
var cyanColor = '#00FFFF';
var yellowColor = '#FFFF00';

var blackColor = '#000000';
var greyColor = '#888888';
var purpleColor = '#5c32a8';
var brightYellowColor = '#fcd303'; 
var orangeColor = '#DC7B2E';
var blueGreenColor = '#63BFAB'; 
var oRedColor = 'rgba(218, 37, 0, 0.3)';
var oGreenColor = 'rgba(0, 143, 0, 0.3)';
var oBlueColor = 'rgba(1, 25, 147, 0.5)';

/* Constants */

var a475_lms = [0.0509384206, 0.0618970658, 0.015150576];
var a485_lms = [0.0818313433, 0.0880318619, 0.009429312];
var a575_lms = [0.6281339073, 0.2874094695, 0.000031687248];
var a660_lms = [0.05820210417, 0.002795455831, 0.00000019144848];
var aEEW_lms = [14.30506543, 7.190126944, 0.3379046085];

// XYZ <--> LMS mats based on Smith & Pokorny using Judd corrected XYZ (used by Brettel 1997 & Viénot 1999)
// http://cvrl.ioo.ucl.ac.uk/database/text/cones/sp.htm
var xyz2lms = [[0.15514, 0.54312, -0.03286], [-0.15514, 0.45684, 0.03286], [0, 0, 0.01608]];
var RGB2xyz = [[40.9568, 35.5041, 17.9167], [21.3389, 70.6743, 7.9868], [1.86297, 11.462, 91.2367]];

// XYZ <--> LMS mats using HPE
// (used by https://ixora.io/projects/colorblindness/color-blindness-simulation-research/)
//var hpe_xyz2lms_eew = [[0.3897,0.689,-0.0787], [-0.2298,1.1834,0.0464], [0,0,1]]; // EEW normalized
//var hpe_xyz2lms_d65 = [[0.4002,0.7076,-0.0808], [-0.2263,1.1653,0.0457], [0,0,0.9182]]; // D65 adapted
//var xyz2lms = hpe_xyz2lms_d65;
// this is D65 adapted
//var RGB2xyz = [[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]];

// TODO: clean this up
function get_RGB2lms() {
  var RGB2lms = math.multiply(xyz2lms, RGB2xyz);
  return RGB2lms;
}

var RGB2lms = get_RGB2lms();
var lms2RGB = math.inv(RGB2lms);
var XYZ2RGB = math.inv(RGB2xyz);

function XYZ2xy(XYZ) {
  var XYZ_sum = math.add(XYZ[0], XYZ[1], XYZ[2]);
  var x = math.dotDivide(XYZ[0], XYZ_sum);
  var y = math.dotDivide(XYZ[1], XYZ_sum);

  return [x, y]
}

function get_confusion_lines() {
  // vectors for confusion lines (derived from Sharma LUTs)
  //var p_line = [0.9795006397, -0.2013704401, 0.005333160206];
  //var d_line = [-0.8959739281, 0.4425391762, -0.03727999099];
  //var t_line = [0.1428342021, -0.1413451732, 0.9796019256];

  // vectors for confusion lines (derived using lms2RGB matrix) in RGB
  var p_line = normalize(math.multiply(lms2RGB, [1, 0, 0]));
  var d_line = normalize(math.multiply(lms2RGB, [0, 1, 0]));
  var t_line = normalize(math.multiply(lms2RGB, [0, 0, 1]));

  return [p_line, d_line, t_line];
}

var confusion_lines = get_confusion_lines();

function get_confusion_lines_xy() {
  var lines = [];

  for (t of [0, 1, 2]) {
    for (p of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
      var line_RGB = confusion_lines[t];
      var p0_RGB = math.add(p, math.multiply(line_RGB, 0.2));
      var p0_xy = XYZ2xy(math.multiply(RGB2xyz, p0_RGB));
      var p1_xy = XYZ2xy(math.multiply(RGB2xyz, p));
      lines.push(normalize(math.subtract(p1_xy, p0_xy)));
    }
  }

  return lines;
}

var confusion_lines_xy = get_confusion_lines_xy();

function get_proj_mat() {
  // https://daltonlens.org/understanding-cvd-simulation/
  if (simMethod == 1) {
    // Viénot 1999 (one plane); an approximation of Brettel 1997 (two planes).
    // for protanopia and deuteranopia they use the black-blue-yellow-white plane;
    // for tritanopia the paper didn't say what to do here we simply use black-red-cyan-white plane.
    var sRGBWhite = math.multiply(get_RGB2lms(), [1, 1, 1]);
    var sRGBBlue = math.multiply(get_RGB2lms(), [0, 0, 1]);
    var sRGBRed = math.multiply(get_RGB2lms(), [1, 0, 0]);
    var sRGBYellow = math.multiply(get_RGB2lms(), [1, 1, 0]);
    var sRGBCyan = math.multiply(get_RGB2lms(), [0, 1, 1]);

    var p_norm1 = math.cross(sRGBBlue, sRGBYellow);
    var d_norm1 = p_norm1;
    var t_norm1 = math.cross(sRGBRed, sRGBCyan);

    var p_proj_mat = [[0, -p_norm1[1]/p_norm1[0], -p_norm1[2]/p_norm1[0]], [0, 1, 0], [0, 0, 1]];
    var d_proj_mat = [[1, 0, 0], [-d_norm1[0]/d_norm1[1], 0, -d_norm1[2]/d_norm1[1]], [0, 0, 1]];
    var t_proj_mat = [[1, 0, 0], [0, 1, 0], [-t_norm1[0]/t_norm1[2], -t_norm1[1]/t_norm1[2], 0]];

    return [p_proj_mat, d_proj_mat, t_proj_mat];
  } else {
    // Brettel 1997 (two planes).
    // in LMS space (transformed from JV-modified XYZ)
    var sRGBWhite = math.multiply(get_RGB2lms(), [1, 1, 1]);
    var aWhite = aEEW_lms; // (Brettel 97 uses EEW and Vienot 99 uses sRGBWhite)

    var p_norm1 = math.cross(aWhite, a475_lms);
    var p_norm2 = math.cross(aWhite, a575_lms);
    var d_norm1 = p_norm1;
    var d_norm2 = p_norm2;
    var t_norm1 = math.cross(aWhite, a485_lms);
    var t_norm2 = math.cross(aWhite, a660_lms);

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

// https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
// It converts 'rgb(255, 255, 255)' to '#FFFFFF'
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

// It converts an array [255, 255, 255] to '#FFFFFF'
function srgbToHex(c) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}

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

// From linear RGB to sRGB in Hex
// if |clip| true, use the absolute rendering intent to clip
function RGB2sRGB(color, clip) {
  var out = [];

  for(var i = 0; i < 3; i++) {
    out[i] = quantize(applyGamma(color[i]));

    if (clip) {
      if (out[i] < 0) out[i] = 0;
      else if (out[i] > 255) out[i] = 255; 
    } else {
      if (out[i] < 0 || out[i] > 255)
        return '#000000';
    }
  }

  return srgbToHex(out);
}

function formatLinearSRGB(color) {
  // TODO: take care of OOG (or not?)
  return 'color(srgb-linear '+
      color[0].toString()+' '+
      color[1].toString()+' '+
      color[2].toString()+')';
}

// From sRGB [0, 1] to linear RGB
function sRGB2RGB(color) {
  var out = [];
  for(var i = 0; i < 3; i++) {
    out[i] = removeGamma(color[i]);
  }

  return out;
}

// From sRGB hex to linear RGB
function hex2RGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16)/255,
    parseInt(result[2], 16)/255,
    parseInt(result[3], 16)/255
  ];

  return sRGB2RGB(color);
}

// https://chir.ag/projects/ntc/
function sRGB2Name(color) {
  var n_match  = ntc.name(color);
  //var n_rgb        = n_match[0]; // This is the RGB value of the closest matching color
  var n_name       = n_match[1]; // This is the text string for the name of the match
  //var n_exactmatch = n_match[2]; // True if exact color match, False if close-match
  return n_name;
}

function RGBtoLab(rgb_color) {
  var c0 = new Color("srgb-linear", rgb_color[0]);
  var c1 = new Color("srgb-linear", rgb_color[1]);
  var c2 = new Color("srgb-linear", rgb_color[2]);

  return [c0.lab_d65, c1.lab_d65, c2.lab_d65];
}

function normalize(vec) {
  return math.divide(vec, math.norm(vec));
}

function project(colors_LMS) {
  // in input each column is a color

  if (simMethod == 1) {
    // one plane
    return math.multiply(proj_mat[type], colors_LMS);
  } else {
    // two planes
    var outColors1 = math.multiply(proj_mat[type], colors_LMS);
    var outColors2 = math.multiply(proj_mat[type + 3], colors_LMS);
    var outColors = [];

    var whiteLMS = math.multiply(RGB2lms, [1, 1, 1]);
    var wL = whiteLMS[0], wM = whiteLMS[1], wS = whiteLMS[2];

    for (var i = 0; i < colors_LMS[0].length; i++) {
      var L = colors_LMS[0][i];
      var M = colors_LMS[1][i];
      var S = colors_LMS[2][i];

      if (type == 0) {
        if (S/M < wS/wM) mask = 0;
        else mask = 1;
      } else if (type == 1) {
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

function dichromatic_gamut_mapping(colors, mode) {
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

  if (mode == 0) {
    colors.forEach((color) => {
      for (var j = 0; j < 3; j++) {
        if (color[j] < 0) color[j] = 0;
        else if (color[j] > 1) color[j] = 1; 
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

    var line = confusion_lines[type];
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
    this._space = space;
  }
  // _space:
  // norm_srgb: [0, 1] with gamma
  // linear_srgb: [0, 1] without gamma
  // srgb: [0, 255] with gamma

  get space() {
    return this._space;
  }

  get value() {
    return this._value;
  }

  get norm_srgb() {
    if (this.space == 'srgb') {
      return  this.value.map(c => c/255);
    } else if (this.space == 'linear_srgb') {
      return  this.value.map(c => applyGamma(c) / 255);
    } else if (this.space == 'norm_srgb') {
      return this.value;
    }
  }

  get linear_srgb() {
    if (this.space == 'srgb') {
      return  this.value.map(c => removeGamma(c/255));
    } else if (this.space == 'linear_srgb') {
      return  this.value;
    } else if (this.space == 'norm_srgb') {
      return  this.value.map(c => removeGamma(c));
    }
  }

  get srgb() {
    if (this.space == 'srgb') {
      return  this.value;
    } else if (this.space == 'linear_srgb') {
      return  this.value.map(c => quantize(applyGamma(c)));
    } else if (this.space == 'norm_srgb') {
      return  this.value.map(c => quantize(c));
    }
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
    return srgbToHex(this.srgb);
  }
}

// contains the state one baseColor test (multiple testColors)
class discTestState {
  constructor(base) {
    this._baseColor = base; // one single color
    this._testColor = null; // one single color
    this._colors = []; // four initial colors (three test + one base) without rotation
    this._rotColors_row = []; // rotated colors, one color per row
    this._rotColors_col = []; // rotated colors, one color per column
    this._scalesAtRevs = [];
    this._scale = 0.1; // TODO: need to figure out how to better set this
    this._numRight = 0;
    this._numRevs = 0;
    this._lastAns = null;
    this._numTrials = 1;
    this._step1 = 0.02; // TODO: need to figure out how to better set this
    this._step2 = 0.002; // TODO: need to figure out how to better set this
  }

  setStep2() {
	// TODO: the idea is to make sure in each step at least one channel changes
	// by setting the step size based on the first reversal color, but the
	// implementation using deltaLUT is a hack and for now works only for sRGB
    var line_RGB = confusion_lines[1]; // D line in RGB
    var deltaR = deltaLUT[this.testColor.srgb[0]];
    var deltaG = deltaLUT[this.testColor.srgb[1]];
    var deltaB = deltaLUT[this.testColor.srgb[2]];
  
    this.step2 = Math.min(deltaR / Math.abs(line_RGB[0]), deltaG / Math.abs(line_RGB[1]), deltaB / Math.abs(line_RGB[2]));
  }

  // take in a set of colorObj (not a pure numerical array)
  geoTrans(transMat, fromColors) {
    // TODO: now assuming we want to transform from linear-srgb; generalize this later
    var colors_in_linear_srgb = [fromColors[0].linear_srgb,
                                 fromColors[1].linear_srgb,
                                 fromColors[2].linear_srgb,
                                 fromColors[3].linear_srgb]
    return math.multiply(transMat, math.transpose(colors_in_linear_srgb));
  }

  rotate(rotMat) {
    return this.geoTrans(rotMat, this.colors);
    //this.rotColors_col = math.multiply(rotMat, math.transpose(colors_in_linear_srgb));
    //this.rotColors_row = math.transpose(this.rotColors_col);
  }

  get baseColor() {
    return this._baseColor;
  }

  get scalesAtRevs() {
    return this._scalesAtRevs;
  }

  get colors() {
    return this._colors;
  }

  get rotColors_row() {
    return this._rotColors_row;
  }

  get rotColors_col() {
    return this._rotColors_col;
  }
  set rotColors_col(v) {
    this._rotColors_col = v;
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

  set step1(v) {
    this._step1 = v;
  }
  get step1() {
    return this._step1;
  }

  set step2(v) {
    this._step2 = v;
  }
  get step2() {
    return this._step2;
  }
}

