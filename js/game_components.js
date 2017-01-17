/*
 *  "Catch the Egg" JavaScript Game
 *  source code  : https://github.com/shtange/catch-the-egg
 *  play it here : https://shtange.github.io/catch-the-egg/
 *
 *  Copyright 2015, Yurii Shtanhei
 *  GitHub : https://github.com/shtange/
 *  Habr   : https://habrahabr.ru/users/shtange/
 *  email  : y.shtanhei@gmail.com
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/MIT
 */

/*
 *  Grid
 */
function Grid(count) {
  this.count = count;
  this.list = {};

  this.avail = [];
  this.hold = [];

  this.init();
}

Grid.prototype.init = function() {
  for (var i = 0; i < this.count; i++) {
    var value = {};

    if(i%2 == 0) {
      value.x = (i > 0) ? 1 : 0;
      value.y = (i > 0) ? 1 : 0;
    } else {
      value.x = (i > this.count/2) ? 1 : 0;
      value.y = (i > this.count/2) ? 0 : 1;
    }

    this.avail.push(i);
    this.list[i] = value;
  }
};

Grid.prototype.onHold = function(key) {
  this.hold.push(key);
};

Grid.prototype.unHold = function(key) {
  var index = this.hold.indexOf(key);
  this.hold.splice(index, 1);
};


/*
 *  Chicken
 */
function Chicken(key, position) {
  this.key = key;
  this.x = position.x;
  this.y = position.y;

  this.egg = new Egg(this.key, 0);
}

/*
 *  Egg
 */
function Egg(chicken, step, point) {
  this.chicken = chicken;
  this.step = step;
  this.point = point;
  this.amount = 5;

  this.callback;
  this.timer;
}

Egg.prototype.run = function(speed, callback) {
  this.callback = callback;

  var self = this;
  this.timer = setInterval(function() {
    self.nextStep();
  }, speed);
};

Egg.prototype.nextStep = function() {
  ++this.step;

  this.callback('updateEggPosition', { egg: this.chicken, position: this.step });

  if (this.step > this.amount) {
    clearInterval(this.timer);
    this.step = 0;
    this.callback('updateEggPosition', { egg: this.chicken, position: 0 });
    this.callback('unHoldChicken', { egg: this.chicken });
    this.callback('updateScore', { egg: this.chicken, point: this.point });
  }
};


/*
 *  Basket
 */
function Basket(position) {
  this.x = position.x;
  this.y = position.y;

  this.callback;
}

Basket.prototype.updatePosition = function (position, callback) {
  this.callback = callback;

  this.x = position.x;
  this.y = position.y;

  this.callback('updateBasketPosition', { x: this.x, y: this.y });
};
