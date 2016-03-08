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

	var MovingObject = __webpack_require__ (1);
	var Util = __webpack_require__ (2);
	var Squirrel = __webpack_require__(8);
	var Game = __webpack_require__(5);
	var GameView = __webpack_require__(6);
	var Dog = __webpack_require__(9);


	var canvas = document.getElementById('game-canvas');
	var ctx = canvas.getContext('2d');
	var game = new Game(1);
	var gameView = new GameView(ctx,game);

	canvas.width  = game.dimX;
	canvas.height = game.dimY + 50;

	gameView.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);


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



	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.wrap = function () {
	  var outOfBounds = this.game.isOutOfBounds(this.pos);
	  if (outOfBounds === 'X') {
	      this.vel[0] = this.vel[0] * -1;
	  } else if (outOfBounds === 'Y') {
	      this.vel[1] = this.vel[1] * -1;
	  }
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  return utils.distanceBetween(this.pos, otherObject.pos) <
	                              (this.radius + otherObject.radius);

	};

	MovingObject.prototype.collideWith = function (otherObject) {


	};

	 module.exports = MovingObject;


/***/ },
/* 2 */
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
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Squirrel = __webpack_require__(8);
	var Dog = __webpack_require__(9);
	var utils = __webpack_require__ (2);
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(5);
	var key = __webpack_require__(7);

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
	  console.log('what');
	};

	GameView.prototype.renderLose = function () {

	  this.ctx.fillStyle = 'black';
	  this.ctx.rect(0,0,this.game.dimX,this.game.dimY + 50);
	  this.ctx.fill();

	  this.ctx.font="50px Courier";
	  this.ctx.fillStyle = "white";
	  this.ctx.fillText('Game Over!', this.game.dimX / 3, this.game.dimY / 2);
	  this.ctx.fillText('You scored ' + this.game.points + ' points!', this.game.dimX / 5, this.game.dimY / 2 + 50);

	};

	GameView.prototype.checkKey = function () {

	  if (key.isPressed('right')) {
	    this.dog.turn(Math.PI/32);
	  }
	  if (key.isPressed('up')) {
	    this.dog.power(0.3);
	  }
	  if (key.isPressed('left')) {
	    this.dog.turn(-Math.PI/32);
	  }
	};

	module.exports = GameView;


/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);
	var MovingObject = __webpack_require__ (1);
	var Dog = __webpack_require__(9);

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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__ (2);
	var MovingObject = __webpack_require__ (1);
	var Squirrel = __webpack_require__(8);

	var COLOR = "rgba(255, 255, 255, 0.0)";
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
	  console.log(this.direct);
	  this.direct += angle;

	};


	Dog.prototype.applyFriction = function (factor) {
	  this.vel[0] -= this.vel[0] * factor;
	  this.vel[1] -= this.vel[1] * factor;

	};

	Dog.prototype.collideWith = function (otherObject) {
	  if (otherObject.toString() === 'Squirrel') {
	    this.relocate();
	  }
	};


	module.exports = Dog;


/***/ }
/******/ ]);