$('#next').on('click', function(evt) {
  $('#test-tab').trigger('click');
  $('#myTab').css('display', 'none');
});

$('#expDiv').on('finish', function(evt) {
  $('#res-tab').trigger('click');
});

// TODO: set some basic color config here?
page = new pageObj();
state = new discTestState();

var simMode = [false, 'no']; // enabled, choice
var blindnessType = [false, 'pickd'];
var simMethod = [false, 'm2'];
var showXy = false, showRGB = false, showLab = false, showExp = true, showConfig = true;
page.configPage(simMode, blindnessType, simMethod, showXy, showRGB, showLab, showExp, showConfig);

page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));
