var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Dog = require("./dog");

var COLOR = "rgba(139,69,19, 1.0)";
var RADIUS = 10;
var SPEED = 3;

function Squirrel (options) {
  this.pos = options.pos;
  this.game = options.game;
  this.vel = [0,0];//utils.randomVect(SPEED);
  this.radius = RADIUS;
  this.color = COLOR;
  this.direct = 0;
  this.randomDirectOffset = (Math.random() - 0.5) * 2;
  this.maxSpeed = SPEED + (Math.random() - 0.5);
  this.dazed = 0;
}
utils.inherits(Squirrel, MovingObject);


Squirrel.prototype.collideWith = function (otherObject) {
  if (otherObject.toString() === 'Squirrel') {
    this.vel[0] = this.vel[0] * -1;
    this.vel[1] = this.vel[1] * -1;
  }
};




Squirrel.prototype.draw = function(ctx) {
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


Squirrel.prototype.toString = function() {
  return 'Squirrel';
};

Squirrel.prototype.chase = function(pos) {
    var deltaY = pos[1] - this.pos[1];
    var deltaX = pos[0] - this.pos[0];
    var angleInRadians = Math.atan2(deltaY, deltaX);
    this.turn(angleInRadians);
};

Squirrel.prototype.turn = function (angle) {
  this.direct = angle + this.randomDirectOffset;
  // this.direct = this.direct % (Math.PI * 2);
  // console.log(this.direct);

};

// var xVel = impulse * Math.cos(this.direct) + this.vel[0];
// var yVel = impulse * Math.sin(this.direct) + this.vel[1];




Squirrel.prototype.move = function(pos) {
  this.chase(pos);

  //follow and accel

  var xVel = 0.5 * Math.cos(this.direct) + this.vel[0];
  var yVel = 0.5 * Math.sin(this.direct) + this.vel[1];

  this.vel[0] = (Math.abs(xVel) > this.maxSpeed ? (this.maxSpeed * (xVel/Math.abs(xVel))) : xVel);
  this.vel[1] = (Math.abs(yVel) > this.maxSpeed ? (this.maxSpeed * (yVel/Math.abs(yVel))) : yVel);


//follow
  // this.vel[0] = (SPEED + this.randomVelOffset) * Math.cos(this.direct);
  // this.vel[1] = (SPEED + this.randomVelOffset) * Math.sin(this.direct);


  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

};




module.exports = Squirrel;
