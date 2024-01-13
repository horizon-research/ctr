function gen_plot(colors, tests, answers) {
  for (var i = 0; i < tests.length; i++) {
    var color = new colorObj(colors[tests[i]].rgb, 'srgb');
    $('#res' + (i+1).toString() + '_color').css('background-color', color.srgb_css);
    $('#res' + (i+1).toString() + '_ans').text(colors[tests[i]].name);
    $('#res' + (i+1).toString() + '_your').text(colors[answers[i]].name);
    $('#res' + (i+1).toString() + '_sim').html((tests[i] == answers[i]) ? '&#10004;' : '&#10060;');
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

    gen_plot(data.prof.all_colors, data.prof.test_color_id, data.prof.answer_color_id);
    displayConfig(data.page_stats);
    displayFb(data.fb, data.page_stats.info);
  })

