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
    38: { key: 0, type: 'arrow' }, // Up
    39: { key: 1, type: 'arrow' }, // Right
    40: { key: 2, type: 'arrow' }, // Down
    37: { key: 3, type: 'arrow' }, // Left

    81: { x: 0, y: 1, type: 'button' }, // Top-Left
    69: { x: 1, y: 1, type: 'button' }, // Top-Right
    68: { x: 1, y: 0, type: 'button' }, // Bottom-Right
    65: { x: 0, y: 0, type: 'button' }, // Bottom-Left

    82: { key: 'restart', type: 'common' }  // Restart
  };

  document.addEventListener('keydown', function (event) {
    var modifiers = event.altKey && event.ctrlKey && event.metaKey &&
                    event.shiftKey;
    var data    = map[event.which];

    if (!modifiers && data !== undefined) {
      event.preventDefault();
      self.emit('move', data);
    }

  });
};