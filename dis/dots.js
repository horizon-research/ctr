var canvas = document.querySelector('canvas#c11');
const context = canvas.getContext("2d");

// dot count
const dots = 2000;
// center point
const center = { x: canvas.width/2, y: canvas.height/2};
// max distance from the center
const radius = 150;
// centripetal force, the larger it gets the more concentrated the dots are
const centripetal = 0.5;

$('#c11').css('zIndex', '-10');

var createBlueDots = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i <= dots; i++) {
    context.beginPath();
    var rand_x = Math.random() * canvas.width;
    var rand_y = Math.random() * canvas.height;
    context.arc(rand_x, rand_y, 2, 1, 2 * Math.PI);
    context.fillStyle = '#888888';
    context.fill();
    context.closePath();
  }
}

