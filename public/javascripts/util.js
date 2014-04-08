/* Google Analytics */
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-42261140-3']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.scoreKey     = "score";
  this.attemptsKey     = "attempts";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getScore = function () {
  return this.storage.getItem(this.scoreKey) || 0;
};

LocalStorageManager.prototype.setScore = function (score) {
  this.storage.setItem(this.scoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getAttempts = function () {
  return this.storage.getItem(this.attemptsKey) || 0;
};

LocalStorageManager.prototype.setAttempts = function (attempts) {
  this.storage.setItem(this.attemptsKey, attempts);
};

LocalStorageManager.prototype.clearData = function () {
  this.storage.removeItem(this.attemptsKey);
  this.storage.removeItem(this.scoreKey);
};
