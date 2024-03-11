const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var current_ang = 0;

//function handleOrientation(event) {
//  const rotateDegrees = event.alpha; // alpha: about z-axis
//  const frontToBack = event.beta; // beta: about x-axis
//  const leftToRight = event.gamma; // gamma: about y-axis
//
//  handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
//}
//
//const handleOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
//  current_ang = rotateDegrees / 180 * Math.PI;
//};

// Request access to the user's camera
navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"} })
  .then(stream => {
    video.addEventListener('play', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawRotate();
    });

    video.srcObject = stream;
  })
  .catch(error => {
    console.error('Error accessing the camera:', error);
  });

$('body').on('click', toggleVideo);

let is_running = false;
function toggleVideo() {
  // Request permission for iOS 13+ devices
  // This must be under an event handler
  //if (
  //  DeviceMotionEvent &&
  //  typeof DeviceMotionEvent.requestPermission === "function"
  //) {
  //  DeviceMotionEvent.requestPermission();
  //}
  //if (is_running){
  //  window.removeEventListener("deviceorientation", handleOrientation);
  //  is_running = false;
  //} else {
  //  window.addEventListener("deviceorientation", handleOrientation);
  //  is_running = true;
  //}

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

let xPos, xDelta, cur_start_ang;
const touchStart = (event) => {
  var touchobj = event.changedTouches[0];
  xPos = touchobj.pageX;
  cur_start_ang = current_ang;
};
const touchMove = (event) => {
  var touchobj = event.changedTouches[0];
  xDelta = touchobj.pageX - xPos;
  //console.log(xDelta);
  current_ang = cur_start_ang + xDelta/4 * (Math.PI/180); // as if two pixels == one degree

  // technically no need for this; do this just so we show angles between -PI and PI
  if (current_ang < -Math.PI) current_ang += Math.PI*2;
  else if (current_ang > Math.PI) current_ang -= Math.PI*2;
};

// TODO: conflicts with click to start/stop video; the idea is to use double tap to reset current_ang to 0.
//var lastTouchEnd = 0;
//var doubleTapThreshold = 200; // Adjust this value as needed
//const touchEnd = (event) => {
//  var now = new Date().getTime();
//  if (now - lastTouchEnd <= doubleTapThreshold) {
//    event.preventDefault();
//    // Double tap detected, do something here
//    current_ang = 0;
//  }
//  lastTouchEnd = now;
//}

window.addEventListener('touchstart', touchStart);
window.addEventListener('touchmove', touchMove);
//window.addEventListener("touchend", touchEnd);

function drawRotate() {
  // still allow rotation even when video is paused
  if (video.ended) {
    return;
  }

  // Draw the video frame on the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  rotate(imageData);
  ctx.putImageData(imageData, 0, 0);

  ctx.font = "40px Arial";
  ctx.fillStyle = "#ff0000";
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(((current_ang + 2 * Math.PI) % (2 * Math.PI) / Math.PI * 180).toFixed(1).toString(), canvas.width/2, 100);

  requestAnimationFrame(drawRotate);
}

function getMat(theta) {
  var u = 1/Math.sqrt(3)
  var cos = Math.cos(theta)
  var sin = Math.sin(theta)

  var rotMat = [
    [cos + u*u*(1-cos), u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin],
    [u*u*(1-cos)+u*sin, cos+u*u*(1-cos), u*u*(1-cos)-u*sin],
    [u*u*(1-cos)-u*sin, u*u*(1-cos)+u*sin, cos+u*u*(1-cos)]
  ];

  return rotMat;
}

var one_plane_proj_mat = [[1, 0, 0], [0.9513091993895777, 0, 0.048669920911279516], [0, 0, 1]];
var simMat = math.multiply(color_consts.LMS_to_lin_sRGB,
    math.multiply(one_plane_proj_mat, color_consts.lin_sRGB_to_LMS));

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const para_sim = urlParams.get('sim')

let is_sim = (para_sim == "true") ? true : false;

function rotate(imgData) {
  var img = imgData.data;
  var rotMat = getMat(-current_ang);

  for (let i = 0; i < img.length; i += 4) {
    var red = img[i];
    var green = img[i+1];
    var blue = img[i+2];

    if (!is_sim) {
      // rotate in linear sRGB space
      var red_lin   = removeGamma(red/255);
      var green_lin = removeGamma(green/255);
      var blue_lin  = removeGamma(blue/255);
      red   = quantize(applyGamma(red_lin * rotMat[0][0] + green_lin * rotMat[1][0] + blue_lin * rotMat[2][0]));
      green = quantize(applyGamma(red_lin * rotMat[0][1] + green_lin * rotMat[1][1] + blue_lin * rotMat[2][1]));
      blue  = quantize(applyGamma(red_lin * rotMat[0][2] + green_lin * rotMat[1][2] + blue_lin * rotMat[2][2]));

      // simply rotate in sRGB space
      //red   = red * rotMat[0][0] + green * rotMat[1][0] + blue * rotMat[2][0];
      //green = red * rotMat[0][1] + green * rotMat[1][1] + blue * rotMat[2][1];
      //blue  = red * rotMat[0][2] + green * rotMat[1][2] + blue * rotMat[2][2];
    } else {
      // using math.js is very slow presumably because of the long call stack, so manually construct the matrix.
      var transMat = [
        [rotMat[0][0] * simMat[0][0] + rotMat[0][1] * simMat[1][0] + rotMat[0][2] * simMat[2][0],
         rotMat[0][0] * simMat[0][1] + rotMat[0][1] * simMat[1][1] + rotMat[0][2] * simMat[2][1],
         rotMat[0][0] * simMat[0][2] + rotMat[0][1] * simMat[1][2] + rotMat[0][2] * simMat[2][2],
        ],
        [rotMat[1][0] * simMat[0][0] + rotMat[1][1] * simMat[1][0] + rotMat[1][2] * simMat[2][0],
         rotMat[1][0] * simMat[0][1] + rotMat[1][1] * simMat[1][1] + rotMat[1][2] * simMat[2][1],
         rotMat[1][0] * simMat[0][2] + rotMat[1][1] * simMat[1][2] + rotMat[1][2] * simMat[2][2],
        ],
        [rotMat[2][0] * simMat[0][0] + rotMat[2][1] * simMat[1][0] + rotMat[2][2] * simMat[2][0],
         rotMat[2][0] * simMat[0][1] + rotMat[2][1] * simMat[1][1] + rotMat[2][2] * simMat[2][1],
         rotMat[2][0] * simMat[0][2] + rotMat[2][1] * simMat[1][2] + rotMat[2][2] * simMat[2][2],
        ],
      ];

      var red_lin   = removeGamma(red/255);
      var green_lin = removeGamma(green/255);
      var blue_lin  = removeGamma(blue/255);

      red   = quantize(applyGamma(red_lin * transMat[0][0] + green_lin * transMat[1][0] + blue_lin * transMat[2][0]));
      green = quantize(applyGamma(red_lin * transMat[0][1] + green_lin * transMat[1][1] + blue_lin * transMat[2][1]));
      blue  = quantize(applyGamma(red_lin * transMat[0][2] + green_lin * transMat[1][2] + blue_lin * transMat[2][2]));
    }

    // presumably canvas does the clamping
    img[i] = red;
    img[i + 1] = green;
    img[i + 2] = blue;
  }
}

//$("body").on('keydown', change_angle_cb);
//function change_angle_cb(e) {
//  function set_next(ang) {
//    // TODO: change the unit to degree (in html as well) so that it's more precise.
//    // this is a cyclic rotation.
//    // technically no need to do since since sinusoids are periodic. we do
//    // this here because we use the slider, which has to have a range.
//    if (ang < -3.14) ang += 3.14*2;
//    else if (ang > 3.14) ang -= 3.14*2;
//
//    current_ang = ang;
//  }
//
//  if (e.which == 37) {
//    // left arrow
//    set_next(current_ang - 0.06);
//  } else if (e.which == 39) {
//    // right arrow
//    set_next(current_ang + 0.06);
//  } else if (e.which == 32) {
//    // space
//    set_next(0);
//  }
//}

