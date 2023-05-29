// creating a set of confusing colors
function create_confusing_colors_prot() {
  var line = confusion_lines[0];
  var a475_RGB = math.multiply(lms2RGB, a475_lms);
  var a575_RGB = math.multiply(lms2RGB, a575_lms);
  var aEEW_RGB = math.multiply(lms2RGB, aEEW_lms);

  // line 1
  var base = math.multiply(math.add(math.multiply(a475_RGB, 0.9),
                           math.multiply(aEEW_RGB, 0.05),
                           math.multiply([0, 0, 0], 0.05)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line1_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line1_XYZ = math.multiply(RGB2xyz, line1_rgb);
  var line1_xy = XYZ2xy(line1_XYZ);
  var line1_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 2
  base = math.multiply(base, 0.5);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line2_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line2_XYZ = math.multiply(RGB2xyz, line2_rgb);
  var line2_xy = XYZ2xy(line2_XYZ);
  var line2_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 3
  var base = math.multiply(math.add(math.multiply(a575_RGB, 0.9),
                           math.multiply(aEEW_RGB, 0.05),
                           math.multiply([0, 0, 0], 0.05)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line3_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line3_XYZ = math.multiply(RGB2xyz, line3_rgb);
  var line3_xy = XYZ2xy(line3_XYZ);
  var line3_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 4
  base = math.multiply(base, 0.5);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line4_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line4_XYZ = math.multiply(RGB2xyz, line4_rgb);
  var line4_xy = XYZ2xy(line4_XYZ);
  var line4_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  return {line1: line1_rgb,
          line1_xy: line1_xy,
          line1_srgb : line1_srgb,
          line2: line2_rgb,
          line2_xy: line2_xy,
          line2_srgb : line2_srgb,
          line3: line3_rgb,
          line3_xy: line3_xy,
          line3_srgb : line3_srgb,
          line4: line4_rgb,
          line4_xy: line4_xy,
          line4_srgb : line4_srgb,
  }
}

function create_confusing_colors_deut() {
  var line = confusion_lines[1];
  var a475_RGB = math.multiply(lms2RGB, a475_lms);
  var a575_RGB = math.multiply(lms2RGB, a575_lms);
  var aEEW_RGB = math.multiply(lms2RGB, aEEW_lms);

  // line 1
  var base = math.multiply(math.add(math.multiply(a475_RGB, 0.9),
                           math.multiply(aEEW_RGB, 0.05),
                           math.multiply([0, 0, 0], 0.05)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line1_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line1_XYZ = math.multiply(RGB2xyz, line1_rgb);
  var line1_xy = XYZ2xy(line1_XYZ);
  var line1_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 2
  base = math.multiply(base, 0.5);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line2_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line2_XYZ = math.multiply(RGB2xyz, line2_rgb);
  var line2_xy = XYZ2xy(line2_XYZ);
  var line2_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 3
  // this line has some colors that are out side the RGB cube but are inside
  // the triangle in chromaticity plot; this is perfectly fine: a color with a
  // channel that's *positive* but greater than 1 will be outside the cube but
  // inside the triangle; only when a channel is negative will the color be
  // outside the triangle!
  var base = math.multiply(math.add(math.multiply(a575_RGB, 0.95),
                           math.multiply(aEEW_RGB, 0.03),
                           math.multiply([0, 0, 0], 0.02)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line3_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line3_XYZ = math.multiply(RGB2xyz, line3_rgb);
  var line3_xy = XYZ2xy(line3_XYZ);
  var line3_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 4
  base = math.multiply(base, 0.5);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line4_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line4_XYZ = math.multiply(RGB2xyz, line4_rgb);
  var line4_xy = XYZ2xy(line4_XYZ);
  var line4_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  return {line1: line1_rgb,
          line1_xy: line1_xy,
          line1_srgb : line1_srgb,
          line2: line2_rgb,
          line2_xy: line2_xy,
          line2_srgb : line2_srgb,
          line3: line3_rgb,
          line3_xy: line3_xy,
          line3_srgb : line3_srgb,
          line4: line4_rgb,
          line4_xy: line4_xy,
          line4_srgb : line4_srgb,
  }
}

function create_confusing_colors_trit() {
  var line = confusion_lines[2];
  var a485_RGB = math.multiply(lms2RGB, a485_lms);
  var a660_RGB = math.multiply(lms2RGB, a660_lms);
  var aEEW_RGB = math.multiply(lms2RGB, aEEW_lms);

  // line 1
  var base = math.multiply(math.add(math.multiply(a485_RGB, 0.9),
                           math.multiply(aEEW_RGB, 0.05),
                           math.multiply([0, 0, 0], 0.05)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line1_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line1_XYZ = math.multiply(RGB2xyz, line1_rgb);
  var line1_xy = XYZ2xy(line1_XYZ);
  var line1_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 2
  base = math.multiply(base, 0.5);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line2_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line2_XYZ = math.multiply(RGB2xyz, line2_rgb);
  var line2_xy = XYZ2xy(line2_XYZ);
  var line2_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 3
  var base = math.multiply(math.add(math.multiply(a660_RGB, 0.95),
                           math.multiply(aEEW_RGB, 0.03),
                           math.multiply([0, 0, 0], 0.02)), 40);
  var p1_RGB = math.add(base, math.multiply(line, 0.2));
  var p2_RGB = math.add(base, math.multiply(line, 0.5));
  var p3_RGB = math.add(base, math.multiply(line, -0.2));
  var p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line3_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line3_XYZ = math.multiply(RGB2xyz, line3_rgb);
  var line3_xy = XYZ2xy(line3_XYZ);
  var line3_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  // line 4
  base = math.multiply(base, 2);
  p1_RGB = math.add(base, math.multiply(line, 0.2));
  p2_RGB = math.add(base, math.multiply(line, 0.5));
  p3_RGB = math.add(base, math.multiply(line, -0.2));
  p4_RGB = math.add(base, math.multiply(line, -0.5));
  var line4_rgb = math.transpose([base, p1_RGB, p2_RGB, p3_RGB, p4_RGB]);
  var line4_XYZ = math.multiply(RGB2xyz, line4_rgb);
  var line4_xy = XYZ2xy(line4_XYZ);
  var line4_srgb = [RGB2sRGB(base, true),
                    RGB2sRGB(p1_RGB, true),
                    RGB2sRGB(p2_RGB, true),
                    RGB2sRGB(p3_RGB, true),
                    RGB2sRGB(p4_RGB, true)];

  return {line1: line1_rgb,
          line1_xy: line1_xy,
          line1_srgb : line1_srgb,
          line2: line2_rgb,
          line2_xy: line2_xy,
          line2_srgb : line2_srgb,
          line3: line3_rgb,
          line3_xy: line3_xy,
          line3_srgb : line3_srgb,
          line4: line4_rgb,
          line4_xy: line4_xy,
          line4_srgb : line4_srgb,
  }
}

var c_lines_prot = create_confusing_colors_prot();
var c_lines_deut = create_confusing_colors_deut();
var c_lines_trit = create_confusing_colors_trit();

function plotXy(plotId, chrm, wlen, a475, a575, a485, a660) {
  var xyTrace = {
    x: chrm[0],
    y: chrm[1],
    text: wlen,
    mode: 'lines+markers',
    line: {
      color: blackColor,
      width: 1,
      shape: 'spline',
    },
    name: 'Spectral Locus',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>wavelength: %{text}<extra></extra>',
  };


  // Viénot 1999 single-plane approach
  var RGB2xyz = [[40.9568, 35.5041, 17.9167], [21.3389, 70.6743, 7.9868], [1.86297, 11.462, 91.2367]];
  var sRGB_R = math.multiply(RGB2xyz, [1, 0, 0]);
  var sRGB_B = math.multiply(RGB2xyz, [0, 0, 1]);
  var sRGB_Y = math.multiply(RGB2xyz, [1, 1, 0]);
  var sRGB_C = math.multiply(RGB2xyz, [0, 1, 1]);
  var sRGB_W = math.multiply(RGB2xyz, [1, 1, 1]);

  var isochrome_line_pd_single = {
    x: [sRGB_B[0] / math.sum(sRGB_B), sRGB_W[0] / math.sum(sRGB_W), sRGB_Y[0] / math.sum(sRGB_Y)],
    y: [sRGB_B[1] / math.sum(sRGB_B), sRGB_W[1] / math.sum(sRGB_W), sRGB_Y[1] / math.sum(sRGB_Y)],
    text: ['sRGB B', 'sRGB W', 'sRGB Y'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#FFFFFF','#FFFFFF','#FFFFFF'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var isochrome_line_tri_single = {
    x: [sRGB_R[0] / math.sum(sRGB_R), sRGB_W[0] / math.sum(sRGB_W), sRGB_C[0] / math.sum(sRGB_C)],
    y: [sRGB_R[1] / math.sum(sRGB_R), sRGB_W[1] / math.sum(sRGB_W), sRGB_C[1] / math.sum(sRGB_C)],
    text: ['sRGB R', 'sRGB W', 'sRGB C'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#888888','#888888','#888888'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };


  // Brettel projection planes
  var isochrome_line_pd = {
    x: [chrm[0][a475], 1/3, chrm[0][a575]],
    y: [chrm[1][a475], 1/3, chrm[1][a575]],
    text: ['475 nm', 'EEW', '575 nm'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#FFFFFF','#FFFFFF','#FFFFFF'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var isochrome_line_tri = {
    x: [chrm[0][a485], 1/3, chrm[0][a660]],
    y: [chrm[1][a485], 1/3, chrm[1][a660]],
    text: ['485 nm', 'EEW', '660 nm'],
    mode: 'lines+markers',
    marker: {
      size: 12,
      opacity: 1,
      color: ['#888888','#888888','#888888'],
      line: {
        color: '#000000',
        width: 2
      }
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Iso-chrome lines',
    visible: false,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var line = {
    x: [0],
    y: [0],
    text: wlen,
    mode: 'markers',
    marker: {
      size: 15,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Actual',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>Actual: %{text}<extra></extra>',
  };

  var sim_line = {
    x: [0],
    y: [0],
    text: wlen,
    mode: 'markers',
    marker: {
      size: 13,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Simulation',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>Simulation: %{text}<extra></extra>',
  };

  var srgb_gamut_lines = {
    x: [0.6383673477, 0.301801932, 0.1529509084, 0.6383673477],
    y: [0.3325957349, 0.6007655533, 0.06818154656, 0.3325957349],
    text: ['R', 'G', 'B', 'R'],
    mode: 'lines',
    line: {
      width: 1,
      color: orangeColor,
    },
    name: 'sRGB gamut',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>%{text}<extra></extra>',
  };

  var p_conf_line_1 = {
    x: c_lines_prot.line1_xy[0],
    y: c_lines_prot.line1_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line1_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var p_conf_line_2 = {
    x: c_lines_prot.line2_xy[0],
    y: c_lines_prot.line2_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line2_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var p_conf_line_3 = {
    x: c_lines_prot.line3_xy[0],
    y: c_lines_prot.line3_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line3_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var p_conf_line_4 = {
    x: c_lines_prot.line4_xy[0],
    y: c_lines_prot.line4_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line4_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var d_conf_line_1 = {
    x: c_lines_deut.line1_xy[0],
    y: c_lines_deut.line1_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line1_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var d_conf_line_2 = {
    x: c_lines_deut.line2_xy[0],
    y: c_lines_deut.line2_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line2_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var d_conf_line_3 = {
    x: c_lines_deut.line3_xy[0],
    y: c_lines_deut.line3_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line3_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var d_conf_line_4 = {
    x: c_lines_deut.line4_xy[0],
    y: c_lines_deut.line4_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line4_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var t_conf_line_1 = {
    x: c_lines_trit.line1_xy[0],
    y: c_lines_trit.line1_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line1_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var t_conf_line_2 = {
    x: c_lines_trit.line2_xy[0],
    y: c_lines_trit.line2_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line2_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var t_conf_line_3 = {
    x: c_lines_trit.line3_xy[0],
    y: c_lines_trit.line3_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line3_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var t_conf_line_4 = {
    x: c_lines_trit.line4_xy[0],
    y: c_lines_trit.line4_xy[1],
    mode: 'lines+markers',
    line: {
      width: 1,
      color: '#000000',
    },
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line4_srgb,
    },
    name: 'Confusion line',
    visible: true,
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  line_p_R = math.transpose(
     [math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[0*3+0], 2)),
      math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[0*3+0], -2))]);
  line_p_G = math.transpose(
     [math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[0*3+1], -2)),
      math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[0*3+1], 2))]);
  line_p_B = math.transpose(
     [math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[0*3+2], 2)),
      math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[0*3+2], -2))]);

  line_d_R = math.transpose(
     [math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[1*3+0], 2)),
      math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[1*3+0], -2))]);
  line_d_G = math.transpose(
     [math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[1*3+1], -2)),
      math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[1*3+1], 2))]);
  line_d_B = math.transpose(
     [math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[1*3+2], 2)),
      math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[1*3+2], -2))]);

  line_t_R = math.transpose(
     [math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[2*3+0], 2)),
      math.add([0.6383673477, 0.3325957349], math.multiply(confusion_lines_xy[2*3+0], -2))]);
  line_t_G = math.transpose(
     [math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[2*3+1], -2)),
      math.add([0.301801932, 0.6007655533], math.multiply(confusion_lines_xy[2*3+1], 2))]);
  line_t_B = math.transpose(
     [math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[2*3+2], 2)),
      math.add([0.1529509084, 0.06818154656], math.multiply(confusion_lines_xy[2*3+2], -2))]);

  var p_conf = {
    x: line_p_R[0].concat(line_p_G[0]).concat(line_p_B[0]),
    y: line_p_R[1].concat(line_p_G[1]).concat(line_p_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var d_conf = {
    x: line_d_R[0].concat(line_d_G[0]).concat(line_d_B[0]),
    y: line_d_R[1].concat(line_d_G[1]).concat(line_d_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var t_conf = {
    x: line_t_R[0].concat(line_t_G[0]).concat(line_t_B[0]),
    y: line_t_R[1].concat(line_t_G[1]).concat(line_t_B[1]),
    mode: 'lines',
    line: {
      width: 1,
      color: '#777777',
    },
    name: 'Confusion lines',
    visible: false,
  };

  var data = [xyTrace,
              isochrome_line_pd, isochrome_line_tri, isochrome_line_pd_single, isochrome_line_tri_single,
              line, sim_line, srgb_gamut_lines,
              //d_conf_line_1, d_conf_line_2, d_conf_line_3, d_conf_line_4,
              //p_conf_line_1, p_conf_line_2, p_conf_line_3, p_conf_line_4,
              //t_conf_line_1, t_conf_line_2, t_conf_line_3, t_conf_line_4,
              p_conf, d_conf, t_conf,
             ];

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 50,
      t: 50
    },
    showlegend: true,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
    },
    xaxis: {
      range: [0, 1],
      title: {
        text: 'x'
      },
      // https://community.plotly.com/t/get-mouses-position-on-click/4145/3
      constrain: 'domain',
      dtick: 0.2,
      zerolinewidth: 3,
    },
    yaxis: {
      range: [-0.2, 1],
      title: {
        text: 'y'
      },
      scaleanchor: 'x',
      dtick: 0.2,
      zerolinewidth: 3,
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotLab(plotId) {
  var traces = [];

  var line = {
    x: [0], // a*
    y: [0], // b*
    z: [0], // L
    text: [0, 0, 0],
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 10,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    //mode: 'markers',
    showlegend: true,
    name: 'Actual colors',
    opacity:0.8,
    hovertemplate: 'Actual: %{text}<br>' +
      '<br>L: %{z}' +
      '<br>a<sup>*</sup>: %{x}' +
      '<br>b<sup>*</sup>: %{y}<extra></extra>',
  };
  traces.push(line);

  var sim_line = {
    x: [0], // a*
    y: [0], // b*
    z: [0], // L
    text: [0, 0, 0],
    type: 'scatter3d',
    mode: 'markers',
    marker: {
      size: 10,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    //mode: 'markers',
    showlegend: true,
    name: 'Simulation',
    opacity:0.8,
    hovertemplate: 'Simulation: %{text}<br>' +
      '<br>L: %{z}' +
      '<br>a<sup>*</sup>: %{x}' +
      '<br>b<sup>*</sup>: %{y}<extra></extra>',
  };
  traces.push(sim_line);

  var data = traces;

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    showlegend: true,
    legend: {
      x: 0,
      xanchor: 'left',
      y: 0.9,
    },
    //title: 'Spectral locus in RGB color space',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    scene: {
      camera: {
        projection: {
          type: 'orthographic'
        }
      },
      // https://plotly.com/javascript/3d-axes/
      aspectmode: 'cube',
      xaxis: {
        //autorange: true,
        range: [-200, 500],
        constrain: 'domain',
        dtick: 100,
        showspikes: false,
        title: {
          text: 'a<sup>*</sup>'
        }
      },
      yaxis: {
        //autorange: true,
        range: [-300, 500],
        scaleanchor: 'x',
        scaleratio: 1,
        dtick: 100,
        showspikes: false,
        title: {
          text: 'b<sup>*</sup>'
        }
      },
      zaxis: {
        //autorange: true,
        range: [-100, 100],
        scaleanchor: 'y',
        scaleratio: 1,
        dtick: 20,
        showspikes: false,
        title: {
          text: 'L'
        }
      },
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function plotRGB(plotId) {
  var allPoints = math.transpose([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]]);

  var traces = [];

  // O: 0; R: 1; G: 2: B: 3
  // RG: 4; RB: 5; GB: 6; RGB: 7
  var indices = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7], [0, 7]];
  var names = ['O', 'R', 'G', 'B', 'R+G', 'R+B', 'G+B', 'W'];
  var hoverInfo = [true, true, true, 'skip', 'skip', 'skip', 'skip', 'skip', 'skip', true, true, true, 'skip'];
  var colors = ['#000000', redColor, greenColor, blueColor, yellowColor, magentaColor, cyanColor, '#FFFFFF'];
  var modes = Array(3).fill('lines+markers+text').concat(Array(6).fill('lines')).concat(Array(3).fill('lines+markers+text'));

  // plot the RGB cube
  for (var i = 0; i < indices.length; i++) {
    var start = indices[i][0];
    var end = indices[i][1];
    var line = {
      x: [allPoints[0][start], allPoints[0][end]],
      y: [allPoints[1][start], allPoints[1][end]],
      z: [allPoints[2][start], allPoints[2][end]],
      text: [names[start], names[end]],
      mode: modes[i],
      type: 'scatter3d',
      showlegend: false,
      line: {
        width: 2,
        color: '#20ac37',
      },
      marker: {
        size: 8,
        opacity: 1,
        color: [colors[start], colors[end]],
        line: {
          width: 4,
          color: '#000000',
        },
      },
      hoverinfo: hoverInfo[i],
    };
    // hovertemplate overwrites hoverinfo, so add it later
    if (hoverInfo[i] == true) {
      line.hovertemplate = '%{text}<br>R: %{x}' +
        '<br>G: %{y}' +
        '<br>B: %{z}<extra></extra>';
    }
    traces.push(line);
  }

  var line = {
    x: [0],
    y: [0],
    z: [0],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'markers',
    showlegend: true,
    name: 'Actual colors',
    opacity:0.8,
    hovertemplate: 'Actual: %{text}<br>' +
      '<br>R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var sim_line = {
    x: [0],
    y: [0],
    z: [0],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'square',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'markers',
    showlegend: true,
    name: 'Simulation',
    opacity:0.8,
    hovertemplate: 'Simulation: %{text}<br>' +
      '<br>R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  // Viénot 1999 single-plane approach
  var prot_plane_single = {
    x: [0, 0, 1, 1],
    y: [0, 0, 1, 1],
    z: [0, 1, 0, 1],
    i: [0, 1],
    j: [1, 2],
    k: [2, 3],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  var tri_plane_single = {
    x: [0, 1, 0, 1],
    y: [0, 0, 1, 1],
    z: [0, 0, 1, 1],
    i: [0, 1],
    j: [1, 2],
    k: [2, 3],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  // Brettel projection planes
  var a475_RGB = math.multiply(math.multiply(lms2RGB, a475_lms), 200);
  var a575_RGB = math.multiply(math.multiply(lms2RGB, a575_lms), 200);
  var a485_RGB = math.multiply(math.multiply(lms2RGB, a485_lms), 500);
  var a660_RGB = math.multiply(math.multiply(lms2RGB, a660_lms), 500);
  var aEEW_RGB = math.multiply(math.multiply(lms2RGB, aEEW_lms), 200);

  // planes for protanopia and deutanopia
  var prot_plane1 = {
    x: [-aEEW_RGB[0], a475_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a475_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a475_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#24A5E5',
    showlegend: true,
    name: 'Iso-chrome Plane 1',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  var prot_plane2 = {
    x: [-aEEW_RGB[0], a575_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a575_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a575_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    opacity: 0.3,
    color: '#E5DF24',
    showlegend: true,
    name: 'Iso-chrome Plane 2',
    hoverinfo: 'skip',
    visible: 'legendonly',
  };

  // planes for tritanopia
  var tri_plane1 = {
    x: [-aEEW_RGB[0], a485_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a485_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a485_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    color: oGreenColor,
    hoverinfo: 'skip',
    showlegend: true,
    name: 'Iso-chrome Plane 1',
    visible: 'legendonly',
  };

  var tri_plane2 = {
    x: [-aEEW_RGB[0], a660_RGB[0], aEEW_RGB[0]],
    y: [-aEEW_RGB[1], a660_RGB[1], aEEW_RGB[1]],
    z: [-aEEW_RGB[2], a660_RGB[2], aEEW_RGB[2]],
    i: [0],
    j: [1],
    k: [2],
    type: 'mesh3d',
    color: oRedColor,
    hoverinfo: 'skip',
    showlegend: true,
    name: 'Iso-chrome Plane 2',
    visible: 'legendonly',
  };

  // creating a set of confusion colors
  var p_conf_line_1 = {
    x: c_lines_prot.line1[0],
    y: c_lines_prot.line1[1],
    z: c_lines_prot.line1[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line1_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Prot confusion line 1',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var p_conf_line_2 = {
    x: c_lines_prot.line2[0],
    y: c_lines_prot.line2[1],
    z: c_lines_prot.line2[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line2_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Prot confusion line 2',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var p_conf_line_3 = {
    x: c_lines_prot.line3[0],
    y: c_lines_prot.line3[1],
    z: c_lines_prot.line3[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line3_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Prot confusion line 3',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var p_conf_line_4 = {
    x: c_lines_prot.line4[0],
    y: c_lines_prot.line4[1],
    z: c_lines_prot.line4[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_prot.line4_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Prot confusion line 4',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var d_conf_line_1 = {
    x: c_lines_deut.line1[0],
    y: c_lines_deut.line1[1],
    z: c_lines_deut.line1[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line1_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Deut confusion line 1',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var d_conf_line_2 = {
    x: c_lines_deut.line2[0],
    y: c_lines_deut.line2[1],
    z: c_lines_deut.line2[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line2_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Deut confusion line 2',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var d_conf_line_3 = {
    x: c_lines_deut.line3[0],
    y: c_lines_deut.line3[1],
    z: c_lines_deut.line3[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line3_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Deut confusion line 3',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var d_conf_line_4 = {
    x: c_lines_deut.line4[0],
    y: c_lines_deut.line4[1],
    z: c_lines_deut.line4[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_deut.line4_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Deut confusion line 4',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var t_conf_line_1 = {
    x: c_lines_trit.line1[0],
    y: c_lines_trit.line1[1],
    z: c_lines_trit.line1[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line1_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Trit confusion line 1',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var t_conf_line_2 = {
    x: c_lines_trit.line2[0],
    y: c_lines_trit.line2[1],
    z: c_lines_trit.line2[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line2_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Trit confusion line 2',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var t_conf_line_3 = {
    x: c_lines_trit.line3[0],
    y: c_lines_trit.line3[1],
    z: c_lines_trit.line3[2],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line3_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Trit confusion line 3',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var t_conf_line_4 = {
    x: c_lines_trit.line4[0],
    y: c_lines_trit.line4[1],
    z: c_lines_trit.line4[2],
    text: [0, 0, 0],
    type: 'scatter3d',
    marker: {
      size: 8,
      opacity: 1,
      color: c_lines_trit.line4_srgb,
    },
    line: {
      width: 1,
      color: '#000000',
    },
    mode: 'lines+markers',
    visible: true,
    showlegend: true,
    name: 'Trit confusion line 4',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var isochromes_pd = {
    x: [a475_RGB[0]/a475_RGB[2], aEEW_RGB[0]/aEEW_RGB[2]*0.9, a575_RGB[0]*(-0.1)/a575_RGB[2]],
    y: [a475_RGB[1]/a475_RGB[2], aEEW_RGB[1]/aEEW_RGB[2]*0.9, a575_RGB[1]*(-0.1)/a575_RGB[2]],
    z: [1, 0.9, -0.1],
    text: ['475 nm', 'EEW', '575 nm'],
    type: 'scatter3d',
    marker: {
      size: 6,
      opacity: 1,
      color: '#000000',
      symbol: 'cross'
    },
    mode: 'markers+text',
    visible: 'legendonly',
    showlegend: true,
    name: 'Iso-chromes',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  var isochromes_t = {
    x: [a485_RGB[0]/a485_RGB[2]*0.3, aEEW_RGB[0]/aEEW_RGB[2]*0.9, a660_RGB[0]/a660_RGB[2]*(-0.008)],
    y: [a485_RGB[1]/a485_RGB[2]*0.3, aEEW_RGB[1]/aEEW_RGB[2]*0.9, a660_RGB[1]/a660_RGB[2]*(-0.008)],
    z: [0.3, 0.9, -0.008],
    text: ['485 nm', 'EEW', '660 nm'],
    type: 'scatter3d',
    marker: {
      size: 6,
      opacity: 1,
      color: '#000000',
      symbol: 'cross'
    },
    mode: 'markers+text',
    visible: 'legendonly',
    showlegend: true,
    name: 'Iso-chromes',
    opacity:0.8,
    hovertemplate: 'R: %{x}' +
      '<br>G: %{y}' +
      '<br>B: %{z}<extra></extra>',
  };

  traces.push(line, sim_line,
              prot_plane1, prot_plane2, tri_plane1, tri_plane2, prot_plane_single, tri_plane_single,
              isochromes_pd, isochromes_t,
              //d_conf_line_1, d_conf_line_2, d_conf_line_3, d_conf_line_4,
              //p_conf_line_1, p_conf_line_2, p_conf_line_3, p_conf_line_4
              //t_conf_line_1, t_conf_line_2, t_conf_line_3, t_conf_line_4
             );

  var data = traces;

  var layout = {
    height: 600,
    width: 600,
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    showlegend: true,
    legend: {
      x: 0,
      xanchor: 'left',
      y: 1,
    },
    //title: 'Spectral locus in RGB color space',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    scene: {
      camera: {
        projection: {
          type: 'orthographic'
        }
      },
      // https://plotly.com/javascript/3d-axes/
      //aspectmode: 'data', // to enforce the same scale across axes
      aspectmode: 'cube',
      xaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'R'
        }
      },
      yaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        scaleanchor: 'x',
        //scaleratio: 1,
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'G'
        }
      },
      zaxis: {
        //autorange: true,
        range: [-0.3, 1.3],
        //zeroline: true,
        //zerolinecolor: '#000000',
        //zerolinewidth: 5,
        scaleanchor: 'x',
        //dtick: 0.02,
        showspikes: false,
        title: {
          text: 'B'
        }
      },
    }
  };
 
  var plot = document.getElementById(plotId);
  Plotly.newPlot(plot, data, layout);

  return plot;
}

function updatePlot(theta, plotId_rgb, plotId_lab, plotId_xy, action) {
  // |action|:
  // 0: rotate (slider)
  // 1: show simulation/actual colors
  // 2: pick simulation algorithm (1 vs. 2 planes)
  // 3: submit

  var rgb_plot = document.getElementById(plotId_rgb);
  var lab_plot = document.getElementById(plotId_lab);
  var xy_plot = document.getElementById(plotId_xy);

  function rotate_colors(mapping) {
    /* perform the rotation */
    var u = 1/Math.sqrt(3)
    var cos = Math.cos(theta)
    var sin = Math.sin(theta)

    var rotMat = [
      [cos + u*u*(1-cos), u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin],
      [u*u*(1-cos)+u*sin, cos+u*u*(1-cos), u*u*(1-cos)-u*sin],
      [u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin, cos+u*u*(1-cos)]
    ];

    // Convention: in |Points| each color is a column and in |Colors| each color is a row

    // this is the actual position without mapping
    // TODO: rotated colors might be out of HVS gamut; we should black out those colors too
    var rotPoints_RGB = math.multiply(rotMat, math.transpose([color1, color2, color3]));
    var rotColors_RGB = math.transpose(rotPoints_RGB);

    var rotPoints_RGB_mapped = rotPoints_RGB;
    if (mapping) {
      rotColors_RGB = dichromatic_gamut_mapping(rotColors_RGB, 0);
      // this is the position of the mapped colors
      rotPoints_RGB_mapped = math.transpose(rotColors_RGB);
    }

    // Option 1: return actual rotated position but mapped color
    //return [rotPoints_RGB, rotColors_RGB];
    // Option 2: return mapped position and mapped color
    return [rotPoints_RGB_mapped, rotColors_RGB];
  }

  var res = rotate_colors(true);
  var rotPoints_RGB = res[0];
  var rotColors_RGB = res[1];

  var rotColors_sRGB = [RGB2sRGB(rotColors_RGB[0], true),
                        RGB2sRGB(rotColors_RGB[1], true),
                        RGB2sRGB(rotColors_RGB[2], true)
                       ];

  /* update actual colors */
  // update actual colors in the 3D plot (RGB)
  var data_update = {'x': [rotPoints_RGB[0]], 'y': [rotPoints_RGB[1]], 'z': [rotPoints_RGB[2]],
                     'marker.color': [rotColors_sRGB], 'text': [rotColors_sRGB]};
  Plotly.update(rgb_plot, data_update, {}, [13]);


  // update actual colors in the 3D plot (Lab)
  var rotColors_Lab = RGBtoLab(math.transpose(rotPoints_RGB));
  var rotPoints_Lab = math.transpose(rotColors_Lab);
  data_update = {'x': [rotPoints_Lab[1]], 'y': [rotPoints_Lab[2]], 'z': [rotPoints_Lab[0]],
                 'marker.color': [rotColors_sRGB], 'text': [rotColors_sRGB]};
  Plotly.update(lab_plot, data_update, {}, [0]);

  // update chromaticity plot
  var RGB2xyz = [[40.9568, 35.5041, 17.9167], [21.3389, 70.6743, 7.9868], [1.86297, 11.462, 91.2367]];
  var rotPoints_XYZ = math.multiply(RGB2xyz, rotPoints_RGB);
  var rotPoints_XYZ_sum = math.add(rotPoints_XYZ[0], rotPoints_XYZ[1], rotPoints_XYZ[2]);
  var rotPoints_x = math.dotDivide(rotPoints_XYZ[0], rotPoints_XYZ_sum);
  var rotPoints_y = math.dotDivide(rotPoints_XYZ[1], rotPoints_XYZ_sum);
  data_update = {'x': [rotPoints_x], 'y': [rotPoints_y],
                 'marker.color': [rotColors_sRGB], 'text': [rotColors_sRGB]};
  Plotly.update(xy_plot, data_update, {}, [5]);




  /* update simulated colors in the 3D plot */
  /* we need to use mapped colors for simulation */
  var rotPoints_LMS = math.multiply(RGB2lms, math.transpose(rotColors_RGB));
  var simPoints_LMS = project(rotPoints_LMS);
  var simPoints_RGB = math.multiply(lms2RGB, simPoints_LMS);
  var simColors_RGB = math.transpose(simPoints_RGB);
  var simColors_sRGB = [RGB2sRGB(simColors_RGB[0], true),
                        RGB2sRGB(simColors_RGB[1], true),
                        RGB2sRGB(simColors_RGB[2], true)
                       ];

  // update simulated colors in the RGB plot */
  data_update = {'x': [simPoints_RGB[0]], 'y': [simPoints_RGB[1]], 'z': [simPoints_RGB[2]],
                 'marker.color': [simColors_sRGB], 'text': [simColors_sRGB]};
  Plotly.update(rgb_plot, data_update, {}, [14]);

  // update simulated colors in Lab
  var simColors_Lab = RGBtoLab(simColors_RGB);
  var simPoints_Lab = math.transpose(simColors_Lab);
  data_update = {'x': [simPoints_Lab[1]], 'y': [simPoints_Lab[2]], 'z': [simPoints_Lab[0]],
                 'marker.color': [simColors_sRGB], 'text': [simColors_sRGB]};
  Plotly.update(lab_plot, data_update, {}, [1]);

  // update chromaticity plot
  var simPoints_XYZ = math.multiply(RGB2xyz, simPoints_RGB);
  var simPoints_XYZ_sum = math.add(simPoints_XYZ[0], simPoints_XYZ[1], simPoints_XYZ[2]);
  var simPoints_x = math.dotDivide(simPoints_XYZ[0], simPoints_XYZ_sum);
  var simPoints_y = math.dotDivide(simPoints_XYZ[1], simPoints_XYZ_sum);
  data_update = {'x': [simPoints_x], 'y': [simPoints_y],
                 'marker.color': [simColors_sRGB], 'text': [simColors_sRGB]};
  Plotly.update(xy_plot, data_update, {}, [6]);



  /* update iso-chrome planes/lines visibility */
  if (action == 2 || action == 3) {
    if (type == 0 || type == 1) { // P and D
      if (simMethod == 0) { // 2-plane {
        data_update = {'visible': ['legendonly', false, false, false,
            (type==0)?'legendonly':false, (type==1)?'legendonly':false, false]};
        Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
        data_update = {'visible': ['legendonly', 'legendonly', false, false, false, false, 'legendonly', false]};
        Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
      } else { // 1-plane
        data_update = {'visible': [false, false, 'legendonly', false,
            (type==0)?'legendonly':false, (type==1)?'legendonly':false, false]};
        Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
        data_update = {'visible': [false, false, false, false, 'legendonly', false, false, false]};
        Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
      }
    } else { // T
      if (simMethod == 0) { // 2-plane {
        data_update = {'visible': [false, 'legendonly', false, false, false, false, 'legendonly']};
        Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
        data_update = {'visible': [false, false, 'legendonly', 'legendonly', false, false, false, 'legendonly']};
        Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
      } else { // 1-plane
        data_update = {'visible': [false, false, false, 'legendonly', false, false, 'legendonly']};
        Plotly.update(xy_plot, data_update, {}, [1, 2, 3, 4, 8, 9, 10]);
        data_update = {'visible': [false, false, false, false, false, 'legendonly', false, false]};
        Plotly.update(rgb_plot, data_update, {}, [15, 16, 17, 18, 19, 20, 21, 22]);
      }
    }
  }



  /* update square colors */
  if (sim) {
    $('#s11').css('background-color', simColors_sRGB[0]);
    $('#s12').css('background-color', simColors_sRGB[1]);
    $('#s13').css('background-color', simColors_sRGB[2]);
  } else {
    $('#s11').css('background-color', rotColors_sRGB[0]);
    $('#s12').css('background-color', rotColors_sRGB[1]);
    $('#s13').css('background-color', rotColors_sRGB[2]);
  }
  // show names for the original colors (not dynamically updated with slider)
  $('#h11').text('');
  $('#h12').text('');
  $('#h13').text('');
  $('#n11').text(name1);
  $('#n12').text(name2);
  $('#n13').text(name3);
}

function registerSlider(id) {
  //$('input[type=range]').on('input', function() {
  $(id).on('input', function() {
    $('.form-label').html('Rotation Angle (Degree): ' + (this.value/Math.PI*180).toFixed(2) + '&#176;')
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
    //$('#b12').trigger('click');
    //$('#b13').trigger('click');
    //$('#play').trigger('click');
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

function registerPickColorSetter() {
  $('input[type=radio][name=setcolor]').change(function() {
    if (this.id == 'picker') {
      $('#c11').prop('disabled', false);
      $('#c12').prop('disabled', false);
      $('#c13').prop('disabled', false);

      $('#t12').prop('disabled', true);
      $('#t13').prop('disabled', true);
      $('#b12').prop('disabled', true);
      $('#b13').prop('disabled', true);

      $('#presets').prop('disabled', true);

      setter = 0;
    } else if (this.id == 'scale') {
      $('#c11').prop('disabled', false);
      $('#c12').prop('disabled', true);
      $('#c13').prop('disabled', true);

      $('#t12').prop('disabled', false);
      $('#t13').prop('disabled', false);
      $('#b12').prop('disabled', false);
      $('#b13').prop('disabled', false);

      $('#presets').prop('disabled', true);

      setter = 1;
    }  else { // 'usepre'
      $('#c11').prop('disabled', true);
      $('#c12').prop('disabled', true);
      $('#c13').prop('disabled', true);

      $('#t12').prop('disabled', true);
      $('#t13').prop('disabled', true);
      $('#b12').prop('disabled', true);
      $('#b13').prop('disabled', true);

      $('#presets').prop('disabled', false);

      setter = 2;
    }

  });
}

function registerColorPicker(baseId, squareId, nameId) {
  $(baseId).on('change', function(evt) {
    var colorVal = $(baseId).val();
    $(squareId).css('background-color', colorVal);
    $(nameId).text(sRGB2Name(colorVal));
  });
}

function registerSetScale(buttonId, baseId, textId, squareId, colorId, nameId) {
  $(buttonId).on('click', function(evt) {
    var baseColor = hex2RGB(rgb2hex($(baseId).css('background-color')));
    var scale = $(textId).val();
    var colorVal;

    var line = confusion_lines[type];
    colorVal = RGB2sRGB([baseColor[0] + line[0] * scale,
                         baseColor[1] + line[1] * scale,
                         baseColor[2] + line[2] * scale], false);

    $(squareId).css('background-color', colorVal);
    $(colorId).val(colorVal);
    $(nameId).text(sRGB2Name(colorVal));
  });
}

function registerReset(resetId) {
  $(resetId).on('click', function(evt) {
    $('#customRange').val(0);
    // need to explicitly trigger input event
    $('#customRange').trigger('input');
  });
}

function registerSelectPresets() {
  $('#presets').on('change', function(evt) {
    var val = this.value;
    if (val == "preset1") {
      $('#c11').val(rgb2hex('rgb(237, 238, 51)'));
      $('#c12').val(rgb2hex('rgb(127, 255, 0)'));
      $('#c13').val(rgb2hex('rgb(255, 140, 0)'));
    } else if (val == "preset2") {
      $('#c11').val(rgb2hex('rgb(58, 62, 233)'));
      $('#c12').val(rgb2hex('rgb(148, 0, 211)'));
      $('#c13').val(rgb2hex('rgb(224, 2, 224)'));
    } else if (val == "preset3") {
      $('#c11').val(rgb2hex('rgb(224, 2, 1)'));
      $('#c12').val(rgb2hex('rgb(151, 91, 57)'));
      $('#c13').val(rgb2hex('rgb(9, 90, 0)'));
    } else if (val == "preset4") {
      // these are picked to be on Deutanopia confusion line.
      // the first/commented c11 is more like gray. the used c11 is more similar to c12.
      // the second c13 is on a different confusion line in RGB but the same line in xy.
	  // the second c13 just has lower luminance, so in xy-chromaticity plot
	  // it's technically incorrect to say that colors on confusion line are
	  // perceptually the same --- they might have different luminances because
	  // they come from different confusion lines in XYZ/RGB.

      //$('#c11').val(rgb2hex('rgb(171, 188, 180)'));
      $('#c11').val(rgb2hex('rgb(228, 160, 182)'));
      $('#c12').val(rgb2hex('rgb(252, 143, 183)'));
      $('#c13').val(rgb2hex('rgb(55, 212, 178)'));
      //$('#c13').val(rgb2hex('rgb(218, 64, 136)'));

      // another deuta line (in RGB)
      //$('#c11').val(rgb2hex('rgb(218, 64, 136)'));
      //$('#c12').val(rgb2hex('rgb(107, 144, 131)'));
      //$('#c13').val(rgb2hex('rgb(66, 153, 131)'));
    }

    $('#c11').trigger('change');
    $('#c12').trigger('change');
    $('#c13').trigger('change');
  });
}

function submit(rangeId) {
  color1 = hex2RGB(rgb2hex($('#s11').css('background-color')));
  color2 = hex2RGB(rgb2hex($('#s12').css('background-color')));
  color3 = hex2RGB(rgb2hex($('#s13').css('background-color')));
  name1 = sRGB2Name(rgb2hex($('#s11').css('background-color')));
  name2 = sRGB2Name(rgb2hex($('#s12').css('background-color')));
  name3 = sRGB2Name(rgb2hex($('#s13').css('background-color')));

  $(rangeId).val(0);
  $('.form-label').html('Rotation Angle (Degree): 0&#176;');
  updatePlot(0, 'rgbDiv', 'labDiv', 'xyDiv', 3);
}

function registerSetState() {
  $('input[type=radio][name=state]').change(function() {
    if (this.id == 'edit') {
      $('input[type=radio][name=setcolor]:checked').prop("checked", true).trigger('change');

      $('input[type=radio][name=pick]').prop('disabled', false);
      $('input[type=radio][name=setcolor]').prop('disabled', false);
      $('input[type=radio][name=sim]').prop('disabled', true);
      $('input[type=radio][name=method]').prop('disabled', true);
      $('#customRange').prop('disabled', true);
      $('#reset').prop('disabled', true);

      // reset to two-plane approach and show actual colors
      $('#no').prop("checked", true).trigger('change');
      $('#m2').prop("checked", true).trigger('change');
    } else { // 'play'
      $('#c11').prop('disabled', true);
      $('#c12').prop('disabled', true);
      $('#c13').prop('disabled', true);
      $('#b12').prop('disabled', true);
      $('#b13').prop('disabled', true);
      $('#t12').prop('disabled', true);
      $('#t13').prop('disabled', true);
      $('#presets').prop('disabled', true);

      $('input[type=radio][name=pick]').prop('disabled', true);
      $('input[type=radio][name=setcolor]').prop('disabled', true);
      $('input[type=radio][name=sim]').prop('disabled', false);
      $('input[type=radio][name=method]').prop('disabled', false);
      $('#customRange').prop('disabled', false);
      $('#reset').prop('disabled', false);

      submit('#customRange');
    }
  });
}

var init = false;
var simMethod; // 0 for Brettel 1997 (two planes) and 1 for Viénot 1999 (one plane)
var type; // 0 for P, 1 for D, 2 for T
var sim;
var setter; // 0 for using color picker, 1 for using scale, 3 for using presets
var color1, color2, color3;
var name1, name2, name3;

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
  plotRGB('rgbDiv');
  plotLab('labDiv');

  registerSlider('#customRange');
  registerSimMode();
  registerPickType();
  registerPickSimMethod();
  registerColorPicker('#c11', '#s11', '#n11');
  registerColorPicker('#c12', '#s12', '#n12');
  registerColorPicker('#c13', '#s13', '#n13');
  registerSetScale('#b12', '#s11', '#t12', '#s12', '#c12', '#n12');
  registerSetScale('#b13', '#s11', '#t13', '#s13', '#c13', '#n13');
  registerReset('#reset');
  registerSelectPresets();
  registerPickColorSetter();
  registerSetState();
  
  // init color blindness type
  $('#pickd').prop("checked", true).trigger('change');
  
  // init simulation method
  $('#m2').prop("checked", true).trigger('change');
  
  // choose to show actual colors
  $('#no').prop("checked", true).trigger('change');
  
  // by default use preset2 in color setter
  $('#usepre').prop("checked", true).trigger('change');
  $('#presets').val('preset2');
  $('#presets').trigger('change');
  
  // set the mode to play and update the plot with the initial setting
  $('#play').attr("checked", true).trigger('change');
  init = true;
});

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tab = urlParams.get('tab')
$('#' + tab + '-tab').trigger('click');

