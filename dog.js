var utils = require ("./utils");
var MovingObject = require ("./movingObject");
var Squirrel = require('./squirrel');

var COLOR = "rgba(0, 0, 0, 1.0)";
var RADIUS = 30;
var SPEED = [0,0];
var DIRECTION = 0;
var dogImage = new Image();
dogImage.src = "./dog.gif";

var dogSprite = new Image();
dogSprite.src = "./dog_sprites.gif";

var tickCount = 0;
var frameIndex = 0;
var numberOfFrames = 3;

function sprite (options) {
    var that = {};
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
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
      // tickCount += 1;
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



function Dog (options) {
  this.game = options.game;
  this.vel = SPEED;
  this.radius = RADIUS;
  this.color = COLOR;
  this.pos = options.pos;
  this.direct = 0;
  this.lives = 1;

}
utils.inherits(Dog, MovingObject);

Dog.prototype.relocate = function () {
  this.vel = [0,0];
  this.pos = this.game.randPosition();
  this.lives--;
};


Dog.prototype.MAX_VELOCITY = 10;

Dog.prototype.power = function (impulse) {

  tickCount += 1;
  var xVel = impulse * Math.cos(this.direct) + this.vel[0];
  var yVel = impulse * Math.sin(this.direct) + this.vel[1];

  this.vel = [
   xVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : xVel,
   yVel > this.MAX_VELOCITY ? this.MAX_VELOCITY : yVel
 ];

};



Dog.prototype.draw = function(ctx) {
  if (!dogSpriteImage) var dogSpriteImage = sprite({
    context: ctx,
    width: 120,
    height: 40,
    image: dogSprite
});
  ctx.translate(this.pos[0], this.pos[1]);
  ctx.rotate(this.direct - Math.PI / 2);
  dogSpriteImage.render();
  dogSpriteImage.update();
  ctx.setTransform(1,0,0,1,0,0);
};

Dog.prototype.turn = function (angle) {
  tickCount += 1;
  this.direct += angle;
  this.direct = this.direct % (Math.PI * 2);
};




Dog.prototype.collideWith = function (otherObject) {
  if (otherObject.toString() === 'Squirrel') {
    this.relocate();
  } else if (otherObject.toString() === 'Acorn') {
    this.game.remove(otherObject);


  }
};


module.exports = Dog;
