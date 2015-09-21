function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    82: 4  // R
  };

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey && event.ctrlKey && event.metaKey &&
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers && mapped !== undefined) {
      event.preventDefault();
      self.emit("move", mapped);
    }

  });
  document.addEventListener("touchend", function(event) {
    if (event && event.target && event.target.classList.contains("touch-spot")) {
      if (event.target.classList.contains("touch-spot-0")) {
        self.emit("move", "left-top");
      } else if (event.target.classList.contains("touch-spot-1")) {
        self.emit("move", "left-bottom");
      } else if (event.target.classList.contains("touch-spot-2")) {
        self.emit("move", "right-top");
      } else if (event.target.classList.contains("touch-spot-3")) {
        self.emit("move", "right-bottom");
      }
    }
  });
};