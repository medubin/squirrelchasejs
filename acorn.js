var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");

var RADIUS = 30;

var acornImage = new Image();
acornImage.src = "./sprites/acorn.gif";

function Acorn (options) {
  this.pos = options.pos;
  this.radius = RADIUS;
  this.game = options.game;
}

utils.inherits(Acorn, StationaryObject);

Acorn.prototype.toString = function() {
  return 'Acorn';
};

Acorn.prototype.draw = function(ctx) {
  ctx.drawImage(acornImage, this.pos[0]- 1/3*RADIUS , this.pos[1]- 1/3*RADIUS , RADIUS * 2/3, RADIUS * 2/3);
  // ctx.beginPath();
  // ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = 'white';
  // ctx.stroke();


};


module.exports = Acorn;
