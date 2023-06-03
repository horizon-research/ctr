d3.csv('../ciexyzjv.csv').then(function(rows){
  // TODO: set some basic color config here?
  page = new pageObj(1);
  state = new discTestState();

  function registerPickType() {
    $('input[type=radio][name=pick]').change(function() {
      if (this.id == 'pickp') {
        page.type = 0;
      } else if (this.id == 'pickd') {
        page.type = 1;
      } else if (this.id == 'pickt') {
        page.type = 2;
      }
  
      // automatically update colors and re-plot
      if (page.init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 4);
    });
  
    // init color blindness type
    $('#pickd').prop("checked", true).trigger('change');
  
    // we don't want to change blindness type during test
    $('input[type=radio][name=pick]').prop('disabled', true);
  }

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

  function registerPickSimMethod() {
    $('input[type=radio][name=method]').change(function() {
      if (this.id == 'm1') {
        // one plane
        page.simMethod = 1;
      } else {
        // two planes
        page.simMethod = 0;
      }
      state.proj_mat = state.get_proj_mat();
  
      // automatically update colors and re-plot
      if (page.init) updatePlot($('#customRange').val(), 'rgbDiv', 'labDiv', 'xyDiv', 2);
    });
  
    // init simulation method
    $('#m2').prop("checked", true).trigger('change');
  
    $('input[type=radio][name=method]').prop('disabled', false);
  }

  function registerGetAns() {
    $('#s11, #s12, #s13, #s14').bind("click", getAnswer);
  }

  var showXy = true, showRGB = false, showLab = false, showExp = true, showConfig = true;

  page.configPage(registerPickType, registerSimMode, registerPickSimMethod, registerGetAns,
    showXy, showRGB, showLab, showExp, showConfig, rows);

  // set baseColor here
  page.submit(new colorObj([0.5, 0.9, 0.25], 'v_rgb'));
});

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tab = urlParams.get('tab')
$('#' + tab + '-tab').trigger('click');

