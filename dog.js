var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Squirrel = require('./squirrel');

var COLOR = "rgba(0, 0, 0, 1.0)";
var RADIUS = 15;
var SPEED = [0,0];
var DIRECTION = 0;


function Dog (options) {
  this.game = options.game;
  this.vel = SPEED;
  this.radius = RADIUS;
  this.color = COLOR;
  this.pos = options.pos;
  this.direct = 0;
  this.lives = 3;

}
utils.inherits(Dog, MovingObject);

Dog.prototype.relocate = function () {
  this.vel = [0,0];
  this.pos = this.game.randPosition();
  this.lives--;

};
Dog.prototype.MAX_VELOCITY = 10;
Dog.prototype.power = function (impulse) {
  var xVel = impulse * Math.cos(this.direct) + this.vel[0];
  var yVel = impulse * Math.sin(this.direct) + this.vel[1];

  this.vel = [
   xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
   yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
 ];

};



Dog.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.lineTo(this.pos[0],this.pos[1]);
  ctx.arc(this.pos[0],this.pos[1],this.radius,this.direct +
      0.6*Math.PI,this.direct + 1.4*Math.PI, true);
  ctx.lineTo(this.pos[0],this.pos[1]);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.stroke();
};

Dog.prototype.turn = function (angle) {
  this.direct += angle;

};




Dog.prototype.collideWith = function (otherObject) {
  console.log(otherObject.toString());
  if (otherObject.toString() === 'Squirrel') {
    this.relocate();
  } else if (otherObject.toString() === 'Acorn') {
    this.game.remove(otherObject);


  }
};


module.exports = Dog;
