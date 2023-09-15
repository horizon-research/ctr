const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var current_ang = 0;

// https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2
//if (typeof DeviceOrientationEvent.requestPermission === 'function') {
//  DeviceOrientationEvent.requestPermission()
//    .then(permissionState => {
//      if (permissionState === 'granted') {
//        window.addEventListener('deviceorientation', handleOrientation);
//      }
//    })
//    .catch(console.error);
//} else {
//  window.addEventListener('deviceorientation', handleOrientation);
//}

function handleOrientation(event) {
  const rotateDegrees = event.alpha; // alpha: about z-axis
  const frontToBack = event.beta; // beta: about x-axis
  const leftToRight = event.gamma; // gamma: about y-axis

  handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
}

const handleOrientationEvent = (frontToBack, leftToRight, rotateDegrees) => {
  current_ang = rotateDegrees / 180 * Math.PI;
};

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
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running){
    window.removeEventListener("deviceorientation", handleOrientation);
    is_running = false;
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
    is_running = true;
  }

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function drawRotate() {
  if (video.paused || video.ended) {
    return;
  }

  // Draw the video frame on the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  rotate(imageData);
  ctx.putImageData(imageData, 0, 0);

  ctx.font = "20px Arial";
  ctx.fillStyle = "#ff0000";
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText((current_ang / Math.PI * 180).toFixed(1).toString(), canvas.width/2, 100);

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

function rotate(imgData) {
  var img = imgData.data;
  var rotMat = getMat(current_ang);

  for (let i = 0; i < img.length; i += 4) {
    var red = img[i];
    var green = img[i+1];
    var blue = img[i+2];

    var new_red = red * rotMat[0][0] + green * rotMat[1][0] + blue * rotMat[2][0];
    var new_green = red * rotMat[0][1] + green * rotMat[1][1] + blue * rotMat[2][1];
    var new_blue = red * rotMat[0][2] + green * rotMat[1][2] + blue * rotMat[2][2];

    img[i] = new_red;
    img[i + 1] = new_green;
    img[i + 2] = new_blue;
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

