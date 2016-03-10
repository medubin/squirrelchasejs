var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");


var RADIUS = 60;

var bushImage = new Image();
bushImage.src = "./sprites/bush.gif";

function Bush (options) {
  this.pos = options.pos;
  this.radius = RADIUS;

  this.game = options.game;
}

utils.inherits(Bush, StationaryObject);

Bush.prototype.toString = function() {
  return 'Bush';
};

Bush.prototype.draw = function(ctx) {
  ctx.drawImage(bushImage, this.pos[0]- 1/2*RADIUS , this.pos[1]- 1/2*RADIUS , RADIUS, RADIUS);
  // ctx.beginPath();
  // ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = 'white';
  // ctx.stroke();


};


module.exports = Bush;
