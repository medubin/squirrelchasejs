var Squirrel = require('./squirrel');
var Dog = require('./dog');
var utils = require ("./utils");
var Acorn = require('./acorn');
function Game(numSquirrels) {
  this.numSquirrels = numSquirrels;
  this.dimX = 1000;
  this.dimY = 600;
  this.squirrels = [];
  this.acorns = [];
  this.dog = new Dog({game: this, pos: [this.dimX/2, this.dimY/2]});
  this.points = 0;
}

Game.prototype.addSquirrels = function () {
  for (var i = 0; i < this.numSquirrels; i++) {
    this.squirrels.push(new Squirrel({pos: this.randSquirrelPosition(), game: this}));
  }
};

Game.prototype.addAcorns = function() {
  if (this.acorns.length === 0) {
    this.acorns.push(new Acorn({pos: this.randPosition(), game: this}));
    this.acorns.push(new Acorn({pos: this.randPosition(), game: this}));
    this.addSquirrels();
  }
};

Game.prototype.randPosition = function() {
  return [Math.floor(this.dimX * 0.8 * Math.random()) + this.dimX * 0.1,
          Math.floor(this.dimY * 0.8 * Math.random()) + this.dimY * 0.1];
};

Game.prototype.randSquirrelPosition = function() {
  var startPosition = [Math.floor(this.dimX * Math.random()),Math.floor(this.dimY * Math.random())];
  if (Math.floor(Math.random() * (2)) === 1 ) {
    startPosition[1] = this.dimY * Math.floor(Math.random() * (2));
  } else {
    startPosition[0] = this.dimX * Math.floor(Math.random() * (2));
  }
  return startPosition;
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0,this.dimX , this.dimY + 50);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }

  this.drawPoints(ctx);

};

Game.prototype.drawPoints = function(ctx) {
  ctx.font="50px Courier";
  ctx.fillStyle = "black";
  ctx.fillText(this.points,this.dimX - (50 + (25 * this.points.toString().length)) , this.dimY - 10);

};


Game.prototype.moveObjects = function() {
  for (var i = 0; i < this.allMovingObjects().length; i++) {
    this.allMovingObjects()[i].move(this.dog.pos);
    this.allMovingObjects()[i].applyFriction(0.04);
    this.allMovingObjects()[i].wrap();
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
  for (var i = this.allMovingObjects().length - 1; i >= 0; i--) {
    for(var j = i - 1; j >= 0; j--){
      if (this.objectsCollided(this.allMovingObjects()[i],this.allMovingObjects()[j])) {
        this.allMovingObjects()[i].collideWith(this.allMovingObjects()[j]);
        var tempVel = this.allMovingObjects()[j].vel;
      }
      if (this.objectsCollided(this.allMovingObjects()[j],this.allMovingObjects()[i], tempVel)){
        this.allMovingObjects()[j].collideWith(this.allMovingObjects()[i]);
      }
    }
    for(var k = this.allStationaryObjects().length - 1; k >=0; k--) {
      if(this.objectsCollided(this.allMovingObjects()[i], this.allStationaryObjects()[k])) {
        this.allMovingObjects()[i].collideWith(this.allStationaryObjects()[k]);
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
  this.addAcorns();
  this.dog.applyFriction(0.1);
};


Game.prototype.remove = function(object) {
  if (object.toString() === 'Acorn') {
    this.acorns.splice(this.acorns.indexOf(object), 1);
    this.points += 1;
  }
};
Game.prototype.allMovingObjects = function() {
  return this.squirrels.concat(this.dog);
};

Game.prototype.allStationaryObjects = function() {
  return this.acorns;
};

Game.prototype.allObjects = function() {
  return this.allMovingObjects().concat(this.allStationaryObjects());
};

Game.prototype.isOutOfBounds = function (pos, radius) {
    if ( pos[0] + radius > this.dimX || pos[0] - radius < 0 ) {
      return 'X';
    } else if (pos[1] + radius > this.dimY || pos[1] - radius < 0)  {
      return 'Y';
    }


};

Game.prototype.playerLoses = function () {
  return (this.dog.lives <= 0);
};

Game.prototype.playerWins = function () {
  return (this.squirrels.length === 0);
};

Game.prototype.over = function () {
  return (this.playerLoses() || this.playerWins());
};


module.exports = Game;
