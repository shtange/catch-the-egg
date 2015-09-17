Array.prototype.shuffle = function() {
  for(var j, x, k = this.length; k; j = Math.floor(Math.random() * k), x = this[--k], this[k] = this[j], this[j] = x);
  return this;
};

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)]
}

Element.prototype.hide = function() {
  this.style.display = 'none';
};

Element.prototype.show = function() {
  this.style.display = 'block';
};
