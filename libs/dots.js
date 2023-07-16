var canvas = document.querySelector('canvas#c11');
const context = canvas.getContext("2d");

$('#c11').css('zIndex', '-10');

var createDots = function () {
  const dots = 2000;

  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i <= dots; i++) {
    context.beginPath();
    var rand_x = Math.random() * canvas.width;
    var rand_y = Math.random() * canvas.height;
    context.arc(rand_x, rand_y, 2, 1, 2 * Math.PI);
    context.fillStyle = 'rgb(160, 160, 160)';
    context.fill();
    context.closePath();
  }
}

