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

function add_one_test(time_in_training, time_in_test, time, colors, tests, answers, index) {

  var string = "\
        <div class=\"col-sm-10\" id=\"table_" + index.toString() + "\"></div>\
        ";
  $("#results").append(string);

  // add time
  string = "<div class=\"row d-flex justify-content-center nofocus my-4 fs-2\" tabindex=\"-1\" id=\"time\">Test Time: " + time.toString() + ". Time in Training: " + (time_in_training/1000).toString() + "s</div>";
  $("#table_" + index.toString()).append(string);

  // add table header
  string = "\
        <div class=\"row d-flex justify-content-center nofocus my-4\" tabindex=\"-1\"> \
          <div class=\"col-sm-3 content_center fs-4\">Color</div> \
          <div class=\"col-sm-3 content_center fs-4\">Correct Answer</div> \
          <div class=\"col-sm-3 content_center fs-4\">Your Answer</div> \
          <div class=\"col-sm-3 content_center fs-4\">Time in Test (s)</div> \
        </div>";
  $("#table_" + index.toString()).append(string);

  for (var i = 0; i < tests.length; i++) {
    var tid = "res_" + index.toString() + "_" + (i+1).toString(); 

    // add a row to the result table
    string = "\
        <div class=\"row d-flex justify-content-center nofocus my-4\" tabindex=\"-1\"> \
          <div class=\"col-sm-3 content_center fs-4\"> \
            <div class=\"res_circle\" id=\"" + tid + "_color\"></div> \
          </div> \
          <div class=\"col-sm-3 content_center fs-4\" id=\"" + tid + "_ans\"></div> \
          <div class=\"col-sm-3 content_center fs-4\" id=\"" + tid + "_your\"></div> \
          <div class=\"col-sm-3 content_center fs-4\" id=\"" + tid + "_time\">" + (time_in_test[i]/1000).toString() + "</div> \
        </div>";
    $("#table_" + index.toString()).append(string);

    // put the right information in the newly added row
    var color = new colorObj(colors[tests[i]].rgb, 'srgb');
    $("#" + tid + '_color').css('background-color', color.srgb_css);
    $("#" + tid + '_ans').text(colors[tests[i]].name);
    $("#" + tid + '_your').html(colors[answers[i]].name + ((tests[i] == answers[i]) ? "&#20; &#10004;" : "&#20; &#10060;"));
  }
}

function gen_plot(results) {
  d3.csv('../ciexyzjv.csv').then(function(rows){
    dis_plot = plotDis('disDiv', rows);

    // add the test colors to the xy chromaticity diagram
    var colors = results[0].all_colors;
    for (var i = 0; i < colors.length; i++) {
      var color = new colorObj(colors[i].rgb, 'srgb');
      add_new_color(dis_plot, color);
    }
  });

  for (var i = results.length - 1; i >= 0; i--) {
    var prof = results[i];
    add_one_test(prof.time_in_training, prof.time_in_test, prof.time, prof.all_colors, prof.test_color_id, prof.answer_color_id, i);
  }
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

    gen_plot(data.prof);
    displayConfig(data.page_stats);
    displayFb(data.prof[0].fb, data.page_stats.info); // TODO: show all the matching results
  })

