var Squirrel = require('./squirrel');
var Dog = require('./dog');
var utils = require ("./utils");
var Acorn = require('./acorn');
var Bush = require('./bush');
var Bone = require('./bone');
function Game(numSquirrels) {
  this.numSquirrels = numSquirrels;
  this.dimX = 1000;
  this.dimY = 600;
  this.squirrels = [];
  this.acorns = [];
  this.bushes = [];
  this.bones = [];
  this.dog = new Dog({game: this, pos: [this.dimX/2, this.dimY/2]});
  this.points = 0;
  this.barkvalue = 0;
  this.addBushes();
  this.state = 'start';
  // var snd = new Audio("Finalcountdown.wav"); // buffers automatically when created
  // snd.play();
}

Game.prototype.addSquirrels = function () {
  for (var i = 0; i < this.numSquirrels; i++) {
    this.squirrels.push(new Squirrel({pos: this.randSquirrelPosition(), game: this}));
  }
};

Game.prototype.addBushes = function() {
  this.addBush();
  this.addBush();
  this.addBush();

};

Game.prototype.addBush = function(){
  var placeable = false;
  while(!placeable) {
    var randomPos = this.randPosition();
    placeable = true;
    for (var i = 0; i < this.bushes.length; i++) {
      if (utils.distanceBetween(this.bushes[i].pos, randomPos) < this.bushes[i].radius * 2) {
        placeable = false;
      }
    }
  }
  this.bushes.push(new Bush({pos: randomPos, game: this}));
};

Game.prototype.addAcorns = function() {
  if (this.acorns.length === 0) {
    this.addAcorn();
    this.addAcorn();
    if (this.points !== 0) this.addSquirrels();
    if (this.points && this.points % 6 === 0) this.addBone();
  }
};

Game.prototype.addAcorn = function() {
  var placeable = false;
  while(!placeable) {
    var randomPos = this.randPosition();
    placeable = true;
    for (var i = 0; i < this.allStationaryObjects().length; i++) {
      if (utils.distanceBetween(this.allStationaryObjects()[i].pos, randomPos) < this.allStationaryObjects()[i].radius * 2) {
        placeable = false;
      }
    }
  }
  this.acorns.push(new Acorn({pos: randomPos, game: this}));
};

Game.prototype.addBone = function() {
  var placeable = false;
  while(!placeable) {
    var randomPos = this.randPosition();
    placeable = true;
    for (var i = 0; i < this.allStationaryObjects().length; i++) {
      if (utils.distanceBetween(this.allStationaryObjects()[i].pos, randomPos) < this.allStationaryObjects()[i].radius * 2) {
        placeable = false;
      }
    }
  }
  this.bones.push(new Bone({pos: randomPos, game: this}));
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
  if (this.barkvalue > 0) this.barkvalue -= 1;
  ctx.clearRect(0,0,this.dimX , this.dimY + 50);
  for (var i = 0; i < this.allObjects().length; i++) {
    this.allObjects()[i].draw(ctx);
  }
  this.drawBottom(ctx);
  this.drawPoints(ctx);
  this.drawBones(ctx);

};

Game.prototype.drawPoints = function(ctx) {
  ctx.font="50px Courier";
  ctx.fillStyle = "black";
  ctx.fillText('Points: ' + this.points,this.dimX - (25 + (25 * (this.points.toString().length+ 9))) , this.dimY + 40);
};


Game.prototype.drawBones = function(ctx) {
  ctx.font="50px Courier";
  ctx.fillStyle = "black";
  ctx.fillText('Bones: ' + this.dog.bones, 25 , this.dimY + 40);
};

Game.prototype.drawBottom = function(ctx) {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.moveTo(0,this.dimY);
  ctx.lineTo(this.dimX, this.dimY);
  ctx.stroke();
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
  } else if (object.toString() === 'Bone') {
    this.bones.splice(this.bones.indexOf(object), 1);
  }
};
Game.prototype.allMovingObjects = function() {
  return this.squirrels.concat(this.dog);
};

Game.prototype.allStationaryObjects = function() {
  return this.acorns.concat(this.bushes).concat(this.bones);
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

// Game.prototype.playerWins = function () {
//   return (this.squirrels.length === 0);
// };

Game.prototype.over = function () {
  if (this.playerLoses()) {
    this.state = 'over';
    return (true);
  }
};


module.exports = Game;
