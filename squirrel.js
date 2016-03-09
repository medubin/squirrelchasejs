var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Dog = require("./dog");

var COLOR = "rgba(139,69,19, 1.0)";
var RADIUS = 15;
var SPEED = 3;


// var squirrelImage = new Image();
// squirrelImage.src = "./squirrel.png";


var squirrelSprite = new Image();
squirrelSprite.src = "./squirrel_sprites.png";

var tickCount = 0;
var frameIndex = 0;
var numberOfFrames = 3;

function sprite (options) {
    var that = {};
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    // that.frameIndex = 0;
    // that.tickCount = 0;
    that.ticksPerFrame = 4;

    that.render = function () {
        that.context.drawImage(
           that.image,
           frameIndex * that.width / 3,
           0,
           that.width / 3,
           that.height,
           -RADIUS,
           -RADIUS,
           RADIUS * 2,
           RADIUS * 2
         );
    };

    that.update = function () {
      tickCount += 1;
      if (tickCount > that.ticksPerFrame) {
        tickCount = 0;
        if (frameIndex < numberOfFrames - 1) {
          frameIndex += 1;
          } else {
          frameIndex = 0;
          }
        }
    };
    return that;
}





function Squirrel (options) {
  this.pos = options.pos;
  this.game = options.game;
  this.vel = [0,0];//utils.randomVect(SPEED);
  this.radius = RADIUS;
  this.color = COLOR;
  this.direct = 0;
  this.randomDirectOffset = (Math.random() - 0.5) * 2;
  this.maxSpeed = SPEED + (Math.random()) * 1.3;
  this.dazed = 0;
}
utils.inherits(Squirrel, MovingObject);


Squirrel.prototype.collideWith = function (otherObject, tempVel) {
  if (otherObject.toString() === 'Bush') {
    this.vel[0] = this.vel[0] * 2/3;
    this.vel[1] = this.vel[1] * 2/3;
  }
  // if (otherObject.toString() === 'Squirrel') {
  //   this.vel = otherObject.vel;
  //   if (tempVel) this.vel = tempVel;


  // }
};




Squirrel.prototype.draw = function(ctx) {
  if (!squirrelSpriteImage) var squirrelSpriteImage = sprite({
    context: ctx,
    width: 96,
    height: 32,
    image: squirrelSprite
});

  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.direct - Math.PI / 2);

  squirrelSpriteImage.render();
  squirrelSpriteImage.update();
  ctx.setTransform(1,0,0,1,0,0);

  ctx.beginPath();
  ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
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
};



Squirrel.prototype.move = function(pos) {
  this.chase(pos);

  //follow and accel

  var xVel = 0.5 * Math.cos(this.direct) + this.vel[0];
  var yVel = 0.5 * Math.sin(this.direct) + this.vel[1];

  this.vel[0] = (Math.abs(xVel) > this.maxSpeed ? (this.maxSpeed * (xVel/Math.abs(xVel))) : xVel);
  this.vel[1] = (Math.abs(yVel) > this.maxSpeed ? (this.maxSpeed * (yVel/Math.abs(yVel))) : yVel);


  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

};




module.exports = Squirrel;
