function plot_ellipse() {
  var trace_id = page.dis_plot.data.length - 1;
  var xs = page.dis_plot.data[trace_id].x;
  var ys = page.dis_plot.data[trace_id].y;

  var e_x_center = xs[0];
  var e_y_center = ys[0];
  var end = xs.length;

  var e_x_offset = math.subtract(xs.slice(1, end), e_x_center);
  var e_y_offset = math.subtract(ys.slice(1, end), e_y_center);

  var e_xx = math.dotMultiply(e_x_offset, e_x_offset);
  var e_xy = math.dotMultiply(e_x_offset, e_y_offset);
  var e_yy = math.dotMultiply(e_y_offset, e_y_offset);

  var e_X = math.transpose([e_xx, e_xy, e_yy]);
  var e_Y = math.transpose([1, 1, 1, 1, 1, 1]);

  // XT=Y
  var e_XTX = math.multiply(math.transpose(e_X), e_X);
  var e_XTX_inv = math.inv(e_XTX);
  var e_T = math.multiply(math.multiply(e_XTX_inv, math.transpose(e_X)), e_Y);
  var a = e_T[0];
  var b = e_T[1];
  var c = e_T[2];

  var x_max_h = Math.sqrt(b**2 / (4 * a**2 * c - a * b**2));
  var x_min_h = -x_max_h;
  var y_max_h = -2 * a * x_max_h / b;
  var y_min_h = -y_max_h;

  var ellip_h = {
    x: [x_min_h+e_x_center, x_max_h+e_x_center],
    y: [y_min_h+e_y_center, y_max_h+e_y_center],
    text: [''],
    mode: 'lines+markers',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'x',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Ellipses',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  var y_max_v = Math.sqrt(b**2 / (4 * a * c**2 - c * b**2));
  var y_min_v = -y_max_v;
  var x_max_v = -2 * c * y_max_v / b;
  var x_min_v = -x_max_v;

  var ellip_v = {
    x: [x_min_v+e_x_center, x_max_v+e_x_center],
    y: [y_min_v+e_y_center, y_max_v+e_y_center],
    text: [''],
    mode: 'lines+markers',
    marker: {
      size: 8,
      opacity: 1,
      color: [0,0,0],
      symbol: 'x',
    },
    line: {
      width: 1,
      color: '#000000',
    },
    name: 'Ellipses',
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}<extra></extra>',
  };

  Plotly.addTraces(page.dis_plot, ellip_h);
  Plotly.addTraces(page.dis_plot, ellip_v);
}

// https://autotrace.sourceforge.net/WSCG98.pdf
// https://scipython.com/blog/direct-linear-least-squares-fitting-of-an-ellipse/
var colors = [
              math.subtract((new colorObj([0.10542769189528832,0.11196318749090527,0.6220472049063162], 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
              math.subtract((new colorObj([0.0836435021223491,0.11644263432725839,0.6219285682712985] , 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
              math.subtract((new colorObj([0.09078954953930087,0.11672548132899592,0.6217477060967738], 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
              math.subtract((new colorObj([0.09999213929210117,0.11217931743941469,0.6221306828894713], 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
              math.subtract((new colorObj([0.10005011241439692,0.11057214719537688,0.6438437248465012], 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
              math.subtract((new colorObj([0.09367112113385102,0.1168856374479625,0.6000861931765764] , 'v_rgb')).xy, [0.19958547204032873,0.14937709890627032]),
             ];

var colors_T = math.transpose(colors);
var xs = colors_T[0];
var ys = colors_T[1];
//console.log(xs, ys);
var xx = math.dotMultiply(xs, xs);
var xy = math.dotMultiply(xs, ys);
var yy = math.dotMultiply(ys, ys);
//var D_T = [xx, xy, yy, [1, 1, 1, 1, 1, 1]];
var D_T = [xx, xy, yy, xs, ys, [1, 1, 1, 1, 1, 1]];
var D = math.transpose(D_T);
var S = math.multiply(D_T, D);
//var C = [
//         [0, 0, 2, 0],
//         [0, -1, 0, 0],
//         [2, 0, 0, 0],
//         [0, 0, 0, 0],
//        ];
var C = [
         [0, 0, 2, 0, 0, 0],
         [0, -1, 0, 0, 0, 0],
         [2, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0],
        ];

var t = math.multiply(math.inv(S), C);
var eigs = numeric.eig(t);
//console.log(eigs.lambda.x);
//console.log(eigs.E.x);
var eig_vecs = eigs.E.x;
t = eig_vecs.filter(x => (4 * x[0] * x[2] - x[1]**2) > 0);
var eigs_min_pos_vec = t[0];
var scale = (4 * t[0][0] * t[0][2] - t[0][1] ** 2);

//var eigs = math.eigs(math.multiply(math.inv(S), C));
//var idx = eigs.values.findIndex(x => x<0);
//console.log(eigs.values, eigs.vectors);
//var eigs_min_pos_vec = eigs.vectors[idx - 1];

console.log(eigs_min_pos_vec);
var scale = 4 * eigs_min_pos_vec[0] * eigs_min_pos_vec[2] - eigs_min_pos_vec[1]**2;
console.log(scale);
var vec = math.divide(eigs_min_pos_vec, Math.sqrt(scale));
console.log(vec);
//scale = 4 * vec[0] * vec[2] - vec[1]**2;
//console.log(scale);

