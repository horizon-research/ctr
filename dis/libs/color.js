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
    // an interface for either linear_srgb or linear_p3 based on page.cs
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
