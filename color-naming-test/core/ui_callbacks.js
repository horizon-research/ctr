/***************************
     keyboard callbacks
***************************/

function set_keyboard_cb(enter_evt, slider_evt, ans_evt, train_ans_evt) {
  $("body").off('keydown');

  if (enter_evt) $("body").on('keydown', advance_phase_cb);
  else $("body").off('keydown', advance_phase_cb);

  if (slider_evt) $("body").on('keydown', key_slider_cb);
  else $("body").off('keydown', key_slider_cb);

  if (ans_evt) $("body").on('keydown', get_ans_cb);
  else $("body").off('keydown', get_ans_cb);

  if (train_ans_evt) $("body").on('keydown', get_train_ans_cb);
  else $("body").off('keydown', get_train_ans_cb);
}

function advance_phase_cb(e){
  if (e.which == 13) { // Enter key to advance to next phase
    if (pageId == 0) {
      prepare_info();
      if (para_single) pageId = 2;
      else pageId = 1;
    } else if (pageId == 1) {
      prepare_choice(); // it will set pageId depending on choice
    } else if (pageId == 2) {
      prepare_matching();
      pageId = 3;
    } else if (pageId == 3) {
      prepare_training();
      pageId = 4;
    } else if (pageId == 4) {
      prepare_test();
      pageId = 5;
    } else if (pageId == 5) {
      prepare_fb();
    }
  }
}

function get_train_ans_cb(e) {
  // https://stackoverflow.com/questions/4471582/keycode-vs-which
  // arrows to pick answers
  if (e.which == 81 || e.which == 87 || e.which == 65 || e.which == 83) {
    var map = {81: 0,
               87: 1,
               65: 2,
               83: 3,};
    if (map[e.which] == page.train_id) page.num_con_cors++;
    else page.num_con_cors = 0;
    $('#counter').text(page.num_con_cors.toString());

    if (page.num_con_cors = match_colors.length) {
      $('#trainbox').css('visibility', 'visible');

      set_keyboard_cb(true, false, false, false);

      return;
    }

    var id = Math.floor(Math.random() * 4);
    page.train_id = id;
    var sameC = shuffle([195, 200, 205]);
    for (var i = 0; i <= 3; i++) {
      if (i != id) state.colors[i] = new colorObj(sameC, 'srgb');
      else {
        var channel = 200 + Math.floor(Math.random() * 20);
        var idt = Math.floor(Math.random() * 3);
        var diffC = [18, 18, 18];
        diffC[idt] = channel;
        state.colors[i] = new colorObj(diffC, 'srgb');
      }
    }

    updatePlot(0, 3);
    $(page.slider).val(0);
  }
}

function key_slider_cb(e) {
  var current = parseFloat($(page.slider).val());

  function set_next(ang) {
    // TODO: change the unit to degree (in html as well) so that it's more precise.
    // this is a cyclic rotation.
    // technically no need to do since since sinusoids are periodic. we do
    // this here because we use the slider, which has to have a range.
    if (ang < -3.14) ang += 3.14*2;
    else if (ang > 3.14) ang -= 3.14*2;

    $(page.slider).val(ang);
    updatePlot(ang, 0)

    prof.incs++;
  }

  if (e.which == 37) {
    // left arrow
    set_next(current - 0.06);
  } else if (e.which == 39) {
    // right arrow
    set_next(current + 0.06);
  } else if (e.which == 32) {
    // space
    set_next(0);
  }
}

function get_ans_cb(e) {
  if (e.which >= 49 && e.which <= (49 + match_colors.length - 1)) { // 1 -- 8
    var ans = e.which-48;
    $('input[type=radio][id=ans'+ans+']').prop('checked',true);
  }

  if (e.which == 13) { // Enter
    var t = $('input[type=radio][name="pick"]:checked').attr('id');
    if (t) {
      prof.time_in_test.push(Date.now() - prof.start);
      prof.end_pos.push($(page.slider).val());

      var ans_name = $('label[for='+t+']').text();
      all_answers.push(ans_name.substring(2));
      prof.answer_color_id.push(ans_indices[ans_name.charAt(0) - 1]);

      $('input[type=radio][id='+t+']').prop('checked',false);
      if (colorId == test_colors.length) {
        $('#resbox').css('visibility', 'visible');
        set_keyboard_cb(true, false, false, false);
        colorId = 1; // reset in case we have to re-take the test
      } else {
        $('#title').text('Which Color is This? (' + (colorId+1).toString() + '/' + test_colors.length.toString() + ')');
        state.colors = [test_colors[colorId]];
        updatePlot(0, 3);
        prof.test_color_id.push(indices[colorId++]);
        $(page.slider).val(0);
      }

      prof.start = Date.now();
    }
  }
}

function fullscreenchanged() {
  if (!document.fullscreenElement) {
    // when exiting from fs
    $('#fsbox').css('visibility', 'visible');
    set_keyboard_cb(false, false, false, false);

    function goto_fs_cb(e) {
      if (e.which == 70) { // F
        $('#fsbox').css('visibility', 'hidden');
        openFullScreen();
        $("body").off('keydown', goto_fs_cb);
        set_keyboard_cb(false, true, true, false);
      }
    }
    $("body").on('keydown', goto_fs_cb);
  } else if (document.exitFullscreen) {
    // when entering fs
  }
}

/***************************
     click callbacks
***************************/
function next_pair_cb() {
  // log current pair
  training_colors[cid] = {
    color: rgb2hex($('#base').css('background-color')),
    id: '#color'+(cid+1).toString(),
  };
  cid++;
  training_colors[cid] = {
    color: rgb2hex($('#match').css('background-color')),
    id: '#color'+(cid+1).toString(),
  };
  cid++;

  if (cid == match_colors.length) {
    // finish matching
    //$('#matchbox').css('visibility', 'visible');
    set_keyboard_cb(true, false, false, false);
    $("#nextpair").off('click');

    var e = jQuery.Event("keydown");
    e.which = 13;
    e.keyCode = 13;
    $('body').trigger(e);

    // log matched pairs so that we don't have to rematch again
    if (!para_single) window.localStorage.setItem('matchedResults', JSON.stringify(training_colors.map(c => c.color)));
  } else if (cid <= match_colors.length - 2) {
    // set up next pair
    $('#pair').text('Pair ' + (cid/2+1).toString() + '/' + (match_colors.length/2).toString());
    $('#base').css('background-color', match_colors[cid]);
    $('#match').css('background-color', match_colors[cid+1]);

    var rgb = ($('#match').css('background-color')).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var match = new Color("srgb", [rgb[1]/255, rgb[2]/255, rgb[3]/255]);
    $('#sat_customRange').val(match.hsv.s);
    $('#val_customRange').val(match.hsv.v);
    $("#hue_customRange").attr({
       "max" : (match.hsv.h + 3) % 360,
       "min" : (match.hsv.h + 357) % 360,
    })
    $('#hue_customRange').val(match.hsv.h);

    if (cid == match_colors.length - 2) {
      $('#nextpair').text('Finish');
    }
  }
}

function change_sat_cb() {
  var sat = $('#sat_customRange').val();
  var val = $('#val_customRange').val();
  var hue = $('#hue_customRange').val();

  // https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
  var rgb = ($('#match').css('background-color')).match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  var match = new Color("srgb", [rgb[1]/255, rgb[2]/255, rgb[3]/255]);
  match.hsv.s = sat;
  match.hsv.v = val;
  match.hsv.h = hue;
  //match.hsv.h = $('#hue_customRange').val();

  $('#match').css('background-color', 'rgb(' + (match.srgb.r*255).toString() + ', ' 
      + (match.srgb.g*255).toString() + ', '
      + (match.srgb.b*255).toString() + ')');
}

function set_age_cb() {
  var val = this.value;
  page.info.age = val;
}

function set_eth_cb() {
  var val = this.value;
  page.info.ethnicity = val;
}

function set_sex_cb() {
  var val = this.value;
  page.info.sex = val;
}

function set_cvdtype_cb() {
  var val = this.value;
  page.info.cvdType = val; // just for logging purpose 

  // page.type is used for actual simulation.
  // TODO: best effort simulation. right now supports only three strong CVD
  // types. anomalous trichromacy is simulated the same as dichromacy; mono,
  // unknown, normal are simulated incorrectly
  if (val == 'Protanopia' || val == 'Protanomaly') page.type = 0;
  else if (val == 'Deuteranopia' || val == 'Deuteranomaly') page.type = 1;
  else if (val == 'Tritanopia' || val == 'Tritanomaly') page.type = 2;
}

function open_dashboard_cb() {
  // open the dashboard page
  window.open('/color-naming-test/dashboard/'+dashboardName+'.html');
}

function get_fb_cb() {
  const feedbackData = {uid: dashboardName,
                        fb: $('#fbtext').val()};

  //fetch('https://colorvision.cs.rochester.edu/upload-naming-feedback', {
  fetch('http://localhost:9812/upload-naming-feedback', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    body: JSON.stringify(feedbackData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(result => {
    // show live toast, which will auto hide
    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
    toastBootstrap.show()
  })
  .catch(error => console.error(error));
}

