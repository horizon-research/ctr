$('#next').on('click', function(evt) {
  $('#test-tab').trigger('click');
  $('#myTab').css('display', 'none');
});

// TODO: set some basic color config here?
page = new pageObj();
state = new discTestState();

var simMode = [false, 'no']; // enabled, choice
var blindnessType = [false, 'pickd'];
var simMethod = [false, 'm2'];
var showXy = false, showRGB = false, showLab = false, showExp = false;
page.configPage(simMode, blindnessType, simMethod, showXy, showRGB, showLab, showExp);

page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));
