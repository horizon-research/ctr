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
      pageId = 1;
    } else if (pageId == 1) {
      prepare_matching();
      pageId = 2;
    } else if (pageId == 2) {
      prepare_training();
      pageId = 3;
    } else if (pageId == 3) {
      prepare_test();
      pageId = 4;
    } else if (pageId == 4) {
      prepare_results();
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

    if (page.num_con_cors == 6) {
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

var colorId = 1; // TODO: move to a global object
function get_ans_cb(e) {
  if (e.which >= 49 && e.which <= 54) {
    var ans = e.which-48;
    $('input[type=radio][id=ans'+ans+']').prop('checked',true);
  }

  if (e.which == 13) {
    var t = $('input[type=radio][name="pick"]:checked').attr('id');
    if (t) {
      var ans_name = $('label[for='+t+']').text();
      all_answers.push(ans_name.substring(2));
      prof.answer_color_id.push(ans_indices[ans_name.charAt(0) - 1]);

      prof.time_in_test.push(Date.now() - prof.start);
      prof.end_pos.push($(page.slider).val());
      prof.start = Date.now();

      $('input[type=radio][id='+t+']').prop('checked',false);
      if (colorId == 6) {
        $('#resbox').css('visibility', 'visible');
        set_keyboard_cb(true, false, false, false);
      } else {
        state.colors = [all_tests[indices[colorId]].obj];
        updatePlot(0, 3);
        prof.test_color_id.push(indices[colorId++]);
        $(page.slider).val(0);
      }
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
  // TODO: move to a global obj
  var match_colors = ['#E00201', '#975B39', '#3A3EE9', '#9400D3', '#EDEE33', '#7FFF00'];

  // log current pair
  all_tests[cid] = {
    color: rgb2hex($('#base').css('background-color')),
    id: '#color'+(cid+1).toString(),
  };
  cid++;
  all_tests[cid] = {
    color: rgb2hex($('#picker')[0].jscolor.toRGBString()), // https://jscolor.com/
    id: '#color'+(cid+1).toString(),
  };
  cid++;

  if (cid == 6) {
    // finish matching
    //$('#matchbox').css('visibility', 'visible');
    set_keyboard_cb(true, false, false, false);
    $("#nextpair").off('click');

    var e = jQuery.Event("keydown");
    e.which = 13;
    e.keyCode = 13;
    $('body').trigger(e);
    return;
  } else if (cid <= 4) {
    // set up next pair
    $('#pair').text('Pair ' + (cid/2+1).toString() + '/3');
    $('#base').css('background-color', match_colors[cid]);
    $('#picker')[0].jscolor.fromString(match_colors[cid+1]);
    if (cid == 4) {
      $('#nextpair').text('Finish');
    }
  }
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
  // types. mono, unknown, normal are simulated incorrectly
  if (val == 'prot' || val == 'proa') page.type = 0;
  else if (val == 'deut' || val == 'deua') page.type = 1;
  else if (val == 'trit' || val == 'tria') page.type = 2;
}

function open_dashboard_cb() {
  // open the dashboard page
  window.open('/color-discrimination-test/dashboard/'+dashboardName+'.html');
}

function get_fb_cb() {
  const feedbackData = {uid: dashboardName,
                        fb: $('#fbtext').val()};

  //fetch('https://colorvision.cs.rochester.edu/upload-feedback', {
  fetch('http://localhost:9812/upload-feedback', {
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

