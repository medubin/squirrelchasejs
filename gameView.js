var Game = require('./game');
var key = require('./keymaster.js');
var Dog = require('./dog');

function GameView(ctx,game) {
  this.game = game;
  this.ctx = ctx;
  this.dog = this.game.dog;



}
GameView.prototype.start = function() {

  var thisCount = this.gameCOunt;
  var gameLoop = setInterval(function() {

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
  var gameOverLoop = setInterval(function() {
    this.ctx.fillStyle = 'black';
    this.ctx.rect(0,0,this.game.dimX,this.game.dimY + 50);
    this.ctx.fill();
    this.ctx.font="50px Courier";
    this.ctx.fillStyle = "white";
    if (this.game.points <= 6){
       this.ctx.fillText('That was ruff!', this.game.dimX / 3, this.game.dimY / 2);
    } else if (this.game.points <= 12) {
      this.ctx.fillText('Doggonit!', this.game.dimX / 3, this.game.dimY / 2);
    } else if (this.game.points < 12) {
      this.ctx.fillText('Good boy!', this.game.dimX / 3, this.game.dimY / 2);
    } else if (this.game.points < 18) {
      this.ctx.fillText('Hot dog!', this.game.dimX / 3, this.game.dimY / 2);
    } else {
      this.ctx.fillText('Top dog!', this.game.dimX / 3, this.game.dimY / 2);
    }
      this.ctx.fillText('You scored ' + this.game.points + ' points!', this.game.dimX / 5, this.game.dimY / 2 + 50);

    this.checkKey();
    if(this.game.state !=='over') {
      clearInterval(gameOverLoop);
      this.start();
    }

  }.bind(this));

};

GameView.prototype.checkKey = function () {
  if (key.isPressed('right')) {
    this.dog.turn(Math.PI/32);
  }
  if (key.isPressed('up')) {
    this.dog.power(0.8);
  }
  if (key.isPressed('down')) {
    this.dog.power(-0.4);
  }
  if (key.isPressed('left')) {
    this.dog.turn(-Math.PI/32);
  }

  if (key.isPressed('space')) {
    this.dog.bark();
  }
  if (key.isPressed('enter')) {
    console.log(this.game.state);
    if (this.game.state === 'over') {
      this.game.numSquirrels = 2;
      this.game.dimX = 1000;
      this.game.dimY = 600;
      this.game.squirrels = [];
      this.game.acorns = [];
      this.game.bushes = [];
      this.game.bones = [];
      this.game.points = 0;
      this.game.barkvalue = 0;
      this.game.addBushes();
      this.game.state = 'start';

      this.dog.direct = 0;
      this.dog.lives = 1;
      this.dog.bones = 0;
    }
  }
  // if ((!key.isPressed('up')) && (!key.isPressed('down'))) {
  //   this.dog.;
  // }
};

module.exports = GameView;
