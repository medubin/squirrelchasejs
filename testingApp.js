/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// var MovingObject = require ("./movingObject");

	// var Util = require ("./utils");
	// var Squirrel = require("./squirrel");
	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(8);
	// var Dog = require("./dog");



	var canvas = document.getElementById('game-canvas');
	var ctx = canvas.getContext('2d');
	var game = new Game(2);
	var gameView = new GameView(ctx,game);

	canvas.width  = game.dimX;
	canvas.height = game.dimY;

	gameView.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Squirrel = __webpack_require__(2);
	var Dog = __webpack_require__(5);
	var utils = __webpack_require__ (3);
	var Acorn = __webpack_require__(6);
	var Bush = __webpack_require__(10);
	function Game(numSquirrels) {
	  this.numSquirrels = numSquirrels;
	  this.dimX = 1000;
	  this.dimY = 600;
	  this.squirrels = [];
	  this.acorns = [];
	  this.bushes = [];
	  this.dog = new Dog({game: this, pos: [this.dimX/2, this.dimY/2]});
	  this.points = 0;
	  this.addBushes();
	}

	Game.prototype.addSquirrels = function () {
	  for (var i = 0; i < this.numSquirrels; i++) {
	    this.squirrels.push(new Squirrel({pos: this.randSquirrelPosition(), game: this}));
	  }
	};

	Game.prototype.addBushes = function() {
	  this.bushes.push(new Bush({pos: this.randPosition(), game: this}));
	  this.bushes.push(new Bush({pos: this.randPosition(), game: this}));
	  this.bushes.push(new Bush({pos: this.randPosition(), game: this}));
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
	  return this.acorns.concat(this.bushes);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);
	var MovingObject = __webpack_require__ (4);
	var Dog = __webpack_require__(5);

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	  function getRandomIntInclusive(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	  }

	var Utils = {
	  inherits: function (ChildClass, ParentClass) {
	    function Surrogate() {}
	    Surrogate.prototype = ParentClass.prototype;
	    ChildClass.prototype = new Surrogate;
	    ChildClass.prototype.constructor = ChildClass;


	  },

	  randomVect: function (length) {
	    var randX = length * Math.random();
	    var randY = Math.sqrt(Math.pow(length, 2) - Math.pow(randX, 2));
	    randY = randY * [-1,1][getRandomIntInclusive(0,1)];
	    randX = randX * [-1,1][getRandomIntInclusive(0,1)];
	    return [randX,randY];
	  },

	  distanceBetween: function(pos1, pos2) {
	    var xDistance = Math.abs(pos1[0] - pos2[0]);
	    var yDistance = Math.abs(pos1[1] - pos2[1]);
	    var tDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
	    return tDistance;
	  }
	};






	module.exports = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);


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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);
	var MovingObject = __webpack_require__ (4);
	var Squirrel = __webpack_require__(2);

	var COLOR = "rgba(0, 0, 0, 1.0)";
	var RADIUS = 30;
	var SPEED = [0,0];
	var DIRECTION = 0;
	// var dogImage = new Image();
	// dogImage.src = "./dog.gif";

	var dogSprite = new Image();
	dogSprite.src = "./dog_sprites" + Math.floor(Math.random() * (3)) + ".gif";

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


	  ctx.beginPath();
	  ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
	  ctx.lineWidth = 1;
	  ctx.strokeStyle = 'white';
	  ctx.stroke();


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
	  } else if (otherObject.toString() === 'Bush') {
	    this.vel[0] = this.vel[0]/2;
	    this.vel[1] = this.vel[1]/2;
	  }
	};


	module.exports = Dog;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);
	var StationaryObject = __webpack_require__ (7);

	var COLOR = "rgba(255,255,0, 1.0)";
	var RADIUS = 30;

	var acornImage = new Image();
	acornImage.src = "./acorn.gif";

	function Acorn (options) {
	  this.pos = options.pos;
	  this.radius = RADIUS;
	  this.color = COLOR;
	  this.game = options.game;
	}

	utils.inherits(Acorn, StationaryObject);

	Acorn.prototype.toString = function() {
	  return 'Acorn';
	};

	Acorn.prototype.draw = function(ctx) {
	  ctx.drawImage(acornImage, this.pos[0]- 1/3*RADIUS , this.pos[1]- 1/3*RADIUS , RADIUS * 2/3, RADIUS * 2/3);
	  ctx.beginPath();
	  ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
	  ctx.lineWidth = 1;
	  ctx.strokeStyle = 'white';
	  ctx.stroke();


	};


	module.exports = Acorn;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);


	function StationaryObject(options) {
	  this.pos = options.pos;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;

	}

	StationaryObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0],this.pos[1],this.radius,2*Math.PI,0, true);
	  ctx.fill();
	  ctx.lineWidth = 1;
	  ctx.strokeStyle = 'white';
	  ctx.stroke();
	};



	StationaryObject.prototype.isCollidedWith = function(otherObject) {
	  return utils.distanceBetween(this.pos, otherObject.pos) <
	                              (this.radius + otherObject.radius);

	};

	StationaryObject.prototype.collideWith = function (otherObject) {


	};

	 module.exports = StationaryObject;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var key = __webpack_require__(9);

	function GameView(ctx,game) {
	  this.game = game;
	  this.ctx = ctx;
	  this.dog = this.game.dog;

	}
	GameView.prototype.start = function() {
	  var gameLoop = setInterval(function(renderLose) {
	    this.checkKey();
	    this.game.step();
	    this.game.draw(this.ctx);
	    if (this.game.over()){
	      this.renderLose();
	      clearInterval(gameLoop);
	     }
	  }.bind(this), 20);

	};

	GameView.prototype.renderLose = function () {

	  this.ctx.fillStyle = 'black';
	  this.ctx.rect(0,0,this.game.dimX,this.game.dimY + 50);
	  this.ctx.fill();

	  this.ctx.font="50px Courier";
	  this.ctx.fillStyle = "white";
	  if (this.game.points <= 6) this.ctx.fillText('That was ruff!', this.game.dimX / 3, this.game.dimY / 2);
	  if (this.game.points > 6 && this.game.points <= 12) this.ctx.fillText('Doggonit!', this.game.dimX / 3, this.game.dimY / 2);
	  if (this.game.points > 12) this.ctx.fillText('Good boy!', this.game.dimX / 3, this.game.dimY / 2);
	  this.ctx.fillText('You scored ' + this.game.points + ' points!', this.game.dimX / 5, this.game.dimY / 2 + 50);

	};

	GameView.prototype.checkKey = function () {

	  if (key.isPressed('right')) {
	    this.dog.turn(Math.PI/32);
	  }
	  if (key.isPressed('up')) {
	    this.dog.power(0.8);
	  }
	  if (key.isPressed('down')) {
	    this.dog.power(-0.8);
	  }
	  if (key.isPressed('left')) {
	    this.dog.turn(-Math.PI/32);
	  }
	  // if ((!key.isPressed('up')) && (!key.isPressed('down'))) {
	  //   this.dog.;
	  // }
	};

	module.exports = GameView;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (3);
	var StationaryObject = __webpack_require__ (7);

	var COLOR = "rgba(255,255,0, 1.0)";
	var RADIUS = 60;

	var bushImage = new Image();
	bushImage.src = "./bush.gif";

	function Bush (options) {
	  this.pos = options.pos;
	  this.radius = RADIUS;
	  this.color = COLOR;
	  this.game = options.game;
	}

	utils.inherits(Bush, StationaryObject);

	Bush.prototype.toString = function() {
	  return 'Bush';
	};

	Bush.prototype.draw = function(ctx) {
	  ctx.drawImage(bushImage, this.pos[0]- 1/2*RADIUS , this.pos[1]- 1/2*RADIUS , RADIUS, RADIUS);
	  ctx.beginPath();
	  ctx.arc(this.pos[0],this.pos[1],this.radius/2,2*Math.PI,0, true);
	  ctx.lineWidth = 1;
	  ctx.strokeStyle = 'white';
	  ctx.stroke();


	};


	module.exports = Bush;


/***/ }
/******/ ]);