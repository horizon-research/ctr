$('#myTab').css('display', 'none');

$('#next').on('click', function(evt) {
  $('#test-tab').trigger('click');
});

$('#expDiv').on('finish', function(evt) {
  $('#res-tab').trigger('click');
});

// TODO: set some basic color config here?
page = new pageObj();
state = new discTestState();

var simMode = [true, 'no']; // enabled, choice
var blindnessType = [true, 'pickd'];
var simMethod = [true, 'm2'];
var showXy = false, showRGB = false, showLab = false, showExp = true, showConfig = true;

function registerSimMode() {
  $('input[type=radio][name=sim]').change(function() {
    if (this.id == 'yes') {
      page.sim = true;
    } else {
      page.sim = false;
    }

    if (page.init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 1);
  });

  // choose to show actual colors
  $('#no').prop("checked", true).trigger('change');

  $('input[type=radio][name=sim]').prop('disabled', false);
}
page.configPage(registerSimMode, blindnessType, simMethod, showXy, showRGB, showLab, showExp, showConfig);

page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));
