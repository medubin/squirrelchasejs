var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");

var COLOR = "rgba(255,255,0, 1.0)";
var RADIUS = 60;

var bushImage = new Image();
bushImage.src = "./bush.gif";

function Bush (options) {
  this.pos = options.pos;
  this.radius = RADIUS;
  this.color = COLOR;
  this.game = options.game;
}

utils.inherits(Bush, StationaryObject);

Bush.prototype.toString = function() {
  return 'Bush';
};

Bush.prototype.draw = function(ctx) {
  ctx.drawImage(bushImage, this.pos[0]- 1/2*RADIUS , this.pos[1]- 1/2*RADIUS , RADIUS, RADIUS);
  ctx.beginPath();
  ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();


};


module.exports = Bush;
