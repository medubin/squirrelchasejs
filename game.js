var Squirrel = require('./squirrel');
var Dog = require('./dog');
var utils = require ("./utils");
function Game(numSquirrels) {
  this.numSquirrels = numSquirrels;
  this.dimX = 1000;
  this.dimY = 600;
  this.squirrels = [];
  this.addSquirrel();
  this.dog = new Dog({game: this, pos: this.randPosition()});
  this.points = 0;
}

Game.prototype.addSquirrel = function () {
  for (var i = 0; i < this.numSquirrels; i++) {
    this.squirrels.push(new Squirrel({pos: this.randPosition(), game: this}));
  }
};

Game.prototype.randPosition = function() {
  return [Math.floor(this.dimX * Math.random()),
          Math.floor(this.dimY * Math.random())];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0,this.dimX , this.dimY + 50);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }
  this.drawBottom(ctx);
  this.drawLives(ctx);
  this.drawPoints(ctx);

};

Game.prototype.drawPoints = function(ctx) {
  ctx.font="50px Courier";
  ctx.fillStyle = "white";
  ctx.fillText(this.points,this.dimX - (50 + (25 * this.points.toString().length)) , this.dimY + 40);

};

Game.prototype.drawBottom = function(ctx) {
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.rect(0,this.dimY,this.dimX, 50);
  ctx.stroke();
  ctx.fill();
};

Game.prototype.drawlife = function(ctx, offset) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.0)';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.lineTo(15 + offset,this.dimY + 25);
  ctx.arc(15 + offset,this.dimY + 25,this.dog.radius,
      0.6*Math.PI, 1.4*Math.PI, true);
      ctx.fill();
  ctx.lineTo(15 + offset,this.dimY + 25);
  ctx.stroke();
};

Game.prototype.drawLives = function(ctx) {
  for (var i = 0; i < this.dog.lives; i++) {
    this.drawlife(ctx, i * 25);
  }
};



Game.prototype.moveObjects = function() {
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].move(this.dog.pos);
    this.allObjects()[i].wrap();
  }
};

Game.prototype.wrap = function (pos) {
  var xpos = pos[0] % this.dimX;
  var ypos = pos[1] % this.dimY;
  if (xpos < 0) xpos = this.dimX ;
  if (ypos < 0) ypos = this.dimY ;

  return [xpos, ypos];
};

Game.prototype.checkCollisons = function () {
  for (var i = this.allObjects().length - 1; i >= 0; i--) {
    for(var j = i - 1; j >= 0; j--){
      if (this.objectsCollided(this.allObjects()[i],this.allObjects()[j])) {
        this.allObjects()[i].collideWith(this.allObjects()[j]);
      }
      if (this.objectsCollided(this.allObjects()[j],this.allObjects()[i])){
        this.allObjects()[j].collideWith(this.allObjects()[i]);
      }
    }
  }
};

Game.prototype.objectsCollided = function (obj1, obj2) {
  return (obj1 && obj2 && obj1.isCollidedWith(obj2));
};



Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisons();
  this.dog.applyFriction(0.03);
};


Game.prototype.remove = function(object) {
  if (object instanceof Squirrel) {
    this.squirrels.splice(this.squirrels.indexOf(object), 1);
  }
};
Game.prototype.allObjects = function() {
  return this.squirrels.concat(this.dog);
};

Game.prototype.isOutOfBounds = function (pos) {
    if ( pos[0] > this.dimX || pos[0] < 0 ) {
      return 'X';
    } else if (pos[1] > this.dimY || pos[1] < 0)  {
      return 'Y';
    }


};

Game.prototype.playerLoses = function () {
  return (this.dog.lives === 0);
};

Game.prototype.playerWins = function () {
  return (this.squirrels.length === 0);
};

Game.prototype.over = function () {
  return (this.playerLoses() || this.playerWins());
};


module.exports = Game;
