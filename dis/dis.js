d3.csv('../ciexyzjv.csv').then(function(rows){
  // TODO: set some basic color config here?
  page = new pageObj();
  state = new discTestState();

  var simMode = [true, 'yes']; // enabled, choice
  var blindnessType = [true, 'pickd'];
  var simMethod = [true, 'm2'];
  var showXy = true, showRGB = false, showLab = false, showExp = true;
  configPage(simMode, blindnessType, simMethod, showXy, showRGB, showLab, showExp, rows);

  // TODO: set baseColor here?
  submit();
});

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tab = urlParams.get('tab')
$('#' + tab + '-tab').trigger('click');

