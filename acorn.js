var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");

var COLOR = "rgba(255,255,0, 1.0)";
var RADIUS = 10;

var acornImage = new Image();
acornImage.src = "./acorn.gif";

function Acorn (options) {
  this.pos = options.pos;
  this.radius = RADIUS;
  this.color = COLOR;
  this.game = options.game;
}

utils.inherits(Acorn, StationaryObject);

Acorn.prototype.toString = function() {
  return 'Acorn';
};

Acorn.prototype.draw = function(ctx) {
  ctx.drawImage(acornImage, this.pos[0] - RADIUS, this.pos[1] -RADIUS , RADIUS * 2, RADIUS * 2);
};


module.exports = Acorn;
