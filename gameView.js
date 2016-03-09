var Game = require('./game');
var key = require('./keymaster.js');

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
