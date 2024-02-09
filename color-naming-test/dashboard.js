function add_new_color(plot, color) {
  var new_trace = {
    x: [color.xy[0]],
    y: [color.xy[1]],
    text: [color.srgb_name],
    mode: 'markers',
    marker: {
      size: [10],
      symbol: ['square'],
      opacity: 1,
      color: [color.legacy_rgb_css],
    },
    line: {
      width: 0.5,
      color: '#000000',
    },
    name: color.srgb_name,
    srgb: [color.srgb.toString()],
    hovertemplate: 'x: %{x}' +
      '<br>y: %{y}' +
      '<br>sRGB: [' + color.srgb.toString() + ']' +
      '<br>%{text}<extra></extra>',
  };
  
  Plotly.addTraces(plot, new_trace);
}

function gen_plot(colors, tests, answers) {
  d3.csv('../ciexyzjv.csv').then(function(rows){
    dis_plot = plotDis('disDiv', rows);

    for (var i = 0; i < tests.length; i++) {
      // add a row to the result table
      var string = "<div class=\"row d-flex justify-content-center nofocus my-4\" tabindex=\"-1\"> \
                      <div class=\"col-sm-3 content_center fs-4\"> \
                        <div class=\"res_circle\" id=\"res" + (i+1).toString() + "_color\"></div> \
                      </div> \
                      <div class=\"col-sm-4 content_center fs-4\" id=\"res" + (i+1).toString() + "_ans\"></div> \
                      <div class=\"col-sm-4 content_center fs-4\" id=\"res" + (i+1).toString() + "_your\"></div> \
                      <div class=\"col-sm-1 content_center fs-4\" id=\"res" + (i+1).toString() + "_sim\">&#10004;</div> \
                    </div>"
      $("#res_table").append(string);

      // put the right information in the newly added row
      var color = new colorObj(colors[tests[i]].rgb, 'srgb');
      $('#res' + (i+1).toString() + '_color').css('background-color', color.srgb_css);
      $('#res' + (i+1).toString() + '_ans').text(colors[tests[i]].name);
      $('#res' + (i+1).toString() + '_your').text(colors[answers[i]].name);
      $('#res' + (i+1).toString() + '_sim').html((tests[i] == answers[i]) ? '&#10004;' : '&#10060;');
    }

    // add the colors to the plot
    for (var i = 0; i < colors.length; i++) {
      var color = new colorObj(colors[i].rgb, 'srgb');
      add_new_color(dis_plot, color);
    }
  });
}

function displayConfig(page_stats) {
  $('#usedcs').html(page_stats.cs ? 'Display P3' : 'sRGB');
  $('#usedbd').html(page_stats.bitdepth);
  $('#usedxyz').html('CIE 1931 XYZ'); // TODO: add these two to page_stats?
  $('#usedlms').html('Hunt-Pointer-Estevez D65-adapted');
  $('#bsrgb').html(page_stats.color_supports.srgb_b ? '&#10003;' : '');
  $('#bp3').html(page_stats.color_supports.p3_b ? '&#10003;' : '');
  $('#b2020').html(page_stats.color_supports.rec2020_b ? '&#10003;' : '');
  $('#dsrgb').html(page_stats.color_supports.srgb_d ? '&#10003;' : '');
  $('#dp3').html(page_stats.color_supports.p3_d ? '&#10003;' : '');
  $('#d2020').html(page_stats.color_supports.rec2020_d ? '&#10003;' : '');
}

function displayFb(t, i) {
  $('#fbtext').text(t);
  $('#cvdtype').html(i.cvdType);
  $('#sex').html(i.sex);
  $('#eth').html(i.ethnicity);
  $('#age').html(i.age);
}

var page;

var fileName = location.href.split("/").at(-1);
var jsonFileName = fileName.split(".")[0];

fetch(jsonFileName+'.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var cs = data.page_stats.cs;
    page = new pageObj((cs == 0) ? 'srgb' : 'p3');
    Object.assign(page.color_supports, data.page_stats.color_supports); // so that page.bitdepth is correctly set

    gen_plot(data.prof[0].all_colors, data.prof[0].test_color_id, data.prof[0].answer_color_id);
    displayConfig(data.page_stats);
    displayFb(data.prof[0].fb, data.page_stats.info);
  })

