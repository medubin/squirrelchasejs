var utils = require ("./utils");


function StationaryObject(options) {
  this.pos = options.pos;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;

}

StationaryObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0],this.pos[1],this.radius,2*Math.PI,0, true);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};



StationaryObject.prototype.isCollidedWith = function(otherObject) {
  return utils.distanceBetween(this.pos, otherObject.pos) <
                              (this.radius + otherObject.radius);

};

StationaryObject.prototype.collideWith = function (otherObject) {


};

 module.exports = StationaryObject;
