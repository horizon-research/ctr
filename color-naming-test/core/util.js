// must use the base color for t1, because we want to get the orthogonal lines wrt to base color
// also t2_new can be arbitrary
function get_ortho_line_rgb(line_rgb, baseColor) {
  // take |line| in xy and return an rgb line that when projected in xy is orthogonal to |line|
  var t1 = baseColor;
  var t2 = new colorObj(math.add(t1.linear_p3, math.multiply(line_rgb, 0.2)), 'linear_p3');
  var line_xy = normalize(math.subtract(t1.xy, t2.xy)); 
  var line_ortho_xy = normalize([line_xy[1], -line_xy[0]]);
  //var t1_new = new colorObj([86, 95, 214], 'srgb');
  var t2_new_xy = math.add(t1.xy, math.multiply(line_ortho_xy, 1)); 
  var t2_new = new colorObj([t2_new_xy[0], t2_new_xy[1], 1-t2_new_xy[0]-t2_new_xy[1]], 'xyz'); // up to scaling
  var line_ortho_rgb = normalize(math.subtract(t1.linear_p3, t2_new.linear_p3));

  return line_ortho_rgb;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function hex_to_srgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var color = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];

  return color;
}

//https://www.w3schools.com/jsref/met_element_exitfullscreen.asp
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
function openFullScreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function post_data(data) {
  const jsonData = JSON.stringify(data);

  //fetch('https://colorvision.cs.rochester.edu/upload-naming-data', {
  fetch('http://localhost:9812/upload-naming-data', {
    method: 'POST',
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    body: jsonData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  //.then(response => console.log(response.ok))
  .then(response => response.text())
  .then(result => {
    dashboardName = result;
  })
  .catch(error => console.error(error));
}

