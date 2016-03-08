var utils = require ("./utils");
var StationaryObject = require ("./stationaryObject");

var COLOR = "rgba(255,255,0, 1.0)";
var RADIUS = 5;


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

module.exports = Acorn;
