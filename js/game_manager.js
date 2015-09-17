/*
 *  JavaScript game "Catch the Egg"
 *  https://github.com/shtange/catch-the-egg
 *
 *  Copyright 2015, Yurii Shtanhei
 *  site: http://shtange.com/catch-the-egg/
 *  google+: https://plus.google.com/+YuriiShtanhei
 *  habr: http://habrahabr.ru/users/shtange/
 *  email: y.shtanhei@gmail.com
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/MIT
 */

var GameManager = function() {
  this.init();
  this.setup();
  this.start();
}

// Initial game settings
GameManager.prototype.init = function () {
  this.score = 0;
  this.loss = 0;
  this.over = false;
  this.won = false;

  this.count = 4;
  this.level = 1;
  this.speed = 800;
  // this.maxSpeed = 200;
  this.interval = this.speed*2.5;
  this.point = 2;

  this.chickens = {};
  this.eggs = {};

  this.gameTimer;

  this.basketStartPosition = { x: 0, y: 1 };
};

// Set up the game
GameManager.prototype.setup = function () {
  this.keyboard = new KeyboardInputManager();
  this.keyboard.on("move", this.move.bind(this));

  this.grid = new Grid(this.count);
  this.basket = new Basket(this.basketStartPosition);

  for (var i = 0; i < this.count; i++) {
    this.chickens[i] = new Chicken(i, this.grid.list[i], this.point);
  }

  this.HTMLredraw = new HTMLredraw();
};

GameManager.prototype.move = function (key) {
  // 0: up, 1: right, 2: down, 3: left, 4: R - restart
  var position = { x: this.basket.x, y: this.basket.y };

  if (key == 4) {
    this.reStart();
    return false;
  }

  if(key%2 == 0) {
    position.y = (key > 0) ? 0 : 1;
  } else {
    position.x = (key > 2) ? 0 : 1;
  }

  this.basket.updatePosition(position, this.api.bind(this));
}

GameManager.prototype.start = function () {
  this.runGear();
};

GameManager.prototype.reStart = function () {
  window.location.reload();
};

GameManager.prototype.runGear = function () {
  var self = this;
  this.gameTimer = setInterval(function() {
    var chicken = self.findAvailableChicken();
    if (chicken >= 0 && !this.over) {
      self.runEgg(chicken);
    }
  }, this.interval);
};

GameManager.prototype.suspendGear = function () {
  clearInterval(this.gameTimer);
  this.runGear();
};

GameManager.prototype.haltGear = function () {
  clearInterval(this.gameTimer);
  this.over = true;
};

GameManager.prototype.upLevel = function () {
  this.level++;

  switch (true) {
    case (this.level < 8):
      this.speed += -50;
      break;
    case (this.level > 19):
      this.speed += 0;
      break;
    default:
      this.speed += -25;
      break;
  }
  this.interval = this.speed*2.5;

  this.suspendGear();
};

GameManager.prototype.updateScore = function (data) {
  if (this.grid.list[data.egg].x == this.basket.x && this.grid.list[data.egg].y == this.basket.y) {
    this.score += this.point;
    this.HTMLredraw.updateScore({ value: this.score });

    if (this.score >= 1000) {
      this.gameWin();
      return false;
    }

    if (!(this.score % 50)) {
      this.upLevel();
    }
  } else {
    this.loss++;
    this.HTMLredraw.updateLossCount({ loss: this.loss });
    if (this.loss > 2 && !this.over) {
      this.gameOver();
    }
  }
};

GameManager.prototype.findAvailableChicken = function() {
  var avail = this.grid.avail.diff(this.grid.hold);

  if (!avail) {
    return null;
  }

  var chicken = avail.randomElement();
  this.api('onHoldChicken', { egg: chicken });

  return chicken;
};

GameManager.prototype.runEgg = function(chicken) {
  this.chickens[chicken].egg.run(this.speed, this.api.bind(this));
};

GameManager.prototype.gameOver = function() {
  this.haltGear();
  this.HTMLredraw.gameOver();
};

GameManager.prototype.gameWin = function() {
  this.haltGear();
  this.HTMLredraw.gameWin();
};

GameManager.prototype.api = function(method, data) {
  switch (method) {
    case 'updateScore':
      this.updateScore(data);
      break;
    case 'onHoldChicken':
      this.grid.onHold(data.egg);
      break;
    case 'unHoldChicken':
      this.grid.unHold(data.egg);
      break;
    case 'updateEggPosition':
      this.HTMLredraw.updateEggPosition(data);
      break;
    case 'updateBasketPosition':
      this.HTMLredraw.updateBasketPosition(data);
      break;
  }
};
