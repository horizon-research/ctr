// dot count
const dots = 500;
// center point
const center = { x: 100, y: 100 };
// max distance from the center
const radius = 150;
// centripetal force, the larger it gets the more concentrated the dots are
const centripetal = 0.5;

var canvas = document.querySelector('canvas#c11');
const context = canvas.getContext("2d");

var createBlueDots = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i <= dots; i++) {
    context.beginPath();
    const dist = (Math.random() ** centripetal) * radius;
    const angle = Math.random() * Math.PI * 2;
    var rand_x = dist * Math.cos(angle) + center.x;
    var rand_y = dist * Math.sin(angle) + center.y;
    context.arc(rand_x, rand_y, 2, 1, 2 * Math.PI);
    context.fillStyle = '#888888';
    context.fill();
    context.closePath();
  }
}

