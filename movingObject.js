var utils = require ("./utils");


function MovingObject(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;

}

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0],this.pos[1],this.radius,2*Math.PI,0, true);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

MovingObject.prototype.applyFriction = function (factor) {
  this.vel[0] -= this.vel[0] * factor;
  this.vel[1] -= this.vel[1] * factor;
};


MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

MovingObject.prototype.wrap = function () {
  var outOfBounds = this.game.isOutOfBounds(this.pos);
  if (outOfBounds === 'X') {
      this.vel[0] = this.vel[0] * -1;
  } else if (outOfBounds === 'Y') {
      this.vel[1] = this.vel[1] * -1;
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  return utils.distanceBetween(this.pos, otherObject.pos) <
                              (this.radius + otherObject.radius);

};

MovingObject.prototype.collideWith = function (otherObject) {


};

 module.exports = MovingObject;
