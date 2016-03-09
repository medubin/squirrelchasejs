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
  var outOfBounds = this.game.isOutOfBounds(this.pos, this.radius);
  if (outOfBounds === 'X') {
    this.vel[0] = this.vel[0] * -1;
    if (this.pos[0] > this.game.dimX / 2) {
      this.pos[0] = this.game.dimX - this.radius;
    } else {
      this.pos[0] = 0 + this.radius;
    }

  } else if (outOfBounds === 'Y') {
    this.vel[1] = this.vel[1] * -1;
    if (this.pos[1] > this.game.dimY / 2) {
      this.pos[1] = this.game.dimY - this.radius;
    } else {
      this.pos[1] = 0 + this.radius;
    }
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  return utils.distanceBetween(this.pos, otherObject.pos) <
                              ((this.radius + otherObject.radius)/2);

};

MovingObject.prototype.collideWith = function (otherObject) {


};

 module.exports = MovingObject;
