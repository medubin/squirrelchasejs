var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Dog = require("./dog");

var COLOR = "rgba(139,69,19, 1.0)";
var RADIUS = 10;
var SPEED = 6;

function Squirrel (options) {
  this.gen = options.gen;
  this.pos = options.pos;
  this.game = options.game;
  this.vel = utils.randomVect(SPEED);
  this.radius = RADIUS;
  this.color = COLOR;
  this.direct = 0;
}
utils.inherits(Squirrel, MovingObject);



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
    this.turn(Math.random()-0.5);
    var deltaY = this.pos[1] - pos[1];
    var deltaX = this.pos[0] - pos[0];


  var angleInDegrees = Math.atan(deltaY / deltaX) * 180 / Math.PI;
  console.log(angleInDegrees);
  // this.vel[0] = SPEED * Math.sin((pos[0] - this.pos[0]) / (pos[1] - this.pos[1]));
  // this.vel[1] = SPEED * Math.cos((pos[0] - this.pos[0]) / (pos[1] - this.pos[1]) );
};

Squirrel.prototype.turn = function (angle) {
  this.direct += angle;

};

// var xVel = impulse * Math.cos(this.direct) + this.vel[0];
// var yVel = impulse * Math.sin(this.direct) + this.vel[1];




Squirrel.prototype.move = function(pos) {
  this.vel[0] = SPEED * Math.cos(this.direct);
  this.vel[1] = SPEED * Math.sin(this.direct);

  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.chase(pos);
};




module.exports = Squirrel;
