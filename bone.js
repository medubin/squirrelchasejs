var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");

var RADIUS = 30;

var boneImage = new Image();
boneImage.src = "./sprites/bone.png";

function Bone (options) {
  this.pos = options.pos;
  this.radius = RADIUS;
  this.game = options.game;
}

utils.inherits(Bone, StationaryObject);

Bone.prototype.toString = function() {
  return 'Bone';
};

Bone.prototype.draw = function(ctx) {
  ctx.drawImage(boneImage, this.pos[0]- 1/3*RADIUS , this.pos[1]- 1/3*RADIUS , RADIUS * 2/3, RADIUS * 2/3);
  // ctx.beginPath();
  // ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
  // ctx.lineWidth = 1;
  // ctx.strokeStyle = 'white';
  // ctx.stroke();


};


module.exports = Bone;
